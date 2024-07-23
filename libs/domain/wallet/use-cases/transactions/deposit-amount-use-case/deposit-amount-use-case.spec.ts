import { DepositAmountUseCase } from './deposit-amount-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { AccountRepositoryInterface } from '../../../repositories/account.repository.interface';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { TransactionStatus, TransactionType } from '../../../enums/transaction-type.enum';
import { MessageBody } from '../../../../common/types/messae-body.type';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';

describe('DepositAmountUseCase', () => {
  let depositAmountUseCase: DepositAmountUseCase;
  let loggerService: LoggerServiceInterface;
  let transactionRepository: TransactionRepositoryInterface;
  let accountRepository: AccountRepositoryInterface;

  beforeEach(() => {
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    transactionRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };

    accountRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    depositAmountUseCase = new DepositAmountUseCase(loggerService, transactionRepository, accountRepository);
  });

  it('should add amount to account and update transaction status', async () => {
    const request: MessageBody = {
      messageId: 'msg1',
      transactionId: 'txn1',
      accauntId: 'acc1',
      amount: 100,
      transactionType: TransactionType.DEPOSIT,
    };

    const transaction = new TransactionEntityDomain({
      account: {} as AccountEntityDomain,
      status: TransactionStatus.PROCESSING,
      type: request.transactionType,
      amount: request.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const account = { id: 'acc1', addAmount: jest.fn(), subtractAmount: jest.fn() };

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(account);
    (transactionRepository.update as jest.Mock).mockResolvedValue(undefined);
    (accountRepository.update as jest.Mock).mockResolvedValue(undefined);

    await depositAmountUseCase.execute(request);

    expect(loggerService.log).toHaveBeenCalledWith(`Start process transaction transactionId:txn1`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(request.transactionId);
    expect(accountRepository.findById).toHaveBeenCalledWith(request.accauntId);
    expect(transactionRepository.update).toHaveBeenCalledWith(transaction);
    expect(loggerService.log).toHaveBeenCalledWith(`Start process sucessfuly transactionId:txn1`);
  });

  it('should handle transaction not found', async () => {
    const request: MessageBody = {
      messageId: 'msg1',
      transactionId: 'txn1',
      accauntId: 'acc1',
      amount: 100,
      transactionType: TransactionType.DEPOSIT,
    };

    (transactionRepository.findById as jest.Mock).mockResolvedValue(null);

    await depositAmountUseCase.execute(request);

    expect(loggerService.error).toHaveBeenCalledWith(`Transaction not found, messageId:msg1 transactionId:txn1`);
  });

  it('should handle account not found', async () => {
    const request: MessageBody = {
      messageId: 'msg1',
      transactionId: 'txn1',
      accauntId: 'acc1',
      amount: 100,
      transactionType: TransactionType.DEPOSIT,
    };

    const transaction = new TransactionEntityDomain({
      account: {} as AccountEntityDomain,
      status: TransactionStatus.PROCESSING,
      type: request.transactionType,
      amount: request.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(null);

    await depositAmountUseCase.execute(request);

    expect(loggerService.error).toHaveBeenCalledWith(`Accaunt not found, messageId:msg1 accauntId:acc1`);
  });

  it('should handle already processed transaction', async () => {
    const request: MessageBody = {
      messageId: 'messageId',
      transactionId: 'transactionId',
      accauntId: 'accauntId',
      amount: 100,
      transactionType: TransactionType.DEPOSIT,
    };

    const transaction = {
      account: {} as AccountEntityDomain,
      status: TransactionStatus.PROCESSED,
      type: request.transactionType,
      amount: request.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
      updateStatusProcessed: jest.fn(),
      updateStatusError: jest.fn(),
    } as unknown as TransactionEntityDomain;
    const account = { id: 'accauntId', addAmount: jest.fn(), subtractAmount: jest.fn() };

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(account);

    await depositAmountUseCase.execute(request);

    expect(loggerService.error).toHaveBeenCalledWith(
      `transaction already processed, messageId:messageId transactionId:transactionId`,
    );
    expect(account.addAmount).not.toHaveBeenCalled();
    expect(transaction.updateStatusProcessed).not.toHaveBeenCalled();
    expect(transactionRepository.update).not.toHaveBeenCalled();
  });

  it('should handle errors during execution', async () => {
    const request: MessageBody = {
      messageId: 'messageId',
      transactionId: 'transactionId',
      accauntId: 'accauntId',
      amount: 100,
      transactionType: TransactionType.DEPOSIT,
    };

    const transaction = {
      account: {} as AccountEntityDomain,
      status: TransactionStatus.PROCESSING,
      type: request.transactionType,
      amount: request.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
      updateStatusProcessed: jest.fn(),
      updateStatusError: jest.fn(),
    } as unknown as TransactionEntityDomain;

    const account = { id: 'accauntId', addAmount: jest.fn(), subtractAmount: jest.fn() };

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transaction);
    (accountRepository.findById as jest.Mock).mockResolvedValue(account);
    jest.spyOn(accountRepository, 'update').mockRejectedValue(new Error('Update failed'));

    await depositAmountUseCase.execute(request);

    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while process transaction error:Update failed`,
    );
    expect(transaction.updateStatusError).toHaveBeenCalled();
    expect(transactionRepository.update).toHaveBeenCalledWith(transaction);
  });
});
