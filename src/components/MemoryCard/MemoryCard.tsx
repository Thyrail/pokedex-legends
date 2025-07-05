import './MemoryCard.scss';
import Image from 'next/image';

interface MemoryCardProps
{
    card: {
        sprite: string;
        pokemonId: number;
        isFlipped: boolean;
        isMatched: boolean;
    };
    onClick: () => void;
    isDisabled: boolean;
}

export default function MemoryCard({ card, onClick, isDisabled }: MemoryCardProps)
{
    const handleClick = () =>
    {
        if (!isDisabled && !card.isFlipped)
        {
            onClick();
        }
    };

    return (
        <div className="card-scene">
            <div
                className={`card ${card.isFlipped ? 'is-flipped' : ''}`}
                onClick={handleClick}
            >
                <div className="card-face card-face-front">?</div>
                <div className="card-face card-face-back">
                    <Image
                        src={card.sprite}
                        alt={`Pokemon ${card.pokemonId}`}
                        fill
                        sizes="(max-width: 768px) 20vw, 120px"
                        style={{ objectFit: 'contain' }}
                        quality={100}
                    />
                </div>
            </div>
        </div>
    );
}