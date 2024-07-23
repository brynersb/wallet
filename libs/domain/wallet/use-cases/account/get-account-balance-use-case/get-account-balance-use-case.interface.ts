import { BusinessError } from '../../../../common/types/business-error';
import { AccountBalnce } from '../../../types/account.type';

export interface GetAccountBalancedUseCaseInterface {
  execute(accountId: string): Promise<AccountBalnce | BusinessError>;
}
