import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonCache } from './cache/pokemon-cache';

@Module({
  providers: [PokemonService, PokemonCache],
  controllers: [PokemonController],
})
export class PokemonModule {}
