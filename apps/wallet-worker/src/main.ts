import { NestFactory } from '@nestjs/core';
import { WalletWorkerModule } from './wallet-worker.module';

const CONTAINER_PORT = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create(WalletWorkerModule);
  await app.listen(CONTAINER_PORT);
}
bootstrap();
