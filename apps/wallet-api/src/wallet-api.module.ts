import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../../libs/shared/src/shared.module';
import { TransactionsApiController } from './controllers/transactions/transactions.controller';
import { TransactionsApiService } from './services/transactions-api.service';
import { TransactionRequestProvider } from './providers/transaction-request.provider';
import { GetTransactionStatusProvider } from './providers/get-transaction-status.provider';
import { GetAccountBalanceProvider } from './providers/get-account-balance.provider';
import { AccountController } from './controllers/account/account.controller';
import { AccountService } from './services/account-api.service';
import { GetAccountSummaryProvider } from './providers/get-account-summary.provider';
import { CreateAccountProvider } from './providers/create-account.provider';

const rootDir = 'apps/wallet-api';
const envProperties = `${rootDir}/.env`;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [envProperties],
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [TransactionsApiController, AccountController],
  providers: [
    TransactionsApiService,
    AccountService,
    TransactionRequestProvider,
    GetTransactionStatusProvider,
    GetAccountBalanceProvider,
    GetAccountSummaryProvider,
    CreateAccountProvider,
  ],
})
export class WalletApiModule {}
