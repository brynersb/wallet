import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { TransactionRequestDto } from '../../dto/transaction-request.dto';
import { TransactionsResponseDto } from '../../dto/transaction-response.dto';
import { BusinessError } from '../../../../../libs/domain/common/types/business-error';
import TransactionErrorKey from '../../../../../libs/domain/wallet/utils/transaction-error-key';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TransactionsApiController } from './transactions.controller';
import { TransactionType } from '../../../../../libs/domain/wallet/enums/transaction-type.enum';

describe('TransactionsApiController', () => {
  let app: INestApplication;
  let transactionsApiService: TransactionsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsApiController],
      providers: [
        {
          provide: TransactionsApiService,
          useValue: {
            createTransaction: jest.fn(),
            getTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    transactionsApiService = module.get<TransactionsApiService>(TransactionsApiService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST transactions', () => {
    it('should return a transaction and status CREATED if transaction is successful', async () => {
      const transactionRequestDto: TransactionRequestDto = {
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        customerId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        amount: 10.5,
      };

      const transactionResponseDto: TransactionsResponseDto = {
        id: 'transaction-id',
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        amount: 10.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (transactionsApiService.createTransaction as jest.Mock).mockResolvedValue(transactionResponseDto);

      return request(app.getHttpServer()).post('/transactions').send(transactionRequestDto).expect(HttpStatus.CREATED);
    });

    it('should return a BusinessError with status NOT_FOUND if account is not found', async () => {
      const transactionRequestDto: TransactionRequestDto = {
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        customerId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        amount: 10.5,
      };

      const businessError: BusinessError = {
        errorKey: TransactionErrorKey.accountNotFound,
        errorMessage: 'Account not found',
      };

      (transactionsApiService.createTransaction as jest.Mock).mockResolvedValue(businessError);

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transactionRequestDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect(businessError);
    });

    it('should return a BusinessError with status INTERNAL_SERVER_ERROR for other errors', async () => {
      const transactionRequestDto: TransactionRequestDto = {
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        customerId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        amount: 10.5,
      };

      const businessError: BusinessError = {
        errorKey: TransactionErrorKey.requestTrasactionGeneralError,
        errorMessage: 'Internal server error',
      };

      (transactionsApiService.createTransaction as jest.Mock).mockResolvedValue(businessError);

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transactionRequestDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect(businessError);
    });
  });

  describe('GET transactions', () => {
    it('should return a transaction and status OK if transaction is found', async () => {
      const transactionId = 'transaction-id';

      const transactionResponseDto: TransactionsResponseDto = {
        id: transactionId,
        accountId: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
        type: TransactionType.ADDITION,
        amount: 10.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (transactionsApiService.getTransaction as jest.Mock).mockResolvedValue(transactionResponseDto);

      return request(app.getHttpServer()).get(`/transactions/${transactionId}`).expect(HttpStatus.OK);
    });

    it('should return a BusinessError with status NOT_FOUND if transaction is not found', async () => {
      const transactionId = 'transaction-id';

      const businessError: BusinessError = {
        errorKey: TransactionErrorKey.trasactionNotFound,
        errorMessage: 'Transaction not found',
      };

      (transactionsApiService.getTransaction as jest.Mock).mockResolvedValue(businessError);

      return request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(businessError);
    });

    it('should return a BusinessError with status INTERNAL_SERVER_ERROR for other errors', async () => {
      const transactionId = 'transaction-id';

      const businessError: BusinessError = {
        errorKey: TransactionErrorKey.requestTrasactionGeneralError,
        errorMessage: 'Internal server error',
      };

      (transactionsApiService.getTransaction as jest.Mock).mockResolvedValue(businessError);

      return request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect(businessError);
    });
  });
});
