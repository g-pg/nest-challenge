export type PokemonReference = {
  name: string;
  url: string;
};

export type PokemonListAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonReference[];
};
