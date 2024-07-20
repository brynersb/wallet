import { Controller, Get } from '@nestjs/common';
import { WallerWorkerService } from './waller-worker.service';

@Controller()
export class WallerWorkerController {
  constructor(private readonly wallerWorkerService: WallerWorkerService) {}

  @Get()
  getHello(): string {
    return this.wallerWorkerService.getHello();
  }
}
