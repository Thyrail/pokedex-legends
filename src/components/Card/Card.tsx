import "./Card.scss";
import { Pokemon } from "@/types/pokemon";
import Image from "next/image";

const heart = "♥";

interface CardProps
{
    pokemon: Pokemon;
    isFavorite: boolean;
    onFavoriteClick: (id: number) => void;
}

export default function Card({ pokemon, isFavorite, onFavoriteClick }: CardProps)
{
    const handlerFavoriteOnClick = () =>
    {
        onFavoriteClick(pokemon.id);
    };

    return (
        <div className="Card-Item">
            <div className="Card-Title">
                <span>{pokemon.id}</span>
                <span className="first-upper">{pokemon.name}</span>

                <div className="heart-container">
                    <div
                        className={`heart ${isFavorite ? "favorite" : ""}`}
                        onClick={handlerFavoriteOnClick}
                        role="button"
                        aria-pressed={isFavorite}
                    >
                        ♥
                    </div>
                    <div className="heart-shine"></div>
                </div>
            </div>

            <div className="Card-Image">
                <Image
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 300px"
                    style={{ objectFit: 'contain', padding: '1rem' }}
                />
            </div>

            <div className="Card-Types">
                {pokemon.types.map((type) => (
                    <div key={type.name} className="type">
                        {type.symbol && <img className="type-img" src={type.symbol} alt={type.name} />}
                        <strong className="type-name">{type.name}</strong>
                    </div>
                ))}
            </div>

            <div className="Card-Abilities">
                <div className="abilities-content-wrapper">
                    {pokemon.abilities.map((ability) => (
                        <div key={ability.name}>
                            <span className="ability-name">{ability.name}</span>
                            <span className="ability-description">{ability.description}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}