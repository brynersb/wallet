import { Inject, Injectable, Type } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { ModuleRef } from '@nestjs/core';
import { LoggerServiceInterface } from '../../../../../../domain/common/services/logger/logger.service.interface';
import { MessageProcessorInterface } from '../../../../../../domain/common/services/message-processor/message-processor.interface';
import { SQSMessage } from '../../../types/sqs-message';

@Injectable()
export class SqsConsumerService {
  constructor(
    @Inject('LoggerServiceInterface')
    private readonly loggerService: LoggerServiceInterface,
    @Inject('ProcessorMapping')
    private readonly processorMapping: { [key: string]: Type<MessageProcessorInterface> },
    private readonly moduleRef: ModuleRef,
  ) {}

  @SqsConsumerEventHandler(process.env.AWS_QUEUE_NAME ?? 'wallet-transaction-queue', 'processing_error')
  public onProcessingError(error: Error, message: SQSMessage) {
    this.loggerService.error(`Error ${JSON.stringify(error)}`);
    this.loggerService.error(`Message ${JSON.stringify(message)}`);
  }

  @SqsMessageHandler(process.env.AWS_QUEUE_NAME ?? 'wallet-transaction-queue', false)
  public async handleMessage(message: SQSMessage) {
    try {
      this.loggerService.log(`Receiving message from queue: ${JSON.stringify(message)}`);
      if (!message.Body) {
        throw new Error('No Body received in message');
      }

      const parsedBody = JSON.parse(message.Body);
      const { messageBody } = parsedBody;
      const processorType = this.processorMapping[messageBody.transactionType];

      if (processorType) {
        const processorInstance = this.moduleRef.get(processorType, { strict: false });
        await processorInstance.processMessage(messageBody);
      } else {
        this.loggerService.error(
          `[SqsConsumerService.handleMessage()] Invalid params received, transaction Type: ${JSON.stringify(
            messageBody.transactionType,
          )}`,
        );
      }
    } catch (error) {
      this.loggerService.error(
        `[SqsConsumerService.handleMessage()] an error occurred during processing ${error.message}`,
      );
    }
  }
}
