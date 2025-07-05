"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePokemon } from "@/context/PokemonContext";
import { searchPokemon } from "@/helper/search";
import CardList from "@/components/CardList/CardList";
import { Spinner } from "@/utils/Spinner/Spinner";
import { Pokemon } from "@/types/pokemon";

function SearchResults()
{
    const { pokemonList, isLoading } = usePokemon();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const [searchResult, setSearchResult] = useState<Pokemon[]>([]);

    useEffect(() =>
    {
        if (!isLoading)
        {
            const result = searchPokemon(query, pokemonList);
            setSearchResult(result);
        }
    }, [query, pokemonList, isLoading]);

    if (isLoading)
    {
        return <Spinner />;
    }

    return (
        <div>
            <h2 style={{ textAlign: "center", margin: "2rem", fontSize: "1.8rem" }}>
                Search Result for: "{query}"
            </h2>
            <CardList pokemonList={searchResult} />
        </div>
    );
}

export default function SearchPage()
{
    return (
        <Suspense fallback={<Spinner />}>
            <SearchResults />
        </Suspense>
    );
}