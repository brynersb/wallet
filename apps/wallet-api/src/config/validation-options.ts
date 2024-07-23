import { ValidationPipeOptions } from '@nestjs/common';

export const validationOptions = {
  skipNullProperties: false,
  skipUndefinedProperties: false,
  skipMissingProperties: false,
} as ValidationPipeOptions;
