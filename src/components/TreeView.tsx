'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ChevronRight, ChevronDown, Copy, Hash } from 'lucide-react';
import { JsonNode } from '@/types';

interface TreeViewProps {
  data: any;
  searchQuery: string;
  searchResults: any[];
  onNodeSelect: (node: JsonNode) => void;
  onCopyValue: (value: any) => void;
  onCopyPath: (path: string) => void;
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt';
}

interface TreeItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    nodes: (JsonNode & { depth?: number })[];
    searchQuery: string;
    onNodeSelect: (node: JsonNode) => void;
    onCopyValue: (value: any) => void;
    onCopyPath: (path: string) => void;
    onToggleExpand: (path: string) => void;
  };
}

function createJsonNodes(
  obj: any,
  key: string = 'root',
  path: string = '$',
  parent?: JsonNode,
): (JsonNode & { depth: number })[] {
  const nodes: JsonNode[] = [];

  const getType = (value: any): JsonNode['type'] => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'string';
  };

  const createNode = (value: any, nodeKey: string, nodePath: string, nodeParent?: JsonNode): JsonNode => {
    const type = getType(value);
    const node: JsonNode = {
      key: nodeKey,
      value: value,
      type,
      path: nodePath,
      isExpanded: false,
      parent: nodeParent,
    };

    if (type === 'object' || type === 'array') {
      const children: JsonNode[] = [];

      if (type === 'array') {
        value.forEach((item: any, index: number) => {
          const childPath = `${nodePath}[${index}]`;
          children.push(createNode(item, `[${index}]`, childPath, node));
        });
      } else if (type === 'object') {
        Object.keys(value).forEach((objKey) => {
          const childPath = nodePath === '$' ? `$.${objKey}` : `${nodePath}.${objKey}`;
          children.push(createNode(value[objKey], objKey, childPath, node));
        });
      }

      node.children = children;
    }

    return node;
  };

  const rootNode = createNode(obj, key, path, parent);

  const flattenNodes = (node: JsonNode, depth: number = 0): (JsonNode & { depth: number })[] => {
    const result = [{ ...node, depth }];

    if (node.isExpanded && node.children) {
      node.children.forEach((child) => {
        result.push(...flattenNodes(child, depth + 1));
      });
    }

    return result;
  };

  return flattenNodes(rootNode);
}

