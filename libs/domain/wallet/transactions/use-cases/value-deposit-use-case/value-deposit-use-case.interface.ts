import { TransactionOperation } from '../../types/transaction-operation-request.type';

export interface ValueDepositUseCaseInterface {
  execute(request: TransactionOperation): Promise<void>;
}
