/**
 * Tree Viewer Component
 * 
 * Right panel component that displays the JSON tree structure.
 * Features:
 * - Recursive tree rendering
 * - Expand/collapse functionality
 * - Search highlighting
 * - Path tracking
 */

'use client';

import { TreeNode } from '@/lib/types';
import TreeNodeComponent from './TreeNodeComponent';

interface TreeViewerProps {
    rootNode: TreeNode | null;
    onNodeClick: (node: TreeNode) => void;
    selectedPath: string | null;
    searchTerm: string;
    expandedPaths: Set<string>;
    onToggleExpand: (path: string) => void;
}

export default function TreeViewer({
    rootNode,
    onNodeClick,
    selectedPath,
    searchTerm,
    expandedPaths,
    onToggleExpand,
}: TreeViewerProps) {
    if (!rootNode) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                <div className="text-center">
                    <p className="text-lg mb-2">No JSON loaded</p>
                    <p className="text-sm">Paste JSON in the left panel to begin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-900 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-3 z-10">
                <h2 className="text-sm font-semibold text-gray-200">JSON Tree</h2>
            </div>

            {/* Tree content */}
            <div className="p-2">
                {rootNode.children && rootNode.children.map((child, index) => (
                    <TreeNodeComponent
                        key={`${child.path}-${index}`}
                        node={child}
                        onToggleExpand={onToggleExpand}
                        onNodeClick={onNodeClick}
                        isExpanded={expandedPaths.has(child.path)}
                        isSelected={selectedPath === child.path}
                        searchTerm={searchTerm}
                        expandedPaths={expandedPaths}
                    />
                ))}
            </div>
        </div>
    );
}
