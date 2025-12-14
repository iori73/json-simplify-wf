/**
 * JSON Utilities
 * 
 * Helper functions for working with JSON data.
 * These are pure functions that can be easily tested and understood.
 */

import { TreeNode, JsonValueType } from './types';

/**
 * Validates if a string is valid JSON
 * @param jsonString - String to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateJson(jsonString: string): { isValid: boolean; error: string | null } {
    if (!jsonString.trim()) {
        return { isValid: false, error: 'JSON input is empty' };
    }

    try {
        JSON.parse(jsonString);
        return { isValid: true, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
        return { isValid: false, error: errorMessage };
    }
}

/**
 * Prettifies JSON string with proper indentation
 * @param jsonString - JSON string to prettify
 * @returns Formatted JSON string or original if invalid
 */
export function prettifyJson(jsonString: string): string {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return jsonString;
    }
}

/**
 * Gets the type of a JSON value
 * @param value - Value to check
 * @returns The type as a string
 */
export function getJsonType(value: unknown): JsonValueType {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value as JsonValueType;
}

/**
 * Checks if a value is a leaf node (primitive value)
 * @param value - Value to check
 * @returns True if value is a leaf (not object or array)
 */
export function isLeafNode(value: unknown): boolean {
    const type = getJsonType(value);
    return type !== 'object' && type !== 'array';
}

/**
 * Builds a path string in bracket notation
 * @param parentPath - Path of the parent node
 * @param key - Current key or index
 * @param isArrayIndex - Whether this is an array index
 * @returns Full path string (e.g., "user.items[0]")
 */
export function buildPath(parentPath: string, key: string, isArrayIndex: boolean): string {
    if (!parentPath) return key;

    if (isArrayIndex) {
        return `${parentPath}[${key}]`;
    }

    // Check if key needs to be quoted (contains special characters)
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
        return `${parentPath}.${key}`;
    }

    // Use bracket notation for special characters
    return `${parentPath}["${key}"]`;
}

/**
 * Converts JSON to a tree structure
 * This is the core function that transforms JSON into our tree model
 * 
 * @param json - Parsed JSON object
 * @param key - Key name for this node
 * @param parentPath - Path of parent node
 * @param depth - Current depth in tree
 * @param isArrayElement - Whether this is an array element
 * @returns TreeNode structure
 */
export function jsonToTree(
    json: unknown,
    key: string = 'root',
    parentPath: string = '',
    depth: number = 0,
    isArrayElement: boolean = false
): TreeNode {
    const type = getJsonType(json);
    const path = parentPath ? buildPath(parentPath, key, isArrayElement) : key;

    const node: TreeNode = {
        key,
        value: json,
        type,
        path,
        depth,
        isExpanded: depth === 0, // Auto-expand root level
    };

    // Handle objects and arrays - create children
    if (type === 'object' && json !== null) {
        const obj = json as Record<string, unknown>;
        node.children = Object.entries(obj).map(([childKey, childValue]) => {
            const childNode = jsonToTree(childValue, childKey, path, depth + 1, false);
            childNode.parent = node;
            return childNode;
        });
    } else if (type === 'array') {
        const arr = json as unknown[];
        node.children = arr.map((item, index) => {
            const childNode = jsonToTree(item, String(index), path, depth + 1, true);
            childNode.parent = node;
            return childNode;
        });
    }

    return node;
}

/**
 * Formats a value for display (with length info for arrays/objects)
 * @param value - Value to format
 * @param type - Type of the value
 * @returns Formatted string for display
 */
export function formatValueDisplay(value: unknown, type: JsonValueType): string {
    if (type === 'array') {
        const length = (value as unknown[]).length;
        return `Array(${length})`;
    }

    if (type === 'object' && value !== null) {
        const length = Object.keys(value as object).length;
        return `Object(${length})`;
    }

    if (type === 'string') {
        return `"${value}"`;
    }

    if (type === 'null') {
        return 'null';
    }

    return String(value);
}

/**
 * Converts a value to JSON-safe string for copying
 * @param value - Value to convert
 * @returns JSON string
 */
export function toJsonString(value: unknown): string {
    return JSON.stringify(value);
}

/**
 * Searches for nodes matching a key name
 * @param node - Root node to search from
 * @param searchTerm - Term to search for (case-insensitive)
 * @returns Array of matching paths
 */
export function searchTreeByKey(node: TreeNode, searchTerm: string): string[] {
    const matches: string[] = [];
    const lowerSearch = searchTerm.toLowerCase();

    function traverse(currentNode: TreeNode) {
        // Check if key matches
        if (currentNode.key.toLowerCase().includes(lowerSearch)) {
            matches.push(currentNode.path);
        }

        // Recursively search children
        if (currentNode.children) {
            currentNode.children.forEach(traverse);
        }
    }

    traverse(node);
    return matches;
}

/**
 * Searches for nodes matching a value
 * @param node - Root node to search from
 * @param searchTerm - Term to search for (case-insensitive)
 * @returns Array of matching paths
 */
export function searchTreeByValue(node: TreeNode, searchTerm: string): string[] {
    const matches: string[] = [];
    const lowerSearch = searchTerm.toLowerCase();

    function traverse(currentNode: TreeNode) {
        // Only search in leaf nodes (primitive values)
        if (isLeafNode(currentNode.value)) {
            const valueStr = String(currentNode.value).toLowerCase();
            if (valueStr.includes(lowerSearch)) {
                matches.push(currentNode.path);
            }
        }

        // Recursively search children
        if (currentNode.children) {
            currentNode.children.forEach(traverse);
        }
    }

    traverse(node);
    return matches;
}

/**
 * Searches for nodes matching both key and value
 * @param node - Root node to search from
 * @param keyTerm - Term to search in keys
 * @param valueTerm - Term to search in values
 * @returns Array of matching paths (union of both searches)
 */
export function searchTree(node: TreeNode, keyTerm: string, valueTerm: string): string[] {
    const keyMatches = keyTerm ? searchTreeByKey(node, keyTerm) : [];
    const valueMatches = valueTerm ? searchTreeByValue(node, valueTerm) : [];

    // Combine and deduplicate matches
    const allMatches = [...new Set([...keyMatches, ...valueMatches])];
    return allMatches;
}

/**
 * Gets all parent paths for a given path
 * Used to expand tree to reveal a node
 * 
 * @param path - Path to get parents for
 * @returns Array of parent paths
 */
export function getParentPaths(path: string): string[] {
    const paths: string[] = [];
    const parts = path.split(/\.|\[/).filter(Boolean);

    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i].replace(/\]$/, '');

        if (i === 0) {
            currentPath = part;
        } else if (!isNaN(Number(part))) {
            currentPath += `[${part}]`;
        } else {
            currentPath += `.${part}`;
        }

        paths.push(currentPath);
    }

    return paths;
}
