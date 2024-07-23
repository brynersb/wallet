import { Inject, Injectable } from '@nestjs/common';
import { BusinessError } from '../../../../libs/domain/common/types/business-error';
import { GetAccountBalancedUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/account/get-account-balance-use-case/get-account-balance-use-case.interface';
import { AccountBalnceResponseDto } from '../dto/account-balance-response.dto';
import { GetAccountSummaryUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/account/get-account-summary-use-case/get-account-summary-use-case.interface';
import { CreateAccountUseCaseInterface } from '../../../../libs/domain/wallet/use-cases/account/create-account-use-case/create-account-use-case.interface';
import { AccountCreatedResponse } from '../../../../libs/domain/wallet/types/account.type';

@Injectable()
export class AccountService {
  constructor(
    @Inject('GetAccountBalancedUseCaseInterface')
    private readonly getAccountBalance: GetAccountBalancedUseCaseInterface,
    @Inject('GetAccountSummaryUseCaseInterface')
    private readonly getAccountSummaryUseCase: GetAccountSummaryUseCaseInterface,
    @Inject('CreateAccountUseCaseInterface')
    private readonly createAccountUseCase: CreateAccountUseCaseInterface,
  ) {}

  async getBalance(accountId: string): Promise<AccountBalnceResponseDto | BusinessError> {
    return await this.getAccountBalance.execute(accountId);
  }
  async getSummary(
    accountId: string,
    startDate: string,
    endDate: string,
  ): Promise<AccountBalnceResponseDto | BusinessError> {
    return await this.getAccountSummaryUseCase.execute(accountId, startDate, endDate);
  }

  async createAccount(name: string, email: string): Promise<AccountCreatedResponse | BusinessError> {
    return await this.createAccountUseCase.execute(name, email);
  }
}
