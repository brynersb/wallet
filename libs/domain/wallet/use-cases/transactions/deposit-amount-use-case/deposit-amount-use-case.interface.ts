import { TransactionOperation } from '../../../types/transaction-operation-type';

export interface DepositAmounttUseCaseInterface {
  execute(request: TransactionOperation): Promise<void>;
}
