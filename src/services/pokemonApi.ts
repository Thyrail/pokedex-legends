import { pokeApiUrl, artworkUrl } from "./config";
import { typeSymbols } from "./typeSymbols";
import { Pokemon, PokemonAbility, PokemonType, BattlePokemon, Move, Stat } from "@/types/pokemon";
import axios from "axios";

export async function fetchAllPokemon(): Promise<Pokemon[]>
{
    try
    {
        const response = await axios.get(pokeApiUrl);
        const pokemonList = response.data.results;

        const pokemonDetails = await Promise.all(
            pokemonList.map((p: { url: string }) => getPokemonDetails(p.url))
        );

        return pokemonDetails.filter((p): p is Pokemon => p !== undefined);
    } catch (error)
    {
        console.error("Fehler beim Abrufen der Pokémon-Liste:", error);
        return [];
    }
}

export async function getPokemonDetails(url: string): Promise<Pokemon | undefined>
{
    try
    {
        const { data } = await axios.get(url);
        const abilities = await getAbilitiesWithDescription(data.abilities);
        const types = getTypesWithSymbol(data.types);

        return {
            id: data.id,
            name: data.name,
            abilities,
            types,
            sprite: `${artworkUrl}${data.id}.png`,
        };
    } catch (error)
    {
        console.error(`Fehler beim Abrufen von Details für ${url}:`, error);
        return undefined;
    }
}

async function getAbilitiesWithDescription(abilities: any[]): Promise<PokemonAbility[]>
{
    return Promise.all(
        abilities.map(async (abilityItem) =>
        {
            const { data } = await axios.get(abilityItem.ability.url);
            const descriptionEntry = data.effect_entries.find(
                (entry: any) => entry.language.name === "en"
            );
            return {
                name: abilityItem.ability.name,
                description: descriptionEntry?.effect || "No description available.",
            };
        })
    );
}

function getTypesWithSymbol(types: any[]): PokemonType[]
{
    return types.map((typeItem) => ({
        name: typeItem.type.name,
        symbol: typeSymbols[typeItem.type.name] || null,
    }));
}

export async function getBattlePokemonDetails(nameOrId: string | number): Promise<BattlePokemon | undefined>
{
    try
    {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);

        const stats: Stat[] = data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
        }));

        const randomMoves = [...data.moves].sort(() => 0.5 - Math.random()).slice(0, 4);

        const moves: Move[] = await Promise.all(
            randomMoves.map(async (m: any) =>
            {
                const moveResponse = await axios.get(m.move.url);
                const moveData = moveResponse.data;
                return {
                    name: moveData.name,
                    power: moveData.power,
                    accuracy: moveData.accuracy,
                    pp: moveData.pp,
                    type: moveData.type.name,
                    damage_class: moveData.damage_class.name,
                };
            })
        );

        const hpStat = stats.find(s => s.name === 'hp')?.value || 100;
        return {
            id: data.id,
            name: data.name,
            sprite: `${artworkUrl}${data.id}.png`,
            types: getTypesWithSymbol(data.types),
            abilities: [],
            stats,
            moves,
            level: 50,
            exp: 0,
            currentHp: hpStat,
        };
    } catch (error)
    {
        console.error(`Fehler beim Abrufen der Kampf-Details für ${nameOrId}:`, error);
        return undefined;
    }
}