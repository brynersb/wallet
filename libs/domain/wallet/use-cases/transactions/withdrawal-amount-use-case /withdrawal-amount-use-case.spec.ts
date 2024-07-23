import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { MessageBody } from '../../../../common/types/messae-body.type';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';
import { CustomerEntityDomain } from '../../../entities/customer-entity-domain';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { TransactionStatus, TransactionType } from '../../../enums/transaction-type.enum';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { WithdrawalAmountUseCase } from './withdrawal-amount-use-case';

describe('WithdrawalAmountUseCase', () => {
  let withdrawalAmountUseCase: WithdrawalAmountUseCase;
  let loggerService: LoggerServiceInterface;
  let transactionRepository: TransactionRepositoryInterface;
  let accountRepository: AccountRepositoryInterface;

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as LoggerServiceInterface;

    transactionRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as TransactionRepositoryInterface;

    accountRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as AccountRepositoryInterface;

    withdrawalAmountUseCase = new WithdrawalAmountUseCase(loggerService, transactionRepository, accountRepository);
  });

  it('should log and return if the transaction is not found', async () => {
    (transactionRepository.findById as jest.Mock).mockResolvedValue(null);

    const request: MessageBody = {
      messageId: '1',
      transactionId: '123',
      accauntId: '456',
      transactionType: TransactionType.WITHDRAWAL,
      amount: 100,
    };

    await withdrawalAmountUseCase.execute(request);

    expect(loggerService.error).toHaveBeenCalledWith('Transaction not found, messageId:1 transactionId:123');
    expect(transactionRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should log and return if the account is not found', async () => {
    const transaction = new TransactionEntityDomain({
      account: {} as AccountEntityDomain,
      amount: 100,
      status: TransactionStatus.PROCESSING,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: TransactionType.WITHDRAWAL,
    });

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(null);

    const request: MessageBody = {
      messageId: '1',
      transactionId: '123',
      accauntId: '456',
      transactionType: TransactionType.WITHDRAWAL,
      amount: 100,
    };

    await withdrawalAmountUseCase.execute(request);

    expect(loggerService.error).toHaveBeenCalledWith('Accaunt not found, messageId:1 accauntId:456');
    expect(accountRepository.findById).toHaveBeenCalledWith('456');
  });

  it('should log and return if the transaction is not in PROCESSING status', async () => {
    const transaction = new TransactionEntityDomain({
      account: {} as AccountEntityDomain,
      type: TransactionType.WITHDRAWAL,
      amount: 100,
      status: TransactionStatus.PROCESSED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);

    const request: MessageBody = {
      messageId: '1',
      transactionId: '123',
      accauntId: '456',
      transactionType: TransactionType.WITHDRAWAL,
      amount: 100,
    };

    await withdrawalAmountUseCase.execute(request);

    expect(transactionRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should process the transaction successfully', async () => {
    const account = new AccountEntityDomain({
      customer: {} as CustomerEntityDomain,
      balance: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const transaction = new TransactionEntityDomain({
      account,
      type: TransactionType.WITHDRAWAL,
      amount: 100,
      status: TransactionStatus.PROCESSING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(account);
    (accountRepository.update as jest.Mock).mockResolvedValue(undefined);
    (transactionRepository.update as jest.Mock).mockResolvedValue(undefined);

    const request: MessageBody = {
      messageId: '1',
      transactionId: '123',
      accauntId: '456',
      transactionType: TransactionType.WITHDRAWAL,
      amount: 100,
    };

    await withdrawalAmountUseCase.execute(request);

    expect(account.balance).toBe(100);
    expect(transaction.status).toBe(TransactionStatus.PROCESSED);
    expect(accountRepository.update).toHaveBeenCalledWith(account);
    expect(transactionRepository.update).toHaveBeenCalledWith(transaction);
    expect(loggerService.log).toHaveBeenCalledWith('Start process sucessfuly transactionId:123');
  });

  it('should handle errors and update the transaction status to ERROR', async () => {
    const account = new AccountEntityDomain({
      customer: {} as CustomerEntityDomain,
      balance: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const transaction = new TransactionEntityDomain({
      account,
      type: TransactionType.WITHDRAWAL,
      amount: 100,
      status: TransactionStatus.PROCESSING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(account);
    (accountRepository.update as jest.Mock).mockImplementation(() => {
      throw new Error('Some error');
    });

    const request: MessageBody = {
      messageId: '1',
      transactionId: '123',
      accauntId: '456',
      transactionType: TransactionType.WITHDRAWAL,
      amount: 100,
    };

    await withdrawalAmountUseCase.execute(request);

    expect(transaction.status).toBe(TransactionStatus.ERROR);
    expect(transactionRepository.update).toHaveBeenCalledWith(transaction);
    expect(loggerService.error).toHaveBeenCalledWith(
      'An error has occurred while process transaction error:Some error',
    );
  });
});
