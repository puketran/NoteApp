import { create } from 'zustand';
import { Note, NotesStore, AppSettings } from '@/types';
import { storage } from '@/lib/storage';
import { searchNotes, generateId, extractHashtags } from '@/lib/search';
import { initializeSeedData } from '@/lib/seedData';

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  searchQuery: '',
  filteredNotes: [],
  isLoading: false,
  settings: {
    theme: 'system',
    sortBy: 'updated',
    viewMode: 'grid'
  },

  addNote: (noteData) => {
    const now = Date.now();
    const content = noteData.content || '';
    const extractedHashtags = extractHashtags(content);
    
    const note: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      hashtags: [...new Set([...noteData.hashtags, ...extractedHashtags])],
    };

    set((state) => {
      const newNotes = [note, ...state.notes];
      storage.saveNotes(newNotes);
      
      const filteredNotes = state.searchQuery 
        ? searchNotes(newNotes, state.searchQuery).map(result => result.note)
        : sortNotes(newNotes, state.settings.sortBy);
      
      return {
        notes: newNotes,
        filteredNotes
      };
    });
  },

  updateNote: (id, updates) => {
    set((state) => {
      const noteIndex = state.notes.findIndex(note => note.id === id);
      if (noteIndex === -1) return state;

      const existingNote = state.notes[noteIndex];
      const content = updates.content ?? existingNote.content;
      const extractedHashtags = extractHashtags(content);
      
      const updatedNote: Note = {
        ...existingNote,
        ...updates,
        id,
        updatedAt: Date.now(),
        hashtags: updates.hashtags 
          ? [...new Set([...updates.hashtags, ...extractedHashtags])]
          : [...new Set([...existingNote.hashtags, ...extractedHashtags])]
      };

      const newNotes = [...state.notes];
      newNotes[noteIndex] = updatedNote;
      
      storage.saveNotes(newNotes);
      
      const filteredNotes = state.searchQuery 
        ? searchNotes(newNotes, state.searchQuery).map(result => result.note)
        : sortNotes(newNotes, state.settings.sortBy);

      return {
        notes: newNotes,
        filteredNotes
      };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const newNotes = state.notes.filter(note => note.id !== id);
      storage.saveNotes(newNotes);
      
      const filteredNotes = state.searchQuery 
        ? searchNotes(newNotes, state.searchQuery).map(result => result.note)
        : sortNotes(newNotes, state.settings.sortBy);

      return {
        notes: newNotes,
        filteredNotes
      };
    });
  },

  togglePin: (id) => {
    const { updateNote } = get();
    const note = get().notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { pinned: !note.pinned });
    }
  },

  searchNotes: (query) => {
    set((state) => {
      const filteredNotes = query 
        ? searchNotes(state.notes, query).map(result => result.note)
        : sortNotes(state.notes, state.settings.sortBy);

      return {
        searchQuery: query,
        filteredNotes
      };
    });
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const settings = { ...state.settings, ...newSettings };
      storage.saveSettings(settings);
      
      const filteredNotes = state.searchQuery 
        ? searchNotes(state.notes, state.searchQuery).map(result => result.note)
        : sortNotes(state.notes, settings.sortBy);

      return {
        settings,
        filteredNotes
      };
    });
  },

  loadNotes: () => {
    set({ isLoading: true });
    
    try {
      // Initialize seed data if no notes exist
      initializeSeedData();
      
      const notes = storage.loadNotes();
      const settings = storage.loadSettings();
      const filteredNotes = sortNotes(notes, settings.sortBy);

      set({
        notes,
        settings,
        filteredNotes,
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading notes:', error);
      set({ isLoading: false });
    }
  },

  saveNotes: () => {
    const { notes } = get();
    storage.saveNotes(notes);
  },

  importNotes: (importedNotes) => {
    set((state) => {
      // Merge with existing notes, avoiding duplicates by ID
      const existingIds = new Set(state.notes.map(note => note.id));
      const newNotes = importedNotes.filter(note => !existingIds.has(note.id));
      const allNotes = [...state.notes, ...newNotes];
      
      storage.saveNotes(allNotes);
      
      const filteredNotes = state.searchQuery 
        ? searchNotes(allNotes, state.searchQuery).map(result => result.note)
        : sortNotes(allNotes, state.settings.sortBy);

      return {
        notes: allNotes,
        filteredNotes
      };
    });
  },

  exportNotes: () => {
    return get().notes;
  }
}));

function sortNotes(notes: Note[], sortBy: AppSettings['sortBy']): Note[] {
  const sorted = [...notes];
  
  // Always sort pinned notes first
  sorted.sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    
    switch (sortBy) {
      case 'created':
        return b.createdAt - a.createdAt;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'updated':
      default:
        return b.updatedAt - a.updatedAt;
    }
  });
  
  return sorted;
}
