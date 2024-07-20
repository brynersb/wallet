import { Test } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    loggerService = await moduleRef.resolve<LoggerService>(LoggerService);
  });

  it('should log a message', () => {
    const logSpy = jest.spyOn(loggerService['logger'], 'log');
    const message = 'Test log message';

    loggerService.log(message);

    expect(logSpy).toHaveBeenCalledWith(message);
  });

  it('should warn a message', () => {
    const warnSpy = jest.spyOn(loggerService['logger'], 'warn');
    const message = 'Test warn message';

    loggerService.warn(message);

    expect(warnSpy).toHaveBeenCalledWith(message);
  });

  it('should error a message', () => {
    const errorSpy = jest.spyOn(loggerService['logger'], 'error');
    const message = 'Test error message';

    loggerService.error(message);

    expect(errorSpy).toHaveBeenCalledWith(message);
  });
});
