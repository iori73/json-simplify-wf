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
        <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700">
            {/* Search by Key */}
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={searchKey}
                    onChange={handleKeyChange}
                    placeholder="Search by key..."
                    className="w-full px-3 py-2 pr-8 bg-gray-900 text-gray-200 text-sm rounded border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchKey && (
                    <button
                        onClick={handleClearKey}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
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
                    className="w-full px-3 py-2 pr-8 bg-gray-900 text-gray-200 text-sm rounded border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchValue && (
                    <button
                        onClick={handleClearValue}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
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
                    className="px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors cursor-pointer whitespace-nowrap"
                    title="Clear all searches"
                >
                    Clear All
                </button>
            )}

            {/* Match Count */}
            {hasAnySearch && matchCount !== undefined && (
                <div className="text-xs text-gray-400 whitespace-nowrap">
                    {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                </div>
            )}
        </div>
    );
}
