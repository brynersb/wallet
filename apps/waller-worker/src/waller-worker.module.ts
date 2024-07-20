import { Module } from '@nestjs/common';
import { WallerWorkerController } from './waller-worker.controller';
import { WallerWorkerService } from './waller-worker.service';

@Module({
  imports: [],
  controllers: [WallerWorkerController],
  providers: [WallerWorkerService],
})
export class WallerWorkerModule {}
