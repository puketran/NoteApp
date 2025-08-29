import { Note, AppSettings } from '@/types';

const STORAGE_KEY = 'ue-notes.v1';
const SETTINGS_KEY = 'ue-notes-settings.v1';

// Create NoteSaved directory structure
const ensureNoteSavedDirectory = () => {
  try {
    // Check if we can use file system (this will work when we add electron or file system access)
    // For now, we'll use localStorage but with a clear separation
    const noteSavedData = localStorage.getItem('NoteSaved-notes');
    if (!noteSavedData) {
      localStorage.setItem('NoteSaved-notes', JSON.stringify([]));
    }
  } catch (error) {
    console.warn('Cannot create NoteSaved directory, using localStorage fallback');
  }
};

export const storage = {
  /**
   * Load notes from localStorage
   */
  loadNotes(): Note[] {
    try {
      ensureNoteSavedDirectory();
      const data = localStorage.getItem('NoteSaved-notes') || localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading notes from storage:', error);
      return [];
    }
  },

  /**
   * Save notes to localStorage
   */
  saveNotes(notes: Note[]): void {
    try {
      ensureNoteSavedDirectory();
      localStorage.setItem('NoteSaved-notes', JSON.stringify(notes));
      // Keep legacy key for backward compatibility
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to storage:', error);
    }
  },

  /**
   * Load settings from localStorage
   */
  loadSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        return {
          theme: 'system',
          sortBy: 'updated',
          viewMode: 'grid'
        };
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      return {
        theme: 'system',
        sortBy: 'updated',
        viewMode: 'grid'
      };
    }
  },

  /**
   * Save settings to localStorage
   */
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  },

  /**
   * Export notes as JSON
   */
  exportNotesToJson(notes: Note[]): string {
    return JSON.stringify(notes, null, 2);
  },

  /**
   * Import notes from JSON
   */
  importNotesFromJson(jsonString: string): Note[] {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid format: expected array of notes');
      }
      
      // Validate note structure
      return parsed.filter(note => 
        note && 
        typeof note.id === 'string' &&
        typeof note.title === 'string' &&
        typeof note.content === 'string' &&
        Array.isArray(note.hashtags) &&
        Array.isArray(note.keywords) &&
        Array.isArray(note.blueprintNodes) &&
        Array.isArray(note.images) &&
        typeof note.pinned === 'boolean' &&
        typeof note.updatedAt === 'number'
      );
    } catch (error) {
      console.error('Error importing notes from JSON:', error);
      throw new Error('Invalid JSON format');
    }
  },

  /**
   * Clear all data
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  }
};
