import { TransactionOperation } from '../../types/transaction-operation-type';

export interface ValueDepositUseCaseInterface {
  execute(request: TransactionOperation): Promise<void>;
}
