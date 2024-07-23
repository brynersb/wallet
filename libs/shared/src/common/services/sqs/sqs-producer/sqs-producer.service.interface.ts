import { SendMessageResult } from '../../../types/send-message-sqs';
export interface SQSProducerServiceInterface {
  sendMessage<T>(messageBody: T): Promise<SendMessageResult[] | undefined>;
}
