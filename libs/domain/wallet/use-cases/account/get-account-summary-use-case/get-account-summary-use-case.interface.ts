import { BusinessError } from '../../../../common/types/business-error';
import { AccountSummary } from '../../../types/account.type';

export interface GetAccountSummaryUseCaseInterface {
  execute(accountId: string, startDate: string, endDate: string): Promise<AccountSummary | BusinessError>;
}
