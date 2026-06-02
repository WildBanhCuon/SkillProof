import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const CANDIDATE_JOB_SORT_OPTIONS = [
  'newest',
  'oldest',
  'title_asc',
  'title_desc',
  'duration_asc',
  'duration_desc',
] as const;
import { PROFILE_FIELD_KEYS } from '../../common/profile-fields';

export class GenerateJobFromWizardDto {
  @IsString()
  @MinLength(2)
  roleTitle!: string;

  @IsString()
  @IsIn(['intern', 'junior', 'mid'])
  seniority!: string;

  @IsString()
  @MinLength(10)
  teamContext!: string;

  @IsString()
  @MinLength(10)
  responsibilities!: string;

  @IsString()
  @MinLength(3)
  mustHaveSkills!: string;

  @IsOptional()
  @IsString()
  niceToHaveSkills?: string;

  @IsString()
  @IsIn(['none', '0-1', '1-2', '2+'])
  experienceLevel!: string;

  @IsString()
  @IsIn(['remote', 'hybrid', 'onsite'])
  workMode!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsIn(['professional', 'friendly', 'startup'])
  tone!: string;
}

export class CreateJobDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @IsOptional()
  @IsArray()
  @IsIn([...PROFILE_FIELD_KEYS], { each: true })
  requiredProfileFields?: string[];
}

export class ListCandidateJobsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  company?: string;

  @IsOptional()
  @IsIn([...CANDIDATE_JOB_SORT_OPTIONS])
  sort?: (typeof CANDIDATE_JOB_SORT_OPTIONS)[number];
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsIn([...PROFILE_FIELD_KEYS], { each: true })
  requiredProfileFields?: string[];
}
