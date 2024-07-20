import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SqsService } from '@ssut/nestjs-sqs';
import { SqsProducerService } from './sqs-producer.service';

describe('SqsProducerService', () => {
  let service: SqsProducerService;
  let sqsService: SqsService;
  let loggerMock;

  const mockMessage = { key: 'value' };

  beforeEach(async () => {
    const sqsServiceMock = {
      send: jest.fn().mockResolvedValue([]),
    };

    const configServiceMock = {
      get: jest.fn().mockReturnValue('my-queue'),
    };

    loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      setLogPrefix: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqsProducerService,
        {
          provide: SqsService,
          useValue: sqsServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: 'LoggerServiceInterface',
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<SqsProducerService>(SqsProducerService);
    sqsService = module.get<SqsService>(SqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(sqsService).toBeDefined();
    expect(service['sqsService']).toBe(sqsService);
  });
  it('should create SqsProducerService with dependencies', () => {
    const configService = new ConfigService();

    const service = new SqsProducerService(loggerMock, sqsService, configService);

    expect(service).toBeDefined();
    expect(service instanceof SqsProducerService).toBeTruthy();
    expect(service['sqsService']).toBe(sqsService);
    expect(service['configService']).toBe(configService);
  });
  it('should send a message to the SQS queue', async () => {
    await service.sendMessage(mockMessage);

    expect(sqsService.send).toHaveBeenCalledWith('my-queue', {
      id: 'id',
      body: { messageBody: mockMessage },
      messageAttributes: {},
      delaySeconds: 0,
    });
    expect(loggerMock.log).toHaveBeenCalledWith(expect.stringContaining('Message sent successfully'));
  });

  it('should handle errors when sending a message', async () => {
    const errorMessage = 'Failed to send SQS Message';
    const error = new Error('Send error');

    jest.spyOn(sqsService, 'send').mockRejectedValue(error);

    await service.sendMessage(mockMessage);

    expect(loggerMock.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    expect(loggerMock.error).toHaveBeenCalledWith(JSON.stringify(error));
  });
});
