import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateCandidateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @ValidateIf((o) => o.phoneCountryCode != null && o.phoneCountryCode !== '')
  @Matches(/^\+[1-9]\d{0,3}$/, {
    message: 'Country code must start with + followed by digits (e.g. +32)',
  })
  phoneCountryCode?: string;

  @IsOptional()
  @ValidateIf((o) => o.phone != null && String(o.phone).trim() !== '')
  @IsString()
  @MaxLength(30)
  @Matches(/^[\d\s().-]+$/, {
    message: 'Phone number may only contain digits and separators',
  })
  phone?: string;

  @IsOptional()
  @ValidateIf((o) => o.linkedInUrl != null && o.linkedInUrl !== '')
  @IsUrl({ require_protocol: true })
  linkedInUrl?: string;

  @IsOptional()
  @ValidateIf((o) => o.portfolioUrl != null && o.portfolioUrl !== '')
  @IsUrl({ require_protocol: true })
  portfolioUrl?: string;

  @IsOptional()
  @ValidateIf((o) => o.githubUrl != null && o.githubUrl !== '')
  @IsUrl({ require_protocol: true })
  githubUrl?: string;

  @IsOptional()
  @ValidateIf((o) => o.websiteUrl != null && o.websiteUrl !== '')
  @IsUrl({ require_protocol: true })
  websiteUrl?: string;

  @IsOptional()
  @ValidateIf((o) => o.resumeUrl != null && o.resumeUrl !== '')
  @IsUrl({ require_protocol: true })
  resumeUrl?: string;
}
