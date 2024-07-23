import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { BaseTransactionUseCase } from '../base-transaction-use-case';
import { DepositAmounttUseCaseInterface } from './deposit-amount-use-case.interface';

export class DepositAmountUseCase extends BaseTransactionUseCase implements DepositAmounttUseCaseInterface {
  protected async processTransaction(account: AccountEntityDomain, amount: number): Promise<void> {
    account.addAmount(amount.toString());
  }
}