function TreeItem({ index, style, data }: TreeItemProps) {
  const { nodes, searchQuery, onNodeSelect, onCopyValue, onCopyPath, onToggleExpand } = data;
  const node = nodes[index];
  const [isHovered, setIsHovered] = useState(false);

  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = node.type === 'object' || node.type === 'array';
  const depth = (node as any).depth || 0;
  const indentation = depth * 20;

  const getValueDisplay = (value: any, type: JsonNode['type']) => {
    switch (type) {
      case 'string':
        return `"${value}"`;
      case 'null':
        return 'null';
      case 'boolean':
        return value.toString();
      case 'number':
        return value.toString();
      case 'array':
        return `[${value?.length || 0}]`;
      case 'object':
        return `{${Object.keys(value || {}).length}}`;
      default:
        return String(value);
    }
  };

  const getTypeColor = (type: JsonNode['type']) => {
    switch (type) {
      case 'string':
        return 'text-green-600 dark:text-green-400';
      case 'number':
        return 'text-blue-600 dark:text-blue-400';
      case 'boolean':
        return 'text-purple-600 dark:text-purple-400';
      case 'null':
        return 'text-gray-500 dark:text-gray-400';
      case 'array':
      case 'object':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-foreground';
    }
  };

  const highlightSearch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="search-highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div
      style={style}
      className={`json-tree-node flex items-center px-4 py-1 text-sm font-mono cursor-pointer select-none ${
        isHovered ? 'bg-accent' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onNodeSelect(node)}
    >
      <div style={{ marginLeft: indentation }} className="flex items-center flex-1 min-w-0">
        <div className="flex items-center space-x-1 flex-shrink-0">
          {isExpandable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.path);
              }}
              className="p-0.5 hover:bg-accent rounded"
            >
              {node.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <span className="text-muted-foreground">{highlightSearch(node.key, searchQuery)}</span>

          {!isExpandable && (
            <>
              <span className="text-muted-foreground">:</span>
              <span className={getTypeColor(node.type)}>
                {highlightSearch(getValueDisplay(node.value, node.type), searchQuery)}
              </span>
            </>
          )}

          {isExpandable && (
            <span className="text-muted-foreground">
              {node.type === 'array' ? `[${node.children?.length || 0}]` : `{${node.children?.length || 0}}`}
            </span>
          )}
        </div>
      </div>

      {isHovered && (
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyValue(node.value);
            }}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            title="Copy Value"
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyPath(node.path);
            }}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            title="Copy Path"
          >
            <Hash className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function TreeView({
  data,
  searchQuery,
  searchResults,
  onNodeSelect,
  onCopyValue,
  onCopyPath,
  language,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['$']));
  const [listHeight, setListHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic height based on available viewport space
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const footerHeight = 80; // Fixed footer height (padding + content)
        const availableHeight = viewportHeight - rect.top - footerHeight;
        setListHeight(Math.max(200, availableHeight)); // Minimum height of 200px
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const nodes = useMemo(() => {
    if (!data) return [];

    const createNodes = (
      obj: any,
      key: string = 'root',
      path: string = '$',
      depth: number = 0,
    ): (JsonNode & { depth: number })[] => {
      const result: (JsonNode & { depth: number })[] = [];

      const getType = (value: any): JsonNode['type'] => {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') return 'object';
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        return 'string';
      };

      const type = getType(obj);
      const isExpanded = expandedNodes.has(path);

      const node: JsonNode & { depth: number } = {
        key,
        value: obj,
        type,
        path,
        isExpanded,
        depth,
      };

      result.push(node);

      if (isExpanded && (type === 'object' || type === 'array')) {
        if (type === 'array') {
          obj.forEach((item: any, index: number) => {
            const childPath = `${path}[${index}]`;
            result.push(...createNodes(item, `[${index}]`, childPath, depth + 1));
          });
        } else if (type === 'object') {
          Object.keys(obj).forEach((objKey) => {
            const childPath = path === '$' ? `$.${objKey}` : `${path}.${objKey}`;
            result.push(...createNodes(obj[objKey], objKey, childPath, depth + 1));
          });
        }
      }

      return result;
    };

    return createNodes(data);
  }, [data, expandedNodes]);

  const handleToggleExpand = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const handleExpandAll = () => {
    const allPaths = new Set<string>();

    const collectPaths = (obj: any, path: string = '$') => {
      allPaths.add(path);

      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const childPath = `${path}[${index}]`;
          collectPaths(item, childPath);
        });
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          const childPath = path === '$' ? `$.${key}` : `${path}.${key}`;
          collectPaths(obj[key], childPath);
        });
      }
    };

    collectPaths(data);
    setExpandedNodes(allPaths);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set(['$']));
  };

  if (!data) {
    return null;
  }

  const itemData = {
    nodes,
    searchQuery,
    onNodeSelect,
    onCopyValue,
    onCopyPath,
    onToggleExpand: handleToggleExpand,
  };

  return (
    <div className="flex-1 flex flex-col relative" style={{ zIndex: 1 }}>
      <div ref={containerRef} className="flex-1 min-h-0 pb-20">
        <List
          height={listHeight}
          width="100%"
          itemCount={nodes.length}
          itemSize={28}
          itemData={itemData}
          overscanCount={50}
          style={{ zIndex: 1 }}
        >
          {TreeItem}
        </List>
      </div>

      {/* Fixed Bottom Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 z-30">
        <div className="flex items-center justify-between flex-col sm:flex-row space-y-2 sm:space-y-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleExpandAll}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <span>{language === 'en' ? 'Expand All' : 'すべて展開'}</span>
            </button>
            <button
              onClick={handleCollapseAll}
              className="inline-flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              <span>{language === 'en' ? 'Collapse All' : 'すべて折りたたむ'}</span>
            </button>
          </div>

          <div className="status-bar">
            <span>
              {language === 'en' ? 'Nodes' : 'ノード'}: {nodes.length}
              {searchQuery && searchResults.length > 0 && (
                <>
                  {' '}
                  • {language === 'en' ? 'Matches' : 'マッチ'}: {searchResults.length}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
