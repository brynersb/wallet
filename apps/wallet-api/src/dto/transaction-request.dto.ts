import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';

export class TransactionRequestDto {
  /**
   * Account Id
   * @example 16153f35-5b0a-4eb6-a4b4-c1ea55816bdc
   */
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  /**
   * Transacion Type
   * @example ADDITION || WITHDRAWAL || PURCHASE || CANCELLATION || REFUND

   */
  @IsNotEmpty()
  @IsString()
  type: TransactionType;

  /**
   * Customer Id
   * @example 16153f35-5b0a-4eb6-a4b4-c1ea55816bdc
   */
  @IsNotEmpty()
  @IsString()
  customerId: string;

  /**
   * Camount
   * @example 10,50
   */
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}
