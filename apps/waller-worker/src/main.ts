import { NestFactory } from '@nestjs/core';
import { WallerWorkerModule } from './waller-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(WallerWorkerModule);
  await app.listen(3000);
}
bootstrap();
