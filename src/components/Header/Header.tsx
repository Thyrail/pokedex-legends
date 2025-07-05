"use client";

import "./Header.scss";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header()
{
    const [searchInput, setSearchInput] = useState("");
    const router = useRouter();

    const handleSearch = () =>
    {
        if (searchInput.trim())
        {
            router.push(`/search?query=${searchInput.trim()}`);
            setSearchInput("");
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if (event.key === "Enter")
        {
            event.preventDefault();
            handleSearch();
        }
    };

    return (
        <header className="header">
            <nav>
                <h1>PokeDex-Legends</h1>
                <form action="" onSubmit={(e) => e.preventDefault()}>
                    <input
                        value={searchInput}
                        type="text"
                        placeholder="Search for Name or ID"
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </form>
                <span>
                    <Link href="/" passHref>
                        <button>Home</button>
                    </Link>
                    <Link href="/favorites" passHref>
                        <button>Favorite</button>
                    </Link>
                    <Link href="/memory-game" passHref>
                        <button>Memory-Game</button>
                    </Link>
                    <Link href="/battle-game" passHref>
                        <button>Battle-Game</button>
                    </Link>
                </span>
            </nav>
        </header>
    );
}