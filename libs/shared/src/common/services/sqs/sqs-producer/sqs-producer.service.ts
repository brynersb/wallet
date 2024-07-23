import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SqsService } from '@ssut/nestjs-sqs';
import { SQSProducerServiceInterface } from './sqs-producer.service.interface';
import { LoggerServiceInterface } from '../../../../../../domain/common/services/logger/logger.service.interface';
import { SendMessageResult } from '../../../types/send-message-sqs';

@Injectable()
export class SqsProducerService implements SQSProducerServiceInterface {
  private readonly sqsName: string | undefined;

  constructor(
    @Inject('LoggerServiceInterface')
    private logger: LoggerServiceInterface,
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
  ) {
    this.sqsName = this.configService.get<string>('AWS_QUEUE_NAME');
  }

  async sendMessage<T>(messageBody: T): Promise<SendMessageResult[] | undefined> {
    try {
      const sqsMessage: SendMessageResult[] = (await this.sqsService.send(this.sqsName, {
        id: 'id',
        body: {
          messageBody: messageBody,
        },
        messageAttributes: {},
        delaySeconds: 0,
      })) as SendMessageResult[];
      this.logger.log(`Message sent successfully. message: ${JSON.stringify(sqsMessage)}`);
      return sqsMessage;
    } catch (error) {
      this.logger.error(`Failed to send SQS Message. messageBody: ${JSON.stringify(messageBody)}`);
      this.logger.error(JSON.stringify(error));
    }
  }
}
