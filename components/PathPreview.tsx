/**
 * Path Preview Component
 * 
 * Bottom panel that shows:
 * - Current path in bracket notation
 * - Value preview for selected node
 * - Copy buttons for path and value
 */

'use client';

import { TreeNode } from '@/lib/types';
import { toJsonString, isLeafNode } from '@/lib/jsonUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { useState } from 'react';

interface PathPreviewProps {
    selectedNode: TreeNode | null;
}

export default function PathPreview({ selectedNode }: PathPreviewProps) {
    const [copiedItem, setCopiedItem] = useState<'path' | 'value' | null>(null);

    // Handle copy path
    const handleCopyPath = async () => {
        if (selectedNode) {
            await copyToClipboard(selectedNode.path);
            setCopiedItem('path');
            setTimeout(() => setCopiedItem(null), 2000);
        }
    };

    // Handle copy value
    const handleCopyValue = async () => {
        if (selectedNode) {
            await copyToClipboard(toJsonString(selectedNode.value));
            setCopiedItem('value');
            setTimeout(() => setCopiedItem(null), 2000);
        }
    };

    // Get preview content based on node type
    const getPreviewContent = () => {
        if (!selectedNode) return null;

        const isLeaf = isLeafNode(selectedNode.value);

        if (isLeaf) {
            // For leaf nodes, show the value
            return (
                <div className="flex-1 overflow-auto">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Value:</div>
                    <pre className="text-sm text-[var(--text-main)] font-mono">
                        {toJsonString(selectedNode.value)}
                    </pre>
                </div>
            );
        } else {
            // For objects/arrays, show formatted JSON
            return (
                <div className="flex-1 overflow-auto">
                    <div className="text-xs text-[var(--text-muted)] mb-1">
                        {selectedNode.type === 'array' ? 'Array' : 'Object'} Preview:
                    </div>
                    <pre className="text-sm text-[var(--text-main)] font-mono whitespace-pre-wrap">
                        {JSON.stringify(selectedNode.value, null, 2)}
                    </pre>
                </div>
            );
        }
    };

    if (!selectedNode) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">
                    Click a node to see its path and value
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Path display */}
            <div className="panel-header">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-xs text-[var(--text-muted)] mb-1">Path:</div>
                        <code className="text-sm text-[var(--color-primary)] font-mono bg-[var(--bg-main)] px-2 py-1 rounded block truncate">
                            {selectedNode.path}
                        </code>
                    </div>
                    <button
                        onClick={handleCopyPath}
                        className="btn flex-shrink-0"
                    >
                        {copiedItem === 'path' ? '✓ Copied' : '📋 Copy Path'}
                    </button>
                </div>
            </div>

            {/* Value preview */}
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
                {getPreviewContent()}

                {/* Copy value button */}
                <div className="mt-2 pt-2 border-t border-[var(--border-main)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">
                        Type: <span className="text-[var(--color-primary)]">{selectedNode.type}</span>
                    </span>
                    <button
                        onClick={handleCopyValue}
                        className="btn"
                    >
                        {copiedItem === 'value' ? '✓ Copied' : '📋 Copy Value'}
                    </button>
                </div>
            </div>
        </div>
    );
}
