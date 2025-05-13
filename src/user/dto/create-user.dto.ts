import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  @Length(4, 20)
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    maxLength: 40,
    minLength: 8,
    example: 'password123',
  })
  @IsString()
  @Length(8, 40)
  password: string;
}
