export interface KeywordData {
  text: string;
  kd: number; // Keyword Difficulty (0-100)
  volume: number; // Monthly Search Volume
}

export interface StoredKeyword {
  text: string;
  kd: number;
  volume: number;
  usageCount: number;
  lastUsed: string; // ISO date string
}

export interface KeywordSuggestion {
  original: KeywordData;
  suggestion: KeywordData;
  reason: string;
}

export interface KeywordAnalysis {
  suggestedKeywords: KeywordSuggestion[];
}

export interface OptimizedArticle {
  refinedTitle: string;
  keywordAnalysis: KeywordAnalysis;
  refinedContentHtml: string;
  fetchedContentText: string;
}

export interface OptimizationResult {
  article: OptimizedArticle;
  coverImages: string[]; // Array of base64 encoded image strings
}