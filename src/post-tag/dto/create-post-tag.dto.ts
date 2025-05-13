import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsString, Length, Matches } from 'class-validator';

export class CreatePostTagDTO {
  @ApiProperty({
    description: 'The name of the post tag',
    example: 'tag',
  })
  //validate with regex
  @IsString()
  @Matches(/^[a-z]{1,20}$/, {
    message:
      'Tag name must be lowercase and contain only letters, max 20 characters',
  })
  name: string;
}
