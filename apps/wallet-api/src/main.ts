import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationOptions } from './config/validation-options';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WalletApiModule } from './wallet-api.module';

const CONTAINER_PORT = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create(WalletApiModule);

  setUpValidation(app);
  swagger(app);

  await app.listen(CONTAINER_PORT);
}
function setUpValidation(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe(validationOptions));
}

function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('Wallet API')
    .setVersion('0.1')
    .addTag('Wallet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}
bootstrap();
