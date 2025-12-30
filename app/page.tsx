'use client';

import { useState, useEffect, useMemo } from 'react';
import JsonInput from '@/components/JsonInput';
import TreeViewer from '@/components/TreeViewer';
import PathPreview from '@/components/PathPreview';
import SearchBar from '@/components/SearchBar';
import { TreeNode } from '@/lib/types';
import { validateJson, jsonToTree, searchTree, getParentPaths } from '@/lib/jsonUtils';
import { getJsonFromUrl } from '@/lib/urlUtils';

export default function Home() {
  // State management
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  // Load JSON from URL on mount (for shareable links)
  useEffect(() => {
    const urlJson = getJsonFromUrl();
    if (urlJson) {
      setJsonInput(urlJson);
    }
  }, []);

  // Parse and validate JSON whenever input changes
  useEffect(() => {
    if (!jsonInput.trim()) {
      setJsonError(null);
      setRootNode(null);
      setSelectedNode(null);
      return;
    }

    const validation = validateJson(jsonInput);

    if (validation.isValid) {
      setJsonError(null);
      try {
        const parsed = JSON.parse(jsonInput);
        const tree = jsonToTree(parsed);
        setRootNode(tree);

        // Auto-expand first level
        if (tree.children) {
          const firstLevelPaths = tree.children.map(child => child.path);
          setExpandedPaths(new Set(firstLevelPaths));
        }
      } catch {
        setJsonError('Failed to build tree structure');
        setRootNode(null);
      }
    } else {
      setJsonError(validation.error);
      setRootNode(null);
    }
  }, [jsonInput]);

  // Handle search - auto-expand matching nodes
  useEffect(() => {
    if ((searchKey || searchValue) && rootNode) {
      const matches = searchTree(rootNode, searchKey, searchValue);

      // Expand all parent paths to reveal matches
      const pathsToExpand = new Set<string>();
      matches.forEach(matchPath => {
        const parents = getParentPaths(matchPath);
        parents.forEach(path => pathsToExpand.add(path));
        pathsToExpand.add(matchPath);
      });

      setExpandedPaths(pathsToExpand);
    }
  }, [searchKey, searchValue, rootNode]);

  // Get search match count
  const searchMatches = useMemo(() => {
    if ((!searchKey && !searchValue) || !rootNode) return [];
    return searchTree(rootNode, searchKey, searchValue);
  }, [searchKey, searchValue, rootNode]);

  // Handle node click
  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node);
  };

  // Handle expand/collapse toggle
  const handleToggleExpand = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      {/* Header */}
      <header className="bg-[var(--bg-panel)] border-b border-[var(--border-main)] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--text-bright)]">
            JSON Simplify
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Navigate and explore JSON with ease
          </p>
        </div>
      </header>

      {/* Search bar */}
      {rootNode && (
        <SearchBar
          searchKey={searchKey}
          searchValue={searchValue}
          onSearchKeyChange={setSearchKey}
          onSearchValueChange={setSearchValue}
          matchCount={searchMatches.length}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left panel - JSON Input */}
        <div className="w-1/3 min-w-[300px] max-w-[600px] flex flex-col panel overflow-hidden">
          <JsonInput
            value={jsonInput}
            onChange={setJsonInput}
            error={jsonError}
          />
        </div>

        {/* Right panel - Tree Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden panel">
          <TreeViewer
            rootNode={rootNode}
            onNodeClick={handleNodeClick}
            selectedPath={selectedNode?.path || null}
            searchKey={searchKey}
            searchValue={searchValue}
            expandedPaths={expandedPaths}
            onToggleExpand={handleToggleExpand}
          />
        </div>
      </div>

      {/* Bottom panel - Path Preview */}
      {selectedNode && (
        <div className="h-36 mx-4 mb-4 panel overflow-hidden">
          <PathPreview selectedNode={selectedNode} />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[var(--bg-panel)] border-t border-[var(--border-main)] px-6 py-2">
        <p className="text-xs text-[var(--text-muted)] text-center">
          Click values to copy paths • Drag to select and copy JSON values • Search by key or value
        </p>
      </footer>
    </div>
  );
}
