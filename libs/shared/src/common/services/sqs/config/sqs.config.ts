import { SQSClient } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SqsConsumerOptions, SqsProducerOptions } from '@ssut/nestjs-sqs/dist/sqs.types';

export const ConsumerConfig = SqsModule.registerAsync({
  useFactory: (configService: ConfigService) => {
    const config = createSqsConfig(configService);
    return { consumers: [config as SqsConsumerOptions] };
  },
  inject: [ConfigService],
});

export const ProducerConfig = SqsModule.registerAsync({
  useFactory: (configService: ConfigService) => {
    const config = createSqsConfig(configService);
    return { producers: [config as SqsProducerOptions] };
  },
  inject: [ConfigService],
});

function createSqsConfig(configService: ConfigService): SqsConsumerOptions | SqsProducerOptions {
  const name = configService.get('AWS_QUEUE_NAME');
  const queueUrl = configService.get('AWS_QUEUE_URL');
  if (!name) {
    throw new Error('AWS_QUEUE_NAME configuration value not found');
  }
  if (!queueUrl) {
    throw new Error('AWS_QUEUE_URL configuration value not found');
  }

  return {
    name,
    queueUrl,
    region: configService.get('AWS_REGION'),
    sqs: new SQSClient({
      endpoint: 'http://0.0.0.0:4566',
    }),
  };
}
