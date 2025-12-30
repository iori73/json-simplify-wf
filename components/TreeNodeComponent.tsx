/**
 * Tree Node Component
 * 
 * Renders a single node in the JSON tree.
 * Handles:
 * - Expand/collapse for objects and arrays
 * - Click events for path updates
 * - Value copying (drag selection)
 * - Visual styling based on type
 * 
 * This is a recursive component - it renders itself for children
 */

'use client';

import { TreeNode } from '@/lib/types';
import { formatValueDisplay, isLeafNode, toJsonString } from '@/lib/jsonUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { useState } from 'react';

interface TreeNodeComponentProps {
    node: TreeNode;
    onToggleExpand: (path: string) => void;
    onNodeClick: (node: TreeNode) => void;
    isExpanded: boolean;
    isSelected: boolean;
    searchKey: string;
    searchValue: string;
    expandedPaths: Set<string>;
}

export default function TreeNodeComponent({
    node,
    onToggleExpand,
    onNodeClick,
    isExpanded,
    isSelected,
    searchKey,
    searchValue,
    expandedPaths,
}: TreeNodeComponentProps) {
    const [showCopyHint, setShowCopyHint] = useState(false);

    const isLeaf = isLeafNode(node.value);
    const hasChildren = node.children && node.children.length > 0;

    // Determine if this node matches search
    const matchesKey = searchKey && node.key.toLowerCase().includes(searchKey.toLowerCase());
    const matchesValue = searchValue && isLeaf && String(node.value).toLowerCase().includes(searchValue.toLowerCase());
    const matchesSearch = matchesKey || matchesValue;

    // Handle node click
    const handleClick = () => {
        if (isLeaf) {
            // For leaf nodes, copy the path
            copyToClipboard(node.path);
            onNodeClick(node);
            setShowCopyHint(true);
            setTimeout(() => setShowCopyHint(false), 1500);
        } else {
            // For objects/arrays, toggle expand and update path
            onToggleExpand(node.path);
            onNodeClick(node);
        }
    };

    // Handle value selection (drag to copy)
    const handleValueMouseUp = async (e: React.MouseEvent) => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            e.stopPropagation();
            // Copy the JSON-safe value
            await copyToClipboard(toJsonString(node.value));
        }
    };

    // Get color class based on type
    const getTypeClass = () => {
        switch (node.type) {
            case 'string': return 'type-string';
            case 'number': return 'type-number';
            case 'boolean': return 'type-boolean';
            case 'null': return 'type-null';
            case 'array':
            case 'object': return 'type-bracket';
            default: return 'text-[var(--text-muted)]';
        }
    };

    return (
        <div className="select-none">
            {/* Node header */}
            <div
                onClick={handleClick}
                className={`
                    flex items-center gap-2 py-1 px-2 cursor-pointer rounded transition-colors duration-150
                    hover:bg-[var(--bg-hover)]
                    ${isSelected ? 'bg-[var(--color-primary)]/20 border border-[var(--color-primary)]' : ''}
                    ${matchesSearch ? 'bg-[var(--color-warning)]/20' : ''}
                `}
                style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
            >
                {/* Expand/collapse icon */}
                {hasChildren && (
                    <span 
                        className="text-[var(--text-muted)] w-4 flex-shrink-0 text-xs transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                        ▶
                    </span>
                )}
                {!hasChildren && <span className="w-4 flex-shrink-0" />}

                {/* Key name */}
                <span className={`type-key ${matchesKey ? 'search-match' : ''}`}>
                    {node.key}
                </span>
                <span className="text-[var(--text-muted)]">:</span>

                {/* Value display */}
                <span
                    className={`${getTypeClass()} ${isLeaf ? 'select-text' : ''} ${matchesValue ? 'search-match' : ''}`}
                    onMouseUp={isLeaf ? handleValueMouseUp : undefined}
                >
                    {formatValueDisplay(node.value, node.type)}
                </span>

                {/* Copy hint */}
                {showCopyHint && (
                    <span className="text-xs text-[var(--color-success)] ml-2">
                        ✓ Path copied
                    </span>
                )}
            </div>

            {/* Children (recursive) */}
            {hasChildren && isExpanded && node.children && (
                <div className="border-l border-[var(--border-main)] ml-4">
                    {node.children.map((child, index) => (
                        <TreeNodeComponent
                            key={`${child.path}-${index}`}
                            node={child}
                            onToggleExpand={onToggleExpand}
                            onNodeClick={onNodeClick}
                            isExpanded={expandedPaths.has(child.path)}
                            isSelected={false}
                            searchKey={searchKey}
                            searchValue={searchValue}
                            expandedPaths={expandedPaths}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
