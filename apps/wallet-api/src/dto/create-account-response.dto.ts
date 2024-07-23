import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountResponseDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'João',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'joao@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'account id',
    example: '16153f35-5b0a-4eb6-a4b4-c1ea55816bdc',
  })
  @IsNotEmpty()
  @IsString()
  accountId: string;
}
