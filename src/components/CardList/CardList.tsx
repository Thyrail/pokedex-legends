"use client";

import { useState, useEffect } from "react";
import Card from "../Card/Card";
import "./CardList.scss";
import { allFavorite, addFavorite, removeFavorite } from "@/helper/storageWorker";
import { Pokemon } from "@/types/pokemon";

interface CardListProps
{
    pokemonList: Pokemon[];
}

export default function CardList({ pokemonList }: CardListProps)
{
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() =>
    {
        setFavorites(allFavorite());
    }, []);

    const handleFavoriteClick = (id: number) =>
    {
        const isFav = favorites.includes(id);
        let updatedFavorites;
        if (isFav)
        {
            removeFavorite(id);
            updatedFavorites = favorites.filter((favId) => favId !== id);
        } else
        {
            addFavorite(id);
            updatedFavorites = [...favorites, id];
        }
        setFavorites(updatedFavorites);
    };

    if (pokemonList.length === 0)
    {
        return <p style={{ textAlign: 'center', width: '100%', fontSize: '1.5rem' }}>No Pokémon found.</p>;
    }

    return (
        <div className="Card-List">
            {pokemonList.map((pokemon) => (
                <Card
                    key={pokemon.id}
                    pokemon={pokemon}
                    isFavorite={favorites.includes(pokemon.id)}
                    onFavoriteClick={handleFavoriteClick}
                />
            ))}
        </div>
    );
}