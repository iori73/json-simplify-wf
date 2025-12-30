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
    searchKey: string;
    searchValue: string;
    expandedPaths: Set<string>;
    onToggleExpand: (path: string) => void;
}

export default function TreeViewer({
    rootNode,
    onNodeClick,
    selectedPath,
    searchKey,
    searchValue,
    expandedPaths,
    onToggleExpand,
}: TreeViewerProps) {
    if (!rootNode) {
        return (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
                <div className="text-center p-8">
                    <p className="text-4xl mb-4">🌳</p>
                    <p className="text-lg mb-2">No Data</p>
                    <p className="text-sm">Enter JSON in the left panel to see the tree view</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 panel-header flex justify-between items-center z-10">
                <h2 className="text-sm font-medium text-[var(--text-bright)]">Tree View</h2>
                <span className="text-xs text-[var(--text-muted)]">
                    {rootNode.children?.length || 0} {rootNode.type === 'array' ? 'items' : 'keys'}
                </span>
            </div>

            {/* Tree content */}
            <div className="p-3 font-mono text-sm">
                {rootNode.children && rootNode.children.map((child, index) => (
                    <TreeNodeComponent
                        key={`${child.path}-${index}`}
                        node={child}
                        onToggleExpand={onToggleExpand}
                        onNodeClick={onNodeClick}
                        isExpanded={expandedPaths.has(child.path)}
                        isSelected={selectedPath === child.path}
                        searchKey={searchKey}
                        searchValue={searchValue}
                        expandedPaths={expandedPaths}
                    />
                ))}
            </div>
        </div>
    );
}
