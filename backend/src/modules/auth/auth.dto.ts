import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class HrRegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  fullName!: string;

  @IsString()
  companyName!: string;

  @IsString()
  @MinLength(10)
  teamProfile!: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;
}

export class UpdateCompanyProfileDto {
  @IsString()
  @MinLength(10)
  teamProfile!: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;
}

export class GenerateTeamProfileFromWebsiteDto {
  @IsString()
  @MinLength(1)
  companyName!: string;

  @IsString()
  websiteUrl!: string;
}

export class CandidateRegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  displayName!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(['hr', 'candidate'])
  role!: 'hr' | 'candidate';
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
