import { Note, SearchResult, SearchOptions } from '@/types';

/**
 * Extract hashtags from text using regex
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /(^|\s)#([A-Za-z0-9_\-]+)/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) return [];
  
  return [...new Set(matches.map(match => match.trim()))];
}

/**
 * Normalize hashtag by ensuring it starts with #
 */
export function normalizeHashtag(tag: string): string {
  return tag.startsWith('#') ? tag : `#${tag}`;
}

/**
 * Parse search query into hashtags and terms
 */
export function parseSearchQuery(query: string): SearchOptions {
  const tokens = query.trim().split(/\s+/);
  const hashtags: string[] = [];
  const terms: string[] = [];
  
  tokens.forEach(token => {
    if (token.startsWith('#')) {
      hashtags.push(normalizeHashtag(token));
    } else {
      terms.push(token.toLowerCase());
    }
  });
  
  return {
    hashtags,
    terms,
    exact: query.includes('"')
  };
}

/**
 * Tokenize text for search indexing
 */
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s#]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

/**
 * Calculate search score for a note based on query
 */
export function calculateSearchScore(note: Note, options: SearchOptions): { score: number; matchedFields: string[] } {
  let score = 0;
  const matchedFields: string[] = [];
  
  // If no search terms, return all notes with basic score
  if (options.hashtags.length === 0 && options.terms.length === 0) {
    return { score: 1, matchedFields: ['all'] };
  }
  
  // Exact hashtag matches get highest score
  if (options.hashtags.length > 0) {
    const hashtagMatches = options.hashtags.filter(tag => 
      note.hashtags.includes(tag)
    );
    if (hashtagMatches.length === 0) {
      return { score: 0, matchedFields: [] }; // Filter out if hashtags don't match
    }
    score += hashtagMatches.length * 10;
    matchedFields.push('hashtags');
  }
  
  // Search in different fields with different weights
  const searchFields = [
    { field: 'title', content: note.title, weight: 8 },
    { field: 'keywords', content: note.keywords.join(' '), weight: 6 },
    { field: 'blueprintNodes', content: note.blueprintNodes.join(' '), weight: 6 },
    { field: 'definitions', content: note.definitions || '', weight: 4 },
    { field: 'content', content: note.content, weight: 2 }
  ];
  
  // If we have search terms, score based on matches
  if (options.terms.length > 0) {
    let hasAnyMatch = false;
    options.terms.forEach(term => {
      searchFields.forEach(({ field, content, weight }) => {
        if (content.toLowerCase().includes(term)) {
          score += weight;
          hasAnyMatch = true;
          if (!matchedFields.includes(field)) {
            matchedFields.push(field);
          }
        }
      });
    });
    
    // If we have terms but no matches and no hashtag matches, score is 0
    if (!hasAnyMatch && options.hashtags.length === 0) {
      return { score: 0, matchedFields: [] };
    }
  }
  
  // If only hashtags were searched and matched, ensure we have a score
  if (options.terms.length === 0 && options.hashtags.length > 0 && score > 0) {
    // Already scored above for hashtag matches
  }
  
  // Boost pinned notes slightly
  if (note.pinned) {
    score += 1;
  }
  
  return { score, matchedFields };
}

/**
 * Search notes with scoring and ranking
 */
export function searchNotes(notes: Note[], query: string): SearchResult[] {
  if (!query.trim()) {
    return notes.map(note => ({ note, score: 1, matchedFields: ['all'] }));
  }
  
  const options = parseSearchQuery(query);
  const results: SearchResult[] = [];
  
  notes.forEach(note => {
    const { score, matchedFields } = calculateSearchScore(note, options);
    if (score > 0) {
      results.push({ note, score, matchedFields });
    }
  });
  
  // Sort by score (descending), then by pinned status, then by updatedAt
  return results.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.note.pinned !== b.note.pinned) return a.note.pinned ? -1 : 1;
    return b.note.updatedAt - a.note.updatedAt;
  });
}

/**
 * Get all unique hashtags from notes
 */
export function getAllHashtags(notes: Note[]): string[] {
  const tagSet = new Set<string>();
  notes.forEach(note => {
    note.hashtags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Validate image file
 */
export function isValidImageFile(file: File): boolean {
  return file.type.startsWith('image/') && file.size < 10 * 1024 * 1024; // 10MB limit
}

/**
 * Convert file to data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
