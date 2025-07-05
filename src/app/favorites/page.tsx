"use client";

import { useState, useEffect } from "react";
import CardList from "@/components/CardList/CardList";
import { Spinner } from "@/utils/Spinner/Spinner";
import { usePokemon } from "@/context/PokemonContext";
import { Pokemon } from "@/types/pokemon";
import { allFavorite } from "@/helper/storageWorker";

export default function FavoritesPage()
{
    const { pokemonList, isLoading } = usePokemon();
    const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);

    useEffect(() =>
    {
        if (!isLoading)
        {
            const favoriteIds = allFavorite();
            const filtered = pokemonList.filter(p => favoriteIds.includes(p.id));
            setFavoritePokemon(filtered);
        }
    }, [isLoading, pokemonList]);

    if (isLoading)
    {
        return <Spinner />;
    }

    return <CardList pokemonList={favoritePokemon} />;
}