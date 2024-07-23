import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';

export class TransactionRequestDto {
  @ApiProperty({
    description: 'Account Id',
    example: '16153f35-5b0a-4eb6-a4b4-c1ea55816bde',
  })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'Transaction Type',
    example: TransactionType.DEPOSIT,
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsString()
  type: TransactionType;

  @ApiProperty({
    description: 'Customer Id',
    example: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
  })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Amount',
    example: 10.5,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    description: 'Transaction Id (mandatory in cases of cancellation or refund of amounts)',
    example: 'add result id transacion for cancellation or refund',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
