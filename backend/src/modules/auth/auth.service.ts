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
import {
  CandidateRegisterDto,
  HrRegisterDto,
  LoginDto,
} from './auth.dto';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async registerHr(dto: HrRegisterDto) {
    const existing = await this.prisma.hrUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const company = await this.prisma.company.create({
      data: {
        name: dto.companyName,
        hrUsers: {
          create: {
            email: dto.email,
            passwordHash,
            fullName: dto.fullName,
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
    const user = await this.prisma.candidateUser.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
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

    return {
      accessToken,
      refreshToken,
      user: {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
        fullName: payload.fullName,
        companyId: payload.companyId,
        companyName:
          payload.role === 'hr'
            ? (
                await this.prisma.company.findUnique({
                  where: { id: payload.companyId! },
                })
              )?.name
            : undefined,
      },
    };
  }
}
