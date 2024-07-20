import { Injectable } from '@nestjs/common';

@Injectable()
export class WallerWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
