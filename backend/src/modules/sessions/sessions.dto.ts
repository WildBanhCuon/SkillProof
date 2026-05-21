import { IsEnum, IsOptional, IsString } from 'class-validator';

export class StartSessionDto {
  @IsEnum(['practice', 'application'])
  mode!: 'practice' | 'application';
}

export class SaveAnswerDto {
  @IsString()
  submittedCode!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
