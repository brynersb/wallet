import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { BaseTransactionUseCase } from '../base-transaction-use-case';
import { WithdrawalAmountUseCaseInterface } from './withdrawal-amount-use-case.interface';

export class WithdrawalAmountUseCase extends BaseTransactionUseCase implements WithdrawalAmountUseCaseInterface {
  protected async processTransaction(account: AccountEntityDomain, amount: number): Promise<void> {
    account.subtractAmount(amount);
  }
}
