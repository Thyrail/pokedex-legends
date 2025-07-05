"use client";

import CardList from "@/components/CardList/CardList";
import { Spinner } from "@/utils/Spinner/Spinner";
import { usePokemon } from "@/context/PokemonContext";

export default function HomePage()
{
  const { pokemonList, isLoading } = usePokemon();

  if (isLoading)
  {
    return <Spinner />;
  }

  return <CardList pokemonList={pokemonList} />;
}