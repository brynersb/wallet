import { GetTransactionStatusUseCase } from './get-transaction-status-use-case';
import { LoggerServiceInterface } from '../../../../common/services/logger/logger.service.interface';
import { TransactionRepositoryInterface } from '../../../repositories/transaction.repository.interface';
import { TransactionEntityDomain } from '../../../entities/transaction-entity-domain';
import { BusinessError } from '../../../../common/types/business-error';
import TransactionErrorKey from '../../../utils/transaction-error-key';
import { TransactionStatus, TransactionType } from '../../../enums/transaction-type.enum';
import { AccountEntityDomain } from '../../../entities/account-entity-domain';

describe('GetTransactionStatusUseCase', () => {
  let getTransactionStatusUseCase: GetTransactionStatusUseCase;
  let loggerService: LoggerServiceInterface;
  let transactionRepository: TransactionRepositoryInterface;

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
    };

    getTransactionStatusUseCase = new GetTransactionStatusUseCase(loggerService, transactionRepository);
  });

  it('should return a TransactionEntityDomain if transaction is found', async () => {
    const transactionId = '1';
    const transactionEntity = new TransactionEntityDomain({
      account: {} as AccountEntityDomain,
      type: TransactionType.DEPOSIT,
      amount: 100,
      status: TransactionStatus.PROCESSING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (transactionRepository.findById as jest.Mock).mockResolvedValue(transactionEntity);

    const result = await getTransactionStatusUseCase.execute(transactionId);

    expect(loggerService.log).toHaveBeenCalledWith(`Start get transaction status:${transactionId}`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(loggerService.log).toHaveBeenCalledWith(`Succesfully get transaction status:${transactionEntity}`);
    expect(result).toBe(transactionEntity);
  });

  it('should return a BusinessError if transaction is not found', async () => {
    const transactionId = '1';

    (transactionRepository.findById as jest.Mock).mockResolvedValue(null);

    const result = await getTransactionStatusUseCase.execute(transactionId);

    expect(loggerService.log).toHaveBeenCalledWith(`Start get transaction status:${transactionId}`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(loggerService.error).toHaveBeenCalledWith(`Transaction not found: transactionId:${transactionId}`);
    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.trasactionNotFound,
        `Transaction not found: transactionId:${transactionId}`,
      ),
    );
  });

  it('should return a BusinessError if an exception is thrown', async () => {
    const transactionId = '1';
    const errorMessage = 'errorMessage';

    (transactionRepository.findById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const result = await getTransactionStatusUseCase.execute(transactionId);

    expect(loggerService.log).toHaveBeenCalledWith(`Start get transaction status:${transactionId}`);
    expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
    expect(loggerService.error).toHaveBeenCalledWith(
      `An error has occurred while get transaction by id, error:${errorMessage}`,
    );
    expect(result).toEqual(
      new BusinessError(
        TransactionErrorKey.findTrasactionByIdGeneralError,
        `An error has occurred while get transaction by id, error:${errorMessage}`,
      ),
    );
  });
});
