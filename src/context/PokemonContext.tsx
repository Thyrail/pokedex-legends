"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Pokemon } from "@/types/pokemon";
import { fetchAllPokemon } from "@/services/pokemonApi";

interface PokemonContextType
{
    pokemonList: Pokemon[];
    isLoading: boolean;
}

const PokemonContext = createContext<PokemonContextType>({
    pokemonList: [],
    isLoading: true,
});

export function PokemonProvider({ children }: { children: ReactNode })
{
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        const loadInitialData = async () =>
        {
            const data = await fetchAllPokemon();
            setPokemonList(data);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    return (
        <PokemonContext.Provider value={{ pokemonList, isLoading }}>
            {children}
        </PokemonContext.Provider>
    );
}

export function usePokemon()
{
    return useContext(PokemonContext);
}