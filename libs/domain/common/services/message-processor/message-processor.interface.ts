import { MessageBody } from '../../types/messae-body.type';

export interface MessageProcessorInterface {
  processMessage(messageBody: MessageBody): Promise<void>;
}
