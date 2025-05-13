import { Injectable } from '@nestjs/common';
import { PokemonReference } from '../types/poke-api.types';
import { POKE_CACHE_TTL } from '../constants/pokemon.constants';

@Injectable()
export class PokemonCache {
  private _referenceCache: PokemonReference[] = [];
  private _ttl: number = POKE_CACHE_TTL;
  private _lastUpdated: number = 0; // timestamp

  public isExpired(): boolean {
    const now = Date.now();
    return now - this._lastUpdated > this._ttl;
  }

  public flushCache(): void {
    this._referenceCache = [];
  }

  setReferenceCache(references: PokemonReference[]): void {
    this._lastUpdated = Date.now();
    this._referenceCache = references;
  }

  /**
   * @returns A shallow copy of the reference cache.
   */
  getReferenceCache(): PokemonReference[] {
    return this._referenceCache.slice();
  }
}
