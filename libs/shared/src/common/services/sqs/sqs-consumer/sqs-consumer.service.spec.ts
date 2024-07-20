import { Test, TestingModule } from '@nestjs/testing';
import { ModuleRef } from '@nestjs/core';
import { SqsConsumerService } from './sqs-consumer.service';
import { MessageProcessorInterface } from '../../../../../../domain/common/services/message-processor/message-processor.interface';
import { LoggerServiceInterface } from '../../../../../../domain/common/services/logger/logger.service.interface';
import { SQSMessage } from '../../../types/sqs-message';

describe('SqsConsumerService', () => {
  let service: SqsConsumerService;
  let loggerService: LoggerServiceInterface;
  let moduleRef: ModuleRef;

  const loggerServiceMock: LoggerServiceInterface = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const messageProcessorMock: MessageProcessorInterface = {
    processMessage: jest.fn().mockResolvedValue(undefined),
  };

  const processorMappingMock = {
    typeA: jest.fn(() => messageProcessorMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqsConsumerService,
        {
          provide: 'LoggerServiceInterface',
          useValue: loggerServiceMock,
        },
        {
          provide: 'ProcessorMapping',
          useValue: processorMappingMock,
        },
        {
          provide: ModuleRef,
          useValue: {
            get: jest.fn().mockReturnValue(messageProcessorMock),
          },
        },
      ],
    }).compile();

    service = module.get<SqsConsumerService>(SqsConsumerService);
    loggerService = module.get<LoggerServiceInterface>('LoggerServiceInterface');
    moduleRef = module.get<ModuleRef>(ModuleRef);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onProcessingError', () => {
    it('should log the error and message', () => {
      const error = new Error('Test error');
      const message: SQSMessage = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        MD5OfBody: 'md5',
        Body: '{}',
      };

      service.onProcessingError(error, message);

      expect(loggerService.error).toHaveBeenCalledWith(`Error ${JSON.stringify(error)}`);
      expect(loggerService.error).toHaveBeenCalledWith(`Message ${JSON.stringify(message)}`);
    });
  });

  describe('handleMessage', () => {
    it('should log and process message correctly', async () => {
      const message: SQSMessage = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        MD5OfBody: 'md5',
        Body: JSON.stringify({
          messageBody: {
            transactionType: 'typeA',
            transactionId: 'TransactionId',
            accnountId: 'accnountId',
            amount: 10,
          },
        }),
      };

      await service.handleMessage(message);

      expect(loggerService.log).toHaveBeenCalledWith(`Receiving message from queue: ${JSON.stringify(message)}`);
      expect(moduleRef.get).toHaveBeenCalledWith(processorMappingMock['typeA'], { strict: false });
      expect(messageProcessorMock.processMessage).toHaveBeenCalledWith({
        transactionType: 'typeA',
        transactionId: 'TransactionId',
        accnountId: 'accnountId',
        amount: 10,
      });
    });

    it('should log error if message has no body', async () => {
      const message: SQSMessage = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        MD5OfBody: 'md5',
        Body: '',
      };

      await service.handleMessage(message);

      expect(loggerService.error).toHaveBeenCalledWith(
        `[SqsConsumerService.handleMessage()] an error occurred during processing No Body received in message`,
      );
    });

    it('should log error if processor type is not found', async () => {
      const message: SQSMessage = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        MD5OfBody: 'md5',
        Body: JSON.stringify({
          messageBody: {
            transactionType: 'unknownTransactionType',
            transactionId: 'TransactionId',
            accnountId: 'accnountId',
            amount: 10,
          },
        }),
      };

      await service.handleMessage(message);

      expect(loggerService.error).toHaveBeenCalledWith(
        `[SqsConsumerService.handleMessage()] Invalid params received, transaction Type: "unknownTransactionType"`,
      );
    });

    it('should log error if an exception occurs', async () => {
      const message: SQSMessage = {
        MessageId: '1',
        ReceiptHandle: 'handle',
        MD5OfBody: 'md5',
        Body: JSON.stringify({
          messageBody: {
            transactionType: 'transactionType',
            transactionId: 'TransactionId',
            accnountId: 'accnountId',
            amount: 10,
          },
        }),
      };

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Test exception');
      });

      await service.handleMessage(message);

      expect(loggerService.error).toHaveBeenCalledWith(
        `[SqsConsumerService.handleMessage()] Invalid params received, transaction Type: \"transactionType\"`,
      );
    });
  });
});
