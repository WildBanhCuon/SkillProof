import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  MAX_ANSWER_NOTES_LENGTH,
  MAX_CODE_ANSWER_LENGTH,
} from '../../common/assessment-answer-limits';

export class StartSessionDto {
  @IsEnum(['practice', 'application'])
  mode!: 'practice' | 'application';
}

export class SaveAnswerDto {
  @IsString()
  @MaxLength(MAX_CODE_ANSWER_LENGTH)
  submittedCode!: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_ANSWER_NOTES_LENGTH)
  notes?: string;
}
