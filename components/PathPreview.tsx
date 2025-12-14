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
import { toJsonString, formatValueDisplay, isLeafNode } from '@/lib/jsonUtils';
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
                    <div className="text-xs text-gray-400 mb-1">Value:</div>
                    <pre className="text-sm text-gray-200 font-mono">
                        {toJsonString(selectedNode.value)}
                    </pre>
                </div>
            );
        } else {
            // For objects/arrays, show formatted JSON
            return (
                <div className="flex-1 overflow-auto">
                    <div className="text-xs text-gray-400 mb-1">
                        {selectedNode.type === 'array' ? 'Array' : 'Object'} Preview:
                    </div>
                    <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap">
                        {JSON.stringify(selectedNode.value, null, 2)}
                    </pre>
                </div>
            );
        }
    };

    if (!selectedNode) {
        return (
            <div className="h-full bg-gray-900 border-t border-gray-700 flex items-center justify-center">
                <p className="text-sm text-gray-500">
                    Click on any node to see its path and value
                </p>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-900 border-t border-gray-700 flex flex-col">
            {/* Path display */}
            <div className="border-b border-gray-700 p-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">Path:</div>
                        <div className="flex items-center gap-2">
                            <code className="text-sm text-blue-400 font-mono bg-gray-800 px-2 py-1 rounded truncate">
                                {selectedNode.path}
                            </code>
                        </div>
                    </div>
                    <button
                        onClick={handleCopyPath}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors flex-shrink-0"
                    >
                        {copiedItem === 'path' ? '✓ Copied' : 'Copy Path'}
                    </button>
                </div>
            </div>

            {/* Value preview */}
            <div className="flex-1 p-3 overflow-hidden flex flex-col">
                {getPreviewContent()}

                {/* Copy value button */}
                <div className="mt-3 pt-3 border-t border-gray-700">
                    <button
                        onClick={handleCopyValue}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors"
                    >
                        {copiedItem === 'value' ? '✓ Copied' : 'Copy Value (JSON)'}
                    </button>
                </div>
            </div>

            {/* Type indicator */}
            <div className="border-t border-gray-700 px-3 py-2 bg-gray-800 bg-opacity-50">
                <span className="text-xs text-gray-400">
                    Type: <span className="text-gray-300 font-mono">{selectedNode.type}</span>
                </span>
            </div>
        </div>
    );
}
