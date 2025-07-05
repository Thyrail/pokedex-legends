const LOCAL_STORAGE_KEY = "favoritePokemonIds";

function validateId(id: number | string): number | false
{
    const numId = typeof id === 'string' ? parseInt(id.trim(), 10) : id;
    if (!isNaN(numId) && numId >= 0 && Number.isInteger(numId))
    {
        return numId;
    }
    return false;
}

export function allFavorite(): number[]
{
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? (JSON.parse(data) as number[]) : [];
}

export function addFavorite(id: number | string): void
{
    const validId = validateId(id);
    if (validId === false) return;

    const favorites = allFavorite();
    if (!favorites.includes(validId))
    {
        const updatedFavorites = [...favorites, validId].sort((a, b) => a - b);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedFavorites));
    }
}

export function removeFavorite(id: number | string): void
{
    const validId = validateId(id);
    if (validId === false) return;

    let favorites = allFavorite();
    favorites = favorites.filter((favId) => favId !== validId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
}