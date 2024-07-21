import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../../libs/shared/src';
import { SqsConsumerService } from '../../../libs/shared/src/common/services/sqs/sqs-consumer/sqs-consumer.service';
import { ConsumerConfig } from '../../../libs/shared/src/common/services/sqs/config/sqs.config';
import { WalletProcessorService } from './services/wallet-processor.service';
import { DepositAmountProvider } from './providers/deposit-amount.provider';
import { WithdrawalAmountProvider } from './providers/withdrawal-amount.provider';

const rootDir = 'apps/wallet-worker';
const envProperties = `${rootDir}/.env`;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [envProperties],
      isGlobal: true,
    }),
    SharedModule,
    ConsumerConfig,
  ],
  controllers: [],
  providers: [
    {
      provide: 'ProcessorMapping',
      useValue: {
        DEPOSIT: WalletProcessorService,
        WITHDRAWAL: WalletProcessorService,
        BUY: WalletProcessorService,
      },
    },
    SqsConsumerService,
    WalletProcessorService,
    DepositAmountProvider,
    WithdrawalAmountProvider,
  ],
})
export class WalletWorkerModule {}
