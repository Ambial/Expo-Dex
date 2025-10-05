import { PokemonDetails, PokemonListItem } from "../types";

// Minimal helpers for PokéAPI
export const PAGE_SIZE = 40;


export function idFromUrl(url: string): number {
  // e.g. https://pokeapi.co/api/v2/pokemon/25/ -> 25
  const m = url.match(/\/pokemon\/(\d+)\//);
  return m ? Number(m[1]) : 0;
}

export function artworkUri(id: number) {
  // Official artwork (nice quality)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function fetchPage(offset = 0): Promise<PokemonListItem[]> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  const json = await res.json();
  return json.results as PokemonListItem[];
}

export async function fetchDetails(idOrName: number | string): Promise<PokemonDetails> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon details");
  return (await res.json()) as PokemonDetails;
}
export { PokemonListItem, PokemonDetails };

