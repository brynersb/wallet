import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../../libs/shared/src/shared.module';
import { TransactionsApiController } from './controllers/transactions/transactions.controller';
import { TransactionsApiService } from './services/transactions-api.service';
import { TransactionRequestProvider } from './providers/transaction-request.provider';
import { GetTransactionStatusProvider } from './providers/get-transaction-status.provider';

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
  controllers: [TransactionsApiController],
  providers: [TransactionsApiService, TransactionRequestProvider, GetTransactionStatusProvider],
})
export class WalletApiModule {}
