import { ApiProperty } from '@nestjs/swagger';

export class AccountBalnceResponseDto {
  @ApiProperty({
    description: 'balance',
    example: 10.51,
  })
  balance: number;
}
