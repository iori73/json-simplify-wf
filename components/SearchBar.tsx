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
import { Search, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
            <Search className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />

            {/* Search by Key */}
            <div className="flex-1 relative">
                <Input
                    type="text"
                    value={searchKey}
                    onChange={handleKeyChange}
                    placeholder="Search by key..."
                    className="pr-8"
                />
                {searchKey && (
                    <button
                        onClick={handleClearKey}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer p-1 rounded hover:bg-[var(--bg-hover)]"
                        title="Clear key search"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Search by Value */}
            <div className="flex-1 relative">
                <Input
                    type="text"
                    value={searchValue}
                    onChange={handleValueChange}
                    placeholder="Search by value..."
                    className="pr-8"
                />
                {searchValue && (
                    <button
                        onClick={handleClearValue}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer p-1 rounded hover:bg-[var(--bg-hover)]"
                        title="Clear value search"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Clear All Button */}
            {hasAnySearch && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    title="Clear all searches"
                >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                </Button>
            )}

            {/* Match Count */}
            {hasAnySearch && matchCount !== undefined && (
                <div className="text-sm text-[var(--text-muted)] whitespace-nowrap bg-[var(--bg-panel-header)] px-3 py-1 rounded-md border border-[var(--border-main)]">
                    <span className="font-medium text-[var(--text-main)]">{matchCount}</span>
                    {' '}{matchCount === 1 ? 'match' : 'matches'}
                </div>
            )}
        </div>
    );
}
