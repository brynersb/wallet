import { ApiProperty } from '@nestjs/swagger';

export class BusinessErrorResponseDto {
  @ApiProperty({
    description: 'Error Key',
    example: 'Error Key',
  })
  errorKey: string;

  @ApiProperty({
    description: 'Error Message',
    example: 'Error Message',
  })
  errorMessage: string;
}
