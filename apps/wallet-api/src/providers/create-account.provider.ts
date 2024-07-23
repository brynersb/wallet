import { Provider } from '@nestjs/common';
import { LoggerServiceInterface } from '../../../../libs/domain/common/services/logger/logger.service.interface';
import { AccountRepositoryInterface } from '../../../../libs/domain/wallet/repositories/account.repository.interface';
import { CustomerRepositoryInterface } from '../../../../libs/domain/wallet/repositories/customer.repository.interface';
import { CreateAccountUseCase } from '../../../../libs/domain/wallet/use-cases/account/create-account-use-case/create-account-use-case';

export const CreateAccountProvider = {
  provide: 'CreateAccountUseCaseInterface',
  useFactory: (
    loggerService: LoggerServiceInterface,
    accountRepository: AccountRepositoryInterface,
    customerRepository: CustomerRepositoryInterface,
  ) => {
    return new CreateAccountUseCase(loggerService, accountRepository, customerRepository);
  },
  inject: ['LoggerServiceInterface', 'AccountRepositoryInterface', 'CustomerRepositoryInterface'],
} as Provider;
