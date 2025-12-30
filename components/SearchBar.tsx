/**
 * Search Bar Component
 * 
 * Allows searching for keys and values in the JSON tree.
 * Features:
 * - Dual search (by key and by value)
 * - Real-time search
 * - Auto-expand matching nodes
 * - Clear search buttons
 */

'use client';

import { ChangeEvent } from 'react';

interface SearchBarProps {
    searchKey: string;
    searchValue: string;
    onSearchKeyChange: (term: string) => void;
    onSearchValueChange: (term: string) => void;
    matchCount?: number;
}

export default function SearchBar({
    searchKey,
    searchValue,
    onSearchKeyChange,
    onSearchValueChange,
    matchCount
}: SearchBarProps) {
    const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchKeyChange(e.target.value);
    };

    const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchValueChange(e.target.value);
    };

    const handleClearKey = () => {
        onSearchKeyChange('');
    };

    const handleClearValue = () => {
        onSearchValueChange('');
    };

    const handleClearAll = () => {
        onSearchKeyChange('');
        onSearchValueChange('');
    };

    const hasAnySearch = searchKey || searchValue;

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-panel)] border-b border-[var(--border-main)]">
            {/* Search icon */}
            <span className="text-[var(--text-muted)]">🔍</span>

            {/* Search by Key */}
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={searchKey}
                    onChange={handleKeyChange}
                    placeholder="Search by key..."
                    className="input w-full pr-8"
                />
                {searchKey && (
                    <button
                        onClick={handleClearKey}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                        title="Clear key search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Search by Value */}
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleValueChange}
                    placeholder="Search by value..."
                    className="input w-full pr-8"
                />
                {searchValue && (
                    <button
                        onClick={handleClearValue}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                        title="Clear value search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Clear All Button */}
            {hasAnySearch && (
                <button
                    onClick={handleClearAll}
                    className="btn"
                    title="Clear all searches"
                >
                    Reset
                </button>
            )}

            {/* Match Count */}
            {hasAnySearch && matchCount !== undefined && (
                <div className="text-sm text-[var(--text-muted)] whitespace-nowrap">
                    {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </div>
            )}
        </div>
    );
}
