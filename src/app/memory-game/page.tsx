"use client";

import { useState, useEffect, useCallback } from "react";
import { usePokemon } from "@/context/PokemonContext";
import MemoryCard from "@/components/MemoryCard/MemoryCard";
import './MemoryGame.scss';

type MemoryCardType = {
    id: string;
    pokemonId: number;
    sprite: string;
    isMatched: boolean;
};

const DIFFICULTY_LEVELS = {
    easy: { pairs: 8, time: 300 },
    normal: { pairs: 12, time: 300 },
    hard: { pairs: 20, time: 300 },
};

export default function MemoryGamePage()
{
    const { pokemonList, isLoading } = usePokemon();
    const [gameState, setGameState] = useState<'selection' | 'playing' | 'finished'>('selection');
    const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
    const [cards, setCards] = useState<MemoryCardType[]>([]);
    const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(DIFFICULTY_LEVELS[difficulty].time);
    const [isGameWon, setIsGameWon] = useState(false);

    //* Game Setup
    const setupGame = useCallback((level: 'easy' | 'normal' | 'hard') =>
    {
        const { pairs } = DIFFICULTY_LEVELS[level];
        const shuffledPokemon = [...pokemonList].sort(() => 0.5 - Math.random());
        const selectedPokemon = shuffledPokemon.slice(0, pairs);
        const gameCards = [...selectedPokemon, ...selectedPokemon]
            .map((pokemon, index) => ({
                id: `${pokemon.id}-${index}`,
                pokemonId: pokemon.id,
                sprite: pokemon.sprite,
                isMatched: false,
            }))
            .sort(() => 0.5 - Math.random());
        setCards(gameCards);
        setGameState('playing');
        setTimer(DIFFICULTY_LEVELS[level].time);
        setMoves(0);
        setFlippedIndexes([]);
        setIsGameWon(false);
    }, [pokemonList]);

    //* Game Logic
    const handleCardClick = (clickedIndex: number) =>
    {
        if (isChecking || flippedIndexes.length >= 2 || flippedIndexes.includes(clickedIndex) || cards[clickedIndex].isMatched)
        {
            return;
        }
        setFlippedIndexes((prev) => [...prev, clickedIndex]);
    };

    useEffect(() =>
    {
        if (flippedIndexes.length !== 2) return;

        setMoves(prevMoves => prevMoves + 1);
        setIsChecking(true);

        const [firstIndex, secondIndex] = flippedIndexes;
        const card1 = cards[firstIndex];
        const card2 = cards[secondIndex];

        if (card1.pokemonId === card2.pokemonId)
        {
            setCards(prevCards =>
                prevCards.map(card =>
                    card.pokemonId === card1.pokemonId ? { ...card, isMatched: true } : card
                )
            );
            setFlippedIndexes([]);
            setIsChecking(false);
        } else
        {
            setTimeout(() =>
            {
                setFlippedIndexes([]);
                setIsChecking(false);
            }, 1200);
        }
    }, [flippedIndexes, cards]);

    useEffect(() =>
    {
        if (gameState === 'playing' && timer > 0 && !isGameWon)
        {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
        if (timer === 0 && gameState === 'playing')
        {
            setGameState('finished');
            setIsGameWon(false);
        }
    }, [gameState, timer, isGameWon]);

    useEffect(() =>
    {
        if (cards.length > 0 && cards.every(card => card.isMatched))
        {
            setIsGameWon(true);
            setGameState('finished');
        }
    }, [cards]);

    //* Rendering
    if (isLoading) return <p>Loading Pokémon data...</p>;

    if (gameState === 'selection' || gameState === 'finished')
    {
        return (
            <div className="game-container">
                <div className={gameState === 'selection' ? 'selection-screen' : 'finished-screen'}>
                    {gameState === 'selection' ? (
                        <>
                            <h2>Select Difficulty</h2>
                            <div className="difficulty-buttons">
                                <button className={difficulty === 'easy' ? 'active' : ''} onClick={() => setDifficulty('easy')}>Easy</button>
                                <button className={difficulty === 'normal' ? 'active' : ''} onClick={() => setDifficulty('normal')}>Normal</button>
                                <button className={difficulty === 'hard' ? 'active' : ''} onClick={() => setDifficulty('hard')}>Hard</button>
                            </div>
                            <button className="start-button" onClick={() => setupGame(difficulty)}>Start Game!</button>
                        </>
                    ) : (
                        <>
                            <h2>{isGameWon ? 'Congratulations, You Won!' : "Time's Up!"}</h2>
                            <p>You used {moves} moves.</p>
                            <button className="start-button" onClick={() => setupGame(difficulty)}>New Game</button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="game-stats">
                <span>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                <span>Moves: {moves}</span>
            </div>
            <div className={`game-board difficulty-${difficulty}`}>
                {cards.map((card, index) =>
                {
                    const isFlipped = flippedIndexes.includes(index) || card.isMatched;
                    return (
                        <MemoryCard
                            key={card.id}
                            card={{ ...card, isFlipped }}
                            onClick={() => handleCardClick(index)}
                            isDisabled={isChecking || isFlipped}
                        />
                    );
                })}
            </div>
        </div>
    );
}