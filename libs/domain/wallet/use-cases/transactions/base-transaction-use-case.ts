import { LoggerServiceInterface } from '../../../common/services/logger/logger.service.interface';
import { MessageBody } from '../../../common/types/messae-body.type';
import { AccountEntityDomain } from '../../entities/account-entity-domain';
import { TransactionEntityDomain } from '../../entities/transaction-entity-domain';
import { TransactionStatus } from '../../enums/transaction-type.enum';
import { AccountRepositoryInterface } from '../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../repositories/transaction.repository.interface';

export abstract class BaseTransactionUseCase {
  protected transactionFinded: TransactionEntityDomain;

  constructor(
    protected readonly loggerService: LoggerServiceInterface,
    protected readonly transactionRepository: TransactionRepositoryInterface,
    protected readonly accountRepository: AccountRepositoryInterface,
  ) {}

  async execute(request: MessageBody): Promise<void> {
    try {
      const { messageId, transactionId, accauntId, amount } = request;
      this.loggerService.log(`Start process transaction transactionId:${transactionId}`);
      this.transactionFinded = await this.transactionRepository.findById(transactionId);
      if (!this.transactionFinded) {
        this.loggerService.error(`Transaction not found, messageId:${messageId} transactionId:${transactionId}`);
        return;
      }
      const accauntFinded = await this.accountRepository.findById(accauntId);
      if (!accauntFinded) {
        this.loggerService.error(`Accaunt not found, messageId:${messageId} accauntId:${accauntId}`);
        return;
      }
      if (this.transactionFinded.status !== TransactionStatus.PROCESSING) {
        this.loggerService.error(
          `transaction already processed, messageId:${messageId} transactionId:${transactionId}`,
        );
        return;
      }
      await this.processTransaction(accauntFinded, amount);
      await this.accountRepository.update(accauntFinded);
      this.transactionFinded.updateStatusProcessed();
      await this.transactionRepository.update(this.transactionFinded);
      this.loggerService.log(`Start process sucessfuly transactionId:${transactionId}`);
    } catch (error) {
      this.loggerService.error(`An error has occurred while process transaction error:${error.message}`);
      this.transactionFinded.updateStatusError();
      await this.transactionRepository.update(this.transactionFinded);
    }
  }

  protected abstract processTransaction(account: AccountEntityDomain, amount: number): Promise<void>;
}
