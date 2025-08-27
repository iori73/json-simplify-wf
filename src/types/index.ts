export interface JsonNode {
  key: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  path: string;
  isExpanded?: boolean;
  children?: JsonNode[];
  parent?: JsonNode;
}

export interface SearchResult {
  path: string;
  key: string;
  value: any;
  node: JsonNode;
}

export interface ValidationError {
  path: string;
  message: string;
  line?: number;
  column?: number;
}

export interface FileStats {
  size: string;
  nodeCount: number;
  renderTime: number;
  searchMatches?: number;
}

export type ViewMode = 'tree' | 'text' | 'table';
export type ConvertFormat = 'csv' | 'yaml';
export type SaveFormat = 'json' | 'csv' | 'yaml';

export interface AppState {
  jsonData: any;
  parsedNodes: JsonNode[];
  searchQuery: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  viewMode: ViewMode;
  isDarkMode: boolean;
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt';
  isValidationPanelOpen: boolean;
  validationSchema: string;
  validationErrors: ValidationError[];
  fileStats: FileStats;
  selectedNode?: JsonNode;
}