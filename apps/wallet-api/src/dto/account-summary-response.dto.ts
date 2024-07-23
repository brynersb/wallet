import { ApiProperty } from '@nestjs/swagger';
import { TransactionsResponseDto } from './transaction-response.dto';

export class AccountSummaryResonseDto {
  @ApiProperty({ example: 100.0, description: 'Saldo atual da conta' })
  balance: number;

  @ApiProperty({ type: [TransactionsResponseDto], description: 'Lista de transações no intervalo especificado' })
  transactions: TransactionsResponseDto[];
}
