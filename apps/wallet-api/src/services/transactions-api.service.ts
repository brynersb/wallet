import { Inject, Injectable } from '@nestjs/common';
import { TransactionEntityDomain } from '../../../../libs/domain/wallet/entities/transaction-entity-domain';
import { BusinessError } from '../../../../libs/domain/common/types/business-error';
import { TransactionRequestUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/transactions/transaction-request-use-case/transaction-request-use-case.interface';
import { GetTransactionStatusUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/transactions/get-transaction-status-use-case/get-transaction-status-case.interface';
import { TransactionOperationRequest } from '../../../../libs/domain/wallet/types/transaction-operation-type';

@Injectable()
export class TransactionsApiService {
  constructor(
    @Inject('RequestTransactionUseCaseInterface')
    private readonly transactionRequest: TransactionRequestUseCaseInterface,
    @Inject('GetTransactionStatusUseCaseInterface')
    private readonly getTransactionStatus: GetTransactionStatusUseCaseInterface,
  ) {}

  async createTransaction(
    transactionRequest: TransactionOperationRequest,
  ): Promise<TransactionEntityDomain | BusinessError> {
    return await this.transactionRequest.execute(transactionRequest);
  }
  async getTransaction(transactionId: string): Promise<TransactionEntityDomain | BusinessError> {
    return await this.getTransactionStatus.execute(transactionId);
  }
}
