import { Inject, Injectable } from '@nestjs/common';
import { MessageProcessorInterface } from '../../../../libs/domain/common/services/message-processor/message-processor.interface';
import { MessageBody } from '../../../../libs/domain/common/types/messae-body.type';
import { DepositAmounttUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/transactions/deposit-amount-use-case/deposit-amount-use-case.interface';
import { TransactionType } from '../../../../libs/domain/wallet/enums/transaction-type.enum';
import { CancellationOrRefundUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/transactions/cancallation-or-refund-use-case/cancellation-or-refund-use-case.interface';

@Injectable()
export class WalletProcessorService implements MessageProcessorInterface {
  constructor(
    @Inject('DepositAmounttUseCaseInterface')
    private readonly depositAmounttUseCase: DepositAmounttUseCaseInterface,
    @Inject('WithdrawalAmounttUseCaseInterface')
    private readonly withdrawalAmounttUse: DepositAmounttUseCaseInterface,
    @Inject('CancellationOrRefundUseCaseInterface')
    private readonly cancellationOrRefundUseCase: CancellationOrRefundUseCaseInterface,
  ) {}

  async processMessage(messageBody: MessageBody): Promise<void> {
    switch (messageBody.transactionType) {
      case TransactionType.DEPOSIT:
        await this.depositAmounttUseCase.execute(messageBody);
        break;
      case TransactionType.WITHDRAWAL:
        await this.withdrawalAmounttUse.execute(messageBody);
        break;
      case TransactionType.BUY:
        await this.withdrawalAmounttUse.execute(messageBody);
        break;
      case TransactionType.CANCELLATION:
        await this.cancellationOrRefundUseCase.execute(messageBody);
        break;
      case TransactionType.REFUND:
        await this.cancellationOrRefundUseCase.execute(messageBody);
        break;
      default:
        throw new Error(`Unsupported transactionType: ${messageBody.transactionType}`);
    }
  }
}
