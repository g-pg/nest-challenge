import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreatePostDTO {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsString()
  @Length(1, 50)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is my first post.',
  })
  @IsString()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'An array of tag IDs.',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  tagIds: string[];
}
