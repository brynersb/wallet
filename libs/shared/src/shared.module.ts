import { Module } from '@nestjs/common';
import { ProducerConfig } from './common/services/sqs/config/sqs.config';
import { DatabaseModule } from '../db/db.module';

@Module({
  providers: [],
  imports: [ProducerConfig, DatabaseModule],
  exports: [DatabaseModule],
})
export class SharedModule {}
