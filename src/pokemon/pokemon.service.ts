import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchPokemonDTO } from './dto/search-pokemon.dto';
import { PokemonCache } from './cache/pokemon-cache';
import {
  PokemonListAPIResponse,
  PokemonReference,
} from './types/poke-api.types';
import { POKE_DEFAULT_LIMIT } from './constants/pokemon.constants';

@Injectable()
export class PokemonService {
  private static DEFAULT_LIMIT = POKE_DEFAULT_LIMIT;
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private cache: PokemonCache) {}

  async onModuleInit() {
    this._initCache();
  }

  async getPokemonByIdOrName(idOrName: string) {
    const response = await fetch(`${this.baseUrl}/${idOrName}`);

    if (response.status === 404) {
      throw new NotFoundException(`Pokemon not found`);
    }

    if (!response.ok) {
      throw new Error(
        `Error fetching Pokemon with ID ${idOrName}: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async getPokemonList(dto: SearchPokemonDTO): Promise<PokemonReference[]> {
    if (this.cache.isExpired()) {
      this.cache.flushCache();
      await this._initCache();
    }

    let output: PokemonReference[] = this.cache.getReferenceCache();

    if (dto.search) {
      const search = dto.search.toLowerCase();
      output = output.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search),
      );
    }

    if (dto.limit || dto.offset) {
      const limit = dto.limit || PokemonService.DEFAULT_LIMIT;
      const offset = dto.offset || 0;
      output = output.slice(offset, offset + limit);
    }

    return output;
  }

  private async _getCompletePokemonList(): Promise<PokemonListAPIResponse> {
    // gets metadata about the pokemon list
    const initialQuery = await fetch(`${this.baseUrl}?limit=1`);

    if (!initialQuery.ok) {
      throw new Error(`Error gathering Pokemon data`);
    }

    const data = await initialQuery.json();

    // gets complete pokemon list
    const allPokemonQuery = await fetch(
      `${this.baseUrl}?limit=${data.count}&offset=0`,
    );

    if (!allPokemonQuery.ok) {
      throw new Error(`Error gathering Pokemon data`);
    }

    return await allPokemonQuery.json();
  }

  private async _initCache() {
    const pokemonReferenceList = await this._getCompletePokemonList();
    this.cache.setReferenceCache(pokemonReferenceList.results);
  }
}
