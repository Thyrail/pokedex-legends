const typeChart: { [key: string]: { effective: string[], ineffective: string[], immune: string[] } } = {
    normal: { effective: [], ineffective: ["rock", "steel"], immune: ["ghost"] },
    fire: { effective: ["grass", "ice", "bug", "steel"], ineffective: ["fire", "water", "rock", "dragon"], immune: [] },
    water: { effective: ["fire", "ground", "rock"], ineffective: ["water", "grass", "dragon"], immune: [] },
    grass: { effective: ["water", "ground", "rock"], ineffective: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"], immune: [] },
    electric: { effective: ["water", "flying"], ineffective: ["electric", "grass", "dragon"], immune: ["ground"] },
    ice: { effective: ["grass", "ground", "flying", "dragon"], ineffective: ["fire", "water", "ice", "steel"], immune: [] },
    fighting: { effective: ["normal", "ice", "rock", "dark", "steel"], ineffective: ["poison", "flying", "psychic", "bug", "fairy"], immune: ["ghost"] },
    poison: { effective: ["grass", "fairy"], ineffective: ["poison", "ground", "rock", "ghost"], immune: ["steel"] },
    ground: { effective: ["fire", "electric", "poison", "rock", "steel"], ineffective: ["grass", "bug"], immune: ["flying"] },
    flying: { effective: ["grass", "fighting", "bug"], ineffective: ["electric", "rock", "steel"], immune: [] },
    psychic: { effective: ["fighting", "poison"], ineffective: ["psychic", "steel"], immune: ["dark"] },
    bug: { effective: ["grass", "psychic", "dark"], ineffective: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"], immune: [] },
    rock: { effective: ["fire", "ice", "flying", "bug"], ineffective: ["fighting", "ground", "steel"], immune: [] },
    ghost: { effective: ["psychic", "ghost"], ineffective: ["dark"], immune: ["normal"] },
    dragon: { effective: ["dragon"], ineffective: ["steel"], immune: ["fairy"] },
    dark: { effective: ["psychic", "ghost"], ineffective: ["fighting", "dark", "fairy"], immune: [] },
    steel: { effective: ["ice", "rock", "fairy"], ineffective: ["fire", "water", "electric", "steel"], immune: ["poison"] },
    fairy: { effective: ["fighting", "dragon", "dark"], ineffective: ["fire", "poison", "steel"], immune: [] },
};

export function calculateTypeEffectiveness(moveType: string, defenderTypes: string[]): number
{
    if (!typeChart[moveType]) return 1;

    let multiplier = 1;

    for (const defenderType of defenderTypes)
    {
        const moveEffectiveness = typeChart[moveType];
        if (moveEffectiveness.effective.includes(defenderType))
        {
            multiplier *= 2;
        }
        if (moveEffectiveness.ineffective.includes(defenderType))
        {
            multiplier *= 0.5;
        }
        if (moveEffectiveness.immune.includes(defenderType))
        {
            return 0;
        }
    }

    return multiplier;
}