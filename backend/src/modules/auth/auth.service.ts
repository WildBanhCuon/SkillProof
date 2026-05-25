import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { WebpageFetchService } from '../web/webpage-fetch.service';
import {
  CandidateRegisterDto,
  GenerateTeamProfileFromWebsiteDto,
  HrRegisterDto,
  LoginDto,
  UpdateCompanyProfileDto,
  UpdateHrProfileDto,
} from './auth.dto';
import { JwtPayload } from './auth.types';

function defaultNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user';
  const spaced = local.replace(/[._+-]+/g, ' ').trim();
  if (!spaced) return 'User';
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly gemini: GeminiService,
    private readonly webpage: WebpageFetchService,
  ) {}

  async registerHr(dto: HrRegisterDto) {
    const existing = await this.prisma.hrUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const websiteUrl = dto.websiteUrl?.trim()
      ? this.webpage.normalizeWebsiteUrl(dto.websiteUrl)
      : undefined;
    const fullName = dto.fullName?.trim() || defaultNameFromEmail(dto.email);
    const companyName = dto.companyName?.trim() || 'My company';
    const teamProfile = dto.teamProfile?.trim() || null;

    const company = await this.prisma.company.create({
      data: {
        name: companyName,
        teamProfile,
        websiteUrl,
        hrUsers: {
          create: {
            email: dto.email,
            passwordHash,
            fullName,
            role: 'ADMIN',
          },
        },
      },
      include: { hrUsers: true },
    });
    const user = company.hrUsers[0];
    return this.issueTokens({
      sub: user.id,
      email: user.email,
      role: 'hr',
      companyId: company.id,
      fullName: user.fullName,
    });
  }

  async registerCandidate(dto: CandidateRegisterDto) {
    const existing = await this.prisma.candidateUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const displayName =
      dto.displayName?.trim() || defaultNameFromEmail(dto.email);
    const user = await this.prisma.candidateUser.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName,
      },
    });
    return this.issueTokens({
      sub: user.id,
      email: user.email,
      role: 'candidate',
      fullName: user.displayName,
    });
  }

  async login(dto: LoginDto) {
    if (dto.role === 'hr') {
      const user = await this.prisma.hrUser.findUnique({
        where: { email: dto.email },
      });
      if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.issueTokens({
        sub: user.id,
        email: user.email,
        role: 'hr',
        companyId: user.companyId,
        fullName: user.fullName,
      });
    }

    const user = await this.prisma.candidateUser.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens({
      sub: user.id,
      email: user.email,
      role: 'candidate',
      fullName: user.displayName,
    });
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { hrUser: true, candidateUser: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    let payload: JwtPayload;
    if (stored.hrUser) {
      payload = {
        sub: stored.hrUser.id,
        email: stored.hrUser.email,
        role: 'hr',
        companyId: stored.hrUser.companyId,
        fullName: stored.hrUser.fullName,
      };
    } else if (stored.candidateUser) {
      payload = {
        sub: stored.candidateUser.id,
        email: stored.candidateUser.email,
        role: 'candidate',
        fullName: stored.candidateUser.displayName,
      };
    } else {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.issueTokens(payload);
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
  }

  async generateTeamProfileFromWebsite(
    dto: GenerateTeamProfileFromWebsiteDto,
    user?: JwtPayload,
  ) {
    const websiteUrl = this.webpage.normalizeWebsiteUrl(dto.websiteUrl);
    const excerpts = await this.webpage.collectPublicText(websiteUrl);
    const companyId =
      user?.role === 'hr' && user.companyId ? user.companyId : undefined;

    const result = await this.gemini.generateTeamProfileFromWebsite(
      companyId,
      dto.companyName.trim(),
      websiteUrl,
      excerpts,
    );

    if (companyId) {
      await this.prisma.company.update({
        where: { id: companyId },
        data: { websiteUrl },
      });
    }

    return {
      teamProfile: result.teamProfile,
      websiteUrl,
      sources: result.sources,
    };
  }

  async updateHrProfile(user: JwtPayload, dto: UpdateHrProfileDto) {
    if (user.role !== 'hr' || !user.companyId) {
      throw new UnauthorizedException();
    }

    const hrData: { fullName?: string } = {};
    if (dto.fullName?.trim()) hrData.fullName = dto.fullName.trim();

    const companyData: {
      name?: string;
      teamProfile?: string | null;
      websiteUrl?: string | null;
    } = {};
    if (dto.companyName?.trim()) companyData.name = dto.companyName.trim();
    if (dto.teamProfile !== undefined) {
      companyData.teamProfile = dto.teamProfile.trim() || null;
    }
    if (dto.websiteUrl !== undefined) {
      companyData.websiteUrl = dto.websiteUrl.trim()
        ? this.webpage.normalizeWebsiteUrl(dto.websiteUrl)
        : null;
    }

    await this.prisma.$transaction([
      ...(Object.keys(hrData).length
        ? [
            this.prisma.hrUser.update({
              where: { id: user.sub },
              data: hrData,
            }),
          ]
        : []),
      ...(Object.keys(companyData).length
        ? [
            this.prisma.company.update({
              where: { id: user.companyId },
              data: companyData,
            }),
          ]
        : []),
    ]);

    return this.me(user);
  }

  async updateCompanyProfile(user: JwtPayload, dto: UpdateCompanyProfileDto) {
    return this.updateHrProfile(user, {
      teamProfile: dto.teamProfile,
      websiteUrl: dto.websiteUrl,
    });
  }

  async me(user: JwtPayload) {
    if (user.role === 'hr') {
      const hr = await this.prisma.hrUser.findUnique({
        where: { id: user.sub },
        include: { company: true },
      });
      if (!hr) throw new UnauthorizedException();
      return {
        id: hr.id,
        role: 'hr' as const,
        email: hr.email,
        fullName: hr.fullName,
        companyId: hr.companyId,
        companyName: hr.company.name,
        companyTeamProfile: hr.company.teamProfile ?? '',
        companyWebsiteUrl: hr.company.websiteUrl ?? '',
      };
    }
    const c = await this.prisma.candidateUser.findUnique({
      where: { id: user.sub },
    });
    if (!c) throw new UnauthorizedException();
    return {
      id: c.id,
      role: 'candidate' as const,
      email: c.email,
      fullName: c.displayName,
    };
  }

  private async issueTokens(payload: JwtPayload) {
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES', '15m'),
    });
    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt,
        hrUserId: payload.role === 'hr' ? payload.sub : undefined,
        candidateUserId: payload.role === 'candidate' ? payload.sub : undefined,
      },
    });

    let companyTeamProfile: string | undefined;
    let companyName: string | undefined;
    let companyWebsiteUrl: string | undefined;
    if (payload.role === 'hr' && payload.companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: payload.companyId },
      });
      companyName = company?.name;
      companyTeamProfile = company?.teamProfile ?? '';
      companyWebsiteUrl = company?.websiteUrl ?? '';
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
        fullName: payload.fullName,
        companyId: payload.companyId,
        companyName,
        companyTeamProfile,
        companyWebsiteUrl,
      },
    };
  }
}
