import { MessageBody } from '../../../../common/types/messae-body.type';

export interface CancellationOrRefundUseCaseInterface {
  execute(messae: MessageBody): Promise<void>;
}
