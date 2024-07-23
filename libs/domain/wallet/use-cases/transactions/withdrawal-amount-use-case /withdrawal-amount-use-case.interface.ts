import { MessageBody } from '../../../../common/types/messae-body.type';

export interface WithdrawalAmountUseCaseInterface {
  execute(request: MessageBody): Promise<void>;
}
