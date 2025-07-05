import { Pokemon } from "@/types/pokemon";

export function searchPokemon(query: string, pokemonList: Pokemon[]): Pokemon[]
{
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery)
    {
        return [];
    }

    if (!isNaN(Number(trimmedQuery)))
    {
        const found = pokemonList.find((p) => p.id === Number(trimmedQuery));
        return found ? [found] : [];
    } else
    {
        const found = pokemonList.find((p) => p.name.toLowerCase() === trimmedQuery);
        return found ? [found] : [];
    }
}