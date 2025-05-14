import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class SearchPostDTO {
  @ApiPropertyOptional({
    description: 'Search string for post title or content',
    example: 'first',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description:
      'List of tags separated by commas. Use raw names instead of IDs in this field.',

    example: 'tag,othertag',
  })
  @Transform((params) => params.value.split(','))
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string;

  @ApiPropertyOptional({
    description: 'Author ID (UUID) of the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
