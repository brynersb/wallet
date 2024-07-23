import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';

export class TransactionsResponseDto {
  @ApiProperty({
    description: 'Transaction Id',
    example: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
  })
  id: string;

  @ApiProperty({
    description: 'Account Id',
    example: '16153f35-5b0a-4eb6-a4b4-c1ea55816bde',
  })
  accountId: string;

  @ApiProperty({
    description: 'Transaction Type',
    example: TransactionType.DEPOSIT,
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Amount',
    example: 10.5,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction Status',
    example: TransactionStatus.PROCESSED,
  })
  status: string;

  @ApiProperty({
    description: 'Creation Date',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last Update Date',
    example: '2024-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
