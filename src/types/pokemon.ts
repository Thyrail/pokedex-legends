export interface PokemonType
{
    name: string;
    symbol: string | null;
}

export interface PokemonAbility
{
    name: string;
    description: string;
}

export interface Pokemon
{
    id: number;
    name: string;
    abilities: PokemonAbility[];
    types: PokemonType[];
    sprite: string;
}

export interface Stat
{
    name: string;
    value: number;
}

export interface Move
{
    name: string;
    power: number | null;
    accuracy: number | null;
    pp: number;
    type: string;
    damage_class: string;
}

export interface BattlePokemon extends Pokemon
{
    stats: Stat[];
    moves: Move[];
    currentHp: number;
    level: number;
    exp: number;
}