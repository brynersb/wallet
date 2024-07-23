import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class AccountSummaryRequestDto {
  @ApiProperty({ example: '2024-01-01', description: 'Data inicial do intervalo' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-01-31', description: 'Data final do intervalo' })
  @IsDateString()
  endDate: string;
}
