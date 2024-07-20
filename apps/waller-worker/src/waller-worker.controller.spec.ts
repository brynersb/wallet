import { Test, TestingModule } from '@nestjs/testing';
import { WallerWorkerController } from './waller-worker.controller';
import { WallerWorkerService } from './waller-worker.service';

describe('WallerWorkerController', () => {
  let wallerWorkerController: WallerWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WallerWorkerController],
      providers: [WallerWorkerService],
    }).compile();

    wallerWorkerController = app.get<WallerWorkerController>(WallerWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(wallerWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
