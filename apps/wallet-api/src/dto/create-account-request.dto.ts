import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountRequestDto {
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
}
