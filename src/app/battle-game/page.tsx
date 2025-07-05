"use client";

import { useState, useEffect, useCallback } from "react";
import { usePokemon } from "@/context/PokemonContext";
import { Pokemon, BattlePokemon, Move } from "@/types/pokemon";
import Image from 'next/image';
import './BattleGame.scss';
import { getBattlePokemonDetails } from "@/services/pokemonApi";
import { calculateTypeEffectiveness } from "@/helper/battleHelper";

const TEAM_SIZE = 3;

export default function BattleGamePage()
{
    const { pokemonList, isLoading } = usePokemon();

    const [gameState, setGameState] = useState<'setup-team' | 'setup-difficulty' | 'battle' | 'game-over'>('setup-team');
    const [selectedTeam, setSelectedTeam] = useState<Pokemon[]>([]);
    const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

    const [activePlayerPokemon, setActivePlayerPokemon] = useState<BattlePokemon | null>(null);
    const [enemyPokemon, setEnemyPokemon] = useState<BattlePokemon | null>(null);
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [score, setScore] = useState(0);
    const [wave, setWave] = useState(1);

    const setupNextOpponent = useCallback(async () =>
    {
        let randomEnemyId: number;
        do
        {
            randomEnemyId = Math.floor(Math.random() * 151) + 1;
        } while (selectedTeam.find(p => p.id === randomEnemyId));

        const enemyMonDetails = await getBattlePokemonDetails(randomEnemyId);
        setEnemyPokemon(enemyMonDetails || null);
        setBattleLog(prev => [...prev, `A wild ${enemyMonDetails?.name} appeared!`]);
        setIsPlayerTurn(true);
    }, [selectedTeam]);

    const setupBattle = useCallback(async () =>
    {
        if (selectedTeam.length === 0) return;
        const playerMonDetails = await getBattlePokemonDetails(selectedTeam[0].id);
        setActivePlayerPokemon(playerMonDetails || null);

        await setupNextOpponent();

        setBattleLog([`Battle starts!`, `Go, ${playerMonDetails?.name}!`]);
        setIsPlayerTurn(true);
        setScore(0);
        setWave(1);
    }, [selectedTeam, setupNextOpponent]);

    useEffect(() =>
    {
        if (gameState === 'battle')
        {
            setupBattle();
        }
    }, [gameState, setupBattle]);


    const calculateDamage = (attacker: BattlePokemon, defender: BattlePokemon, move: Move): number =>
    {
        if (move.power === null) return 0;
        const attackStat = attacker.stats.find(s => s.name === 'attack')?.value || 50;
        const defenseStat = defender.stats.find(s => s.name === 'defense')?.value || 50;
        const effectiveness = calculateTypeEffectiveness(move.type, defender.types.map(t => t.name));
        const damage = Math.floor(((((2 * attacker.level / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2) * effectiveness * (Math.random() * (1 - 0.85) + 0.85)));
        return damage;
    };

    const handleAttack = (move: Move) =>
    {
        if (!isPlayerTurn || !activePlayerPokemon || !enemyPokemon || gameState === 'game-over') return;

        setIsPlayerTurn(false);
        let turnLog: string[] = [`${activePlayerPokemon.name} used ${move.name}!`];

        if (move.damage_class === 'status')
        {
            switch (move.name)
            {
                case 'growth':
                    setActivePlayerPokemon(prev =>
                    {
                        if (!prev) return null;
                        turnLog.push(`${prev.name}'s Attack rose!`);
                        return {
                            ...prev,
                            stats: prev.stats.map(stat =>
                                stat.name === 'attack' ? { ...stat, value: Math.floor(stat.value * 1.2) } : stat
                            )
                        };
                    });
                    break;
                default:
                    turnLog.push("But it failed!");
                    break;
            }
        } else
        {
            const playerDamage = calculateDamage(activePlayerPokemon, enemyPokemon, move);
            const newEnemyHp = Math.max(0, enemyPokemon.currentHp - playerDamage);
            turnLog.push(playerDamage > 0 ? `It dealt ${playerDamage} damage.` : `It had no effect...`);

            document.getElementById('enemy-pokemon')?.classList.add('hit');
            setTimeout(() => document.getElementById('enemy-pokemon')?.classList.remove('hit'), 400);

            setEnemyPokemon(prev => prev ? { ...prev, currentHp: newEnemyHp } : null);

            if (newEnemyHp <= 0)
            {
                turnLog.push(`${enemyPokemon.name} fainted! You win this round!`);
                setBattleLog(prev => [...prev, ...turnLog]);
                setTimeout(() =>
                {
                    setScore(prev => prev + 100 * wave);
                    setWave(prev => prev + 1);
                    const playerMaxHp = activePlayerPokemon.stats.find(s => s.name === 'hp')?.value || 100;
                    const healedHp = Math.min(playerMaxHp, activePlayerPokemon.currentHp + Math.floor(playerMaxHp * 0.25));
                    setActivePlayerPokemon(prev => prev ? { ...prev, currentHp: healedHp } : null);
                    setupNextOpponent();
                }, 2000);
                return;
            }
        }

        setBattleLog(prev => [...prev, ...turnLog]);

        setTimeout(() =>
        {
            if (!activePlayerPokemon || !enemyPokemon) return;
            const enemyMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
            const enemyDamage = calculateDamage(enemyPokemon, activePlayerPokemon, enemyMove);
            const newPlayerHp = Math.max(0, activePlayerPokemon.currentHp - enemyDamage);

            let enemyTurnLog = [`${enemyPokemon.name} used ${enemyMove.name}!`];
            enemyTurnLog.push(enemyDamage > 0 ? `It dealt ${enemyDamage} damage.` : `It had no effect...`);

            document.getElementById('player-pokemon')?.classList.add('hit');
            setTimeout(() => document.getElementById('player-pokemon')?.classList.remove('hit'), 400);

            setActivePlayerPokemon(prev => prev ? { ...prev, currentHp: newPlayerHp } : null);
            setBattleLog(prev => [...prev, ...enemyTurnLog]);

            if (newPlayerHp <= 0)
            {
                setBattleLog(prev => [...prev, `${activePlayerPokemon.name} fainted! Game Over!`]);
                setGameState('game-over');
            } else
            {
                setIsPlayerTurn(true);
            }
        }, 2000);
    };

    const handlePokemonSelect = (pokemon: Pokemon) =>
    {
        if (selectedTeam.length < TEAM_SIZE && !selectedTeam.find(p => p.id === pokemon.id))
        {
            setSelectedTeam([...selectedTeam, pokemon]);
        } else if (selectedTeam.find(p => p.id === pokemon.id))
        {
            setSelectedTeam(selectedTeam.filter(p => p.id !== pokemon.id));
        }
    };
    const handleConfirmTeam = () => { if (selectedTeam.length === TEAM_SIZE) setGameState('setup-difficulty'); };
    const handleStartBattle = () => { setGameState('battle'); };

    if (isLoading) { return <div className="battle-setup-container"><p>Loading Pokémon...</p></div>; }

    if (gameState === 'setup-team' || gameState === 'setup-difficulty' || gameState === 'game-over')
    {
        return (
            <div className="battle-setup-container">
                {gameState === 'setup-team' && (
                    <>
                        <h1>Choose your Team ({selectedTeam.length} / {TEAM_SIZE})</h1>
                        <div className="player-team-display">
                            {Array.from({ length: TEAM_SIZE }).map((_, index) => (
                                <div key={index} className="team-slot">{selectedTeam[index] ? <Image src={selectedTeam[index].sprite} alt={selectedTeam[index].name} width={80} height={80} /> : <div className="empty-slot">?</div>}</div>
                            ))}
                        </div>
                        <button className="confirm-button" onClick={handleConfirmTeam} disabled={selectedTeam.length !== TEAM_SIZE}>Confirm Team</button>
                        <div className="pokemon-selection-grid">
                            {pokemonList.map(p => (
                                <div key={p.id} className={`pokemon-option ${selectedTeam.find(sp => sp.id === p.id) ? 'selected' : ''}`} onClick={() => handlePokemonSelect(p)}>
                                    <Image src={p.sprite} alt={p.name} width={60} height={60} /><span className="pokemon-name">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {gameState === 'setup-difficulty' && (
                    <>
                        <h1>Select Difficulty</h1>
                        <div className="difficulty-selection">
                            <button className={difficulty === 'easy' ? 'active' : ''} onClick={() => setDifficulty('easy')}><h2>Easy</h2><p>Enemy level matches yours</p></button>
                            <button className={difficulty === 'normal' ? 'active' : ''} onClick={() => setDifficulty('normal')}><h2>Normal</h2><p>Enemies are slightly stronger</p></button>
                            <button className={difficulty === 'hard' ? 'active' : ''} onClick={() => setDifficulty('hard')}><h2>Hard</h2><p>Enemies are much stronger</p></button>
                        </div>
                        <button className="confirm-button" onClick={handleStartBattle}>Start Battle!</button>
                    </>
                )}
                {gameState === 'game-over' && (
                    <div className="finished-screen">
                        <h2>Game Over!</h2>
                        <p>Your final score is {score}.</p>
                        <button className="confirm-button" onClick={() => setGameState('setup-team')}>Play Again</button>
                    </div>
                )}
            </div>
        );
    }

    if (gameState === 'battle')
    {
        if (!activePlayerPokemon || !enemyPokemon)
        {
            return <div className="battle-container"><p>Loading battle...</p></div>;
        }
        const playerMaxHp = activePlayerPokemon.stats.find(s => s.name === 'hp')?.value || 100;
        const enemyMaxHp = enemyPokemon.stats.find(s => s.name === 'hp')?.value || 100;
        return (
            <div className="battle-container">
                <div className="battle-header"><span>Score: {score}</span><span>Wave: {wave}</span></div>
                <div className="battle-arena">
                    <div className="pokemon-display enemy-display">
                        <div className="info-box"><span className="name">{enemyPokemon.name}</span><div className="health-bar"><div className="hp-label">HP</div><progress max={enemyMaxHp} value={enemyPokemon.currentHp}></progress><span className="hp-value">{enemyPokemon.currentHp}/{enemyMaxHp}</span></div></div>
                        <Image id="enemy-pokemon" src={enemyPokemon.sprite} alt={enemyPokemon.name} width={200} height={200} />
                    </div>
                    <div className="pokemon-display player-display">
                        <Image id="player-pokemon" src={activePlayerPokemon.sprite} alt={activePlayerPokemon.name} width={250} height={250} />
                        <div className="info-box"><span className="name">{activePlayerPokemon.name}</span><div className="health-bar"><div className="hp-label">HP</div><progress max={playerMaxHp} value={activePlayerPokemon.currentHp}></progress><span className="hp-value">{activePlayerPokemon.currentHp}/{playerMaxHp}</span></div></div>
                    </div>
                </div>
                <div className="action-menu">
                    <div className="battle-log">{battleLog.slice(-2).map((entry, index) => <p key={index}>{entry}</p>)}</div>
                    <div className="moves-menu">
                        {activePlayerPokemon.moves.map(move => (
                            <div key={move.name} className="move-tooltip-container">
                                <button onClick={() => handleAttack(move)} disabled={!isPlayerTurn}>{move.name}</button>
                                <div className="move-tooltip"><p><strong>Type:</strong> {move.type}</p><p><strong>Power:</strong> {move.power ?? 'N/A'}</p><p><strong>Accuracy:</strong> {move.accuracy ?? 'N/A'}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}