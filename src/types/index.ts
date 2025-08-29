export interface ImageAsset {
  id: string;
  dataUrl: string; // MVP: base64 data URL; later: file store/URL
  alt?: string;
  caption?: string;
}

export interface Note {
  id: string;
  title: string; // 1–120 chars
  content: string; // freeform text (can include #tags inline)
  hashtags: string[]; // normalized, e.g., ["#Blueprints", "#UE5"]
  keywords: string[]; // ["instanced static mesh", "widget switcher"]
  blueprintNodes: string[]; // ["Add Instance", "Sequence", "ForEachLoop"]
  definitions?: string; // short glossary-style definition
  images: ImageAsset[]; // pasted/dragged images
  color: string; // Tailwind token, e.g., "bg-amber-50"
  pinned: boolean;
  updatedAt: number;
  createdAt: number;
}

export interface SearchResult {
  note: Note;
  score: number;
  matchedFields: string[];
}

export interface SearchOptions {
  hashtags: string[];
  terms: string[];
  exact: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sortBy: 'updated' | 'created' | 'title';
  viewMode: 'grid' | 'list';
}

export interface NotesStore {
  notes: Note[];
  searchQuery: string;
  filteredNotes: Note[];
  isLoading: boolean;
  settings: AppSettings;
  
  // Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  togglePin: (id: string) => void;
  renameHashtag: (oldTag: string, newTag: string) => void;
  removeHashtag: (tagToRemove: string, deleteNotes?: boolean) => void;
  getNotesWithHashtag: (hashtag: string) => Note[];
  searchNotes: (query: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadNotes: () => void;
  saveNotes: () => void;
  importNotes: (notes: Note[]) => void;
  exportNotes: () => Note[];
}
