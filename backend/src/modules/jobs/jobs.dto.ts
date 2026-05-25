import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

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
}
