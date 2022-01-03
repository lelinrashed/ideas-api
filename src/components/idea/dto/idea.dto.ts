import { IsString } from 'class-validator';

export class ideaDto {
  @IsString()
  idea: string;

  @IsString()
  description: string;
}
