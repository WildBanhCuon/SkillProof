import { IsIn } from 'class-validator';

export class UpdateApplicationDecisionDto {
  @IsIn(['interview', 'decline'])
  decision!: 'interview' | 'decline';
}
