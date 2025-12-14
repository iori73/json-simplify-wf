/**
 * Type definitions for JSON Simplify
 * 
 * These types help maintain consistency across the application
 * and provide better TypeScript support for junior developers.
 */

// Represents the type of a JSON value
export type JsonValueType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

// Represents a node in the JSON tree
export interface TreeNode {
    key: string;                  // The key name (for objects) or index (for arrays)
    value: unknown;                // The actual value
    type: JsonValueType;           // Type of the value
    path: string;                  // Full path to this node (e.g., "user.items[0].name")
    isExpanded?: boolean;          // Whether this node is expanded in the UI
    children?: TreeNode[];         // Child nodes (for objects and arrays)
    parent?: TreeNode;             // Reference to parent node
    depth: number;                 // Depth in the tree (0 = root)
}

// Represents a search match result
export interface SearchMatch {
    node: TreeNode;                // The matched node
    path: string;                  // Path to the matched node
}

// Props for components (helps junior devs understand component interfaces)
export interface JsonInputProps {
    onJsonChange: (json: string) => void;
    jsonError: string | null;
}

export interface TreeViewerProps {
    rootNode: TreeNode | null;
    onNodeClick: (node: TreeNode) => void;
    selectedPath: string | null;
    searchTerm: string;
    expandedPaths: Set<string>;
    onToggleExpand: (path: string) => void;
}

export interface PathPreviewProps {
    selectedNode: TreeNode | null;
    onCopyPath: () => void;
    onCopyValue: () => void;
}

export interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}
