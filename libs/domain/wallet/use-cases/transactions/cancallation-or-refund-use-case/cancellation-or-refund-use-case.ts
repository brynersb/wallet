import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { MessageBody } from '../../../../common/types/messae-body.type';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { CancellationOrRefundUseCaseInterface } from './cancellation-or-refund-use-case.interface';

export class CancellationOrRefundUseCase implements CancellationOrRefundUseCaseInterface {
  private errorMessage: string;
  constructor(
    private readonly loggerService: LoggerServiceInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
    protected readonly accountRepository: AccountRepositoryInterface,
  ) {}
  async execute(messae: MessageBody): Promise<void> {
    try {
      const { transactionId } = messae;
      this.loggerService.log(`Start get transaction:${transactionId}`);
      const transactionFinded = await this.transactionRepository.findById(transactionId);

      if (!transactionFinded) {
        this.errorMessage = `Transaction not found: transactionId:${transactionId}`;
        this.loggerService.error(this.errorMessage);
      }

      const accauntFinded = await this.accountRepository.findById(transactionFinded.account?.id);

      accauntFinded.addAmount(transactionFinded.amount.toString());

      await this.accountRepository.update(accauntFinded);

      transactionFinded.updateStatusProcessed();
      await this.transactionRepository.update(transactionFinded);

      this.loggerService.log(`Succesfully get transaction status:${JSON.stringify(transactionFinded)}`);
    } catch (error) {
      this.errorMessage = `An error has occurred while get transaction by id, error:${error.message}`;
      this.loggerService.error(this.errorMessage);
    }
  }
}
