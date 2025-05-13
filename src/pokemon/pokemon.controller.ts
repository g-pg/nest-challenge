import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { SearchPokemonDTO } from './dto/search-pokemon.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PokemonReference } from './types/poke-api.types';

@Controller('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @ApiOperation({ summary: 'Get pokemon by id or name' })
  @Get('/:idOrName')
  async getPokemonById(@Param('idOrName') idOrName: string) {
    const pokemon = await this.pokemonService.getPokemonByIdOrName(idOrName);
    return pokemon;
  }

  @ApiOperation({
    summary: 'Get pokemon list',
  })
  @ApiResponse({
    description:
      'Returns a list of pokemon based on query parameters. The search query param will match only the pokemon\'s name. A search for "mew" will return the resources for "mew", "mewtwo" etc.',
    example: [
      {
        name: 'mew',
        url: 'https://pokeapi.co/api/v2/pokemon/151/',
      },
    ],
  })
  @Get()
  async getAllPokemon(
    @Query() dto: SearchPokemonDTO,
  ): Promise<PokemonReference[]> {
    const pokemon = await this.pokemonService.getPokemonList(dto);
    return pokemon;
  }
}
