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

    // Get color based on type
    const getTypeColor = () => {
        switch (node.type) {
            case 'string': return 'text-green-400';
            case 'number': return 'text-blue-400';
            case 'boolean': return 'text-purple-400';
            case 'null': return 'text-gray-500';
            case 'array': return 'text-yellow-400';
            case 'object': return 'text-orange-400';
            default: return 'text-gray-300';
        }
    };

    return (
        <div className="select-none">
            {/* Node header */}
            <div
                onClick={handleClick}
                className={`
          flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-800 rounded
          ${isSelected ? 'bg-gray-800 ring-1 ring-gray-600' : ''}
          ${matchesSearch ? 'bg-yellow-900 bg-opacity-20' : ''}
        `}
                style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
            >
                {/* Expand/collapse icon */}
                {hasChildren && (
                    <span className="text-gray-400 w-4 flex-shrink-0">
                        {isExpanded ? '▼' : '▶'}
                    </span>
                )}
                {!hasChildren && <span className="w-4 flex-shrink-0" />}

                {/* Key name */}
                <span className={`font-medium ${matchesKey ? 'text-yellow-300' : 'text-gray-300'}`}>
                    {node.key}:
                </span>

                {/* Value display */}
                <span
                    className={`${getTypeColor()} ${isLeaf ? 'select-text' : ''} ${matchesValue ? 'text-yellow-300' : ''}`}
                    onMouseUp={isLeaf ? handleValueMouseUp : undefined}
                >
                    {formatValueDisplay(node.value, node.type)}
                </span>

                {/* Copy hint */}
                {showCopyHint && (
                    <span className="text-xs text-green-400 ml-2 animate-pulse">
                        ✓ Path copied
                    </span>
                )}
            </div>

            {/* Children (recursive) */}
            {hasChildren && isExpanded && node.children && (
                <div>
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
