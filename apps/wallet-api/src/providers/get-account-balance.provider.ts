import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { GetAccountBalancedUseCase } from '../../../../libs/domain/wallet/use-cases/account/get-account-balance-use-case/get-account-balance-use-case';

export const GetAccountBalanceProvider = {
  provide: 'GetAccountBalancedUseCaseInterface',
  useFactory: (loggerService: LoggerServiceInterface, accountRepository: AccountRepositoryInterface) => {
    return new GetAccountBalancedUseCase(loggerService, accountRepository);
  },
  inject: ['LoggerServiceInterface', 'AccountRepositoryInterface'],
} as Provider;
