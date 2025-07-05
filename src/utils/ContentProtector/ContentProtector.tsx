"use client";

import { useEffect } from 'react';

export function ContentProtector()
{
    useEffect(() =>
    {
        const handleContextMenu = (e: MouseEvent) =>
        {
            e.preventDefault();
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () =>
        {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return null;
}