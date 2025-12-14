/**
 * Search Bar Component
 * 
 * Allows searching for keys in the JSON tree.
 * Features:
 * - Real-time search
 * - Auto-expand matching nodes
 * - Clear search button
 */

'use client';

import { ChangeEvent } from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    matchCount?: number;
}

export default function SearchBar({ searchTerm, onSearchChange, matchCount }: SearchBarProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const handleClear = () => {
        onSearchChange('');
    };

    return (
        <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700">
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Search by key name..."
                    className="w-full px-3 py-2 pr-8 bg-gray-900 text-gray-200 text-sm rounded border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        title="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
            {searchTerm && matchCount !== undefined && (
                <div className="text-xs text-gray-400 whitespace-nowrap">
                    {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </div>
            )}
        </div>
    );
}
