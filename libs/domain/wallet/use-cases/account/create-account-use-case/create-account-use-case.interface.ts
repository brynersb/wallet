import { BusinessError } from '../../../../common/types/business-error';
import { AccountCreatedResponse } from '../../../types/account.type';

export interface CreateAccountUseCaseInterface {
  execute(name: string, email: string): Promise<AccountCreatedResponse | BusinessError>;
}
