import { CancellationOrRefundUseCase } from './cancellation-or-refund-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { MessageBody } from '../../../../common/types/messae-body.type';
import { TransactionStatus, TransactionType } from '../../../enums/transaction-type.enum';

describe('CancellationOrRefundUseCase', () => {
  let cancellationOrRefundUseCase: CancellationOrRefundUseCase;
  let loggerService: LoggerServiceInterface;
  let transactionRepository: TransactionRepositoryInterface;
  let accountRepository: AccountRepositoryInterface;

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    transactionRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    accountRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    cancellationOrRefundUseCase = new CancellationOrRefundUseCase(
      loggerService,
      transactionRepository,
      accountRepository,
    );
  });

  it('should successfully process a cancellation or refund', async () => {
    const transactionId = 'transaction-id-123';
    const accountId = 'account-id-123';
    const amount = 100;
    const messageBody: MessageBody = {
      transactionId,
      accauntId: accountId,
      transactionType: TransactionType.REFUND,
      amount,
    };
    const account = new AccountEntityDomain({
      customer: null,
      balance: 0,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const transactionProps = {
      account: account,
      type: TransactionType.CANCELLATION,
      amount: 50,
      status: TransactionStatus.PROCESSING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const transaction = new TransactionEntityDomain(transactionProps);

    (transactionRepository.findById as jest.Mock).mockResolvedValueOnce(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValueOnce(account);
    (accountRepository.update as jest.Mock).mockResolvedValueOnce(undefined);
    (transactionRepository.update as jest.Mock).mockResolvedValueOnce(undefined);

    await cancellationOrRefundUseCase.execute(messageBody);

    expect(loggerService.log).toHaveBeenCalledWith(`Start get transaction:${transactionId}`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(accountRepository.update).toHaveBeenCalledWith(account);
    expect(transactionRepository.update).toHaveBeenCalledWith(transaction);
    expect(loggerService.log).toHaveBeenCalledWith(`Succesfully get transaction status:${JSON.stringify(transaction)}`);
  });

  it('should handle the case where the transaction is not found', async () => {
    const transactionId = 'transaction-id-123';
    const messageBody: MessageBody = {
      transactionId,
      accauntId: 'account-id-123',
      transactionType: TransactionType.REFUND,
      amount: 100,
    };

    (transactionRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    await cancellationOrRefundUseCase.execute(messageBody);

    expect(loggerService.log).toHaveBeenCalledWith(`Start get transaction:${transactionId}`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(loggerService.error).toHaveBeenCalledWith(`Transaction not found: transactionId:${transactionId}`);
  });

  it('should handle errors during the process', async () => {
    const transactionId = 'transaction-id-123';
    const accountId = 'account-id-123';
    const messageBody: MessageBody = {
      transactionId,
      accauntId: accountId,
      transactionType: TransactionType.REFUND,
      amount: 100,
    };
    const errorMessage = 'Test error';

    (transactionRepository.findById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await cancellationOrRefundUseCase.execute(messageBody);

    expect(loggerService.log).toHaveBeenCalledWith(`Start get transaction:${transactionId}`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while get transaction by id, error:${errorMessage}`,
    );
  });
});
