import { MessageBody } from '../../../../common/types/messae-body.type';

export interface DepositAmounttUseCaseInterface {
  execute(request: MessageBody): Promise<void>;
}
