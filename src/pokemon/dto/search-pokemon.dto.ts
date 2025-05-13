import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SearchPokemonDTO {
  @ApiPropertyOptional({
    description: 'Limit the number of results',
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset the results', example: 0 })
  @Type(() => Number)
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Search string for pokemon name',
    example: 'mew',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
