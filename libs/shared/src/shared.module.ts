import { Module, Provider } from '@nestjs/common';
import { ProducerConfig } from './common/services/sqs/config/sqs.config';
import { DatabaseModule } from '../db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SqsProducerService } from './common/services/sqs/sqs-producer/sqs-producer.service';
import { LoggerService } from './common/services/logger/logger.service';
import { TransactionRepository } from './common/repositories/transaction.repository';
import { AccountRepository } from './common/repositories/account.repository,';

const services: Provider[] = [
  ConfigService,
  { provide: 'LoggerServiceInterface', useClass: LoggerService },
  { provide: 'SQSProducerServiceInterface', useClass: SqsProducerService },
  { provide: 'TransactionRepositoryInterface', useClass: TransactionRepository },
  { provide: 'AccountRepositoryInterface', useClass: AccountRepository },
];
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ProducerConfig,
    DatabaseModule,
  ],
  exports: [...services, DatabaseModule],
  providers: [...services, DatabaseModule],
})
export class SharedModule {}
