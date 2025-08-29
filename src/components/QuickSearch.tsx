import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNotesStore } from '@/store/notesStore';
import { Note } from '@/types';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: Note) => void;
}

export function QuickSearch({ isOpen, onClose, onSelectNote }: QuickSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { notes } = useNotesStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const searchText = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText) ||
      note.hashtags.some(tag => tag.toLowerCase().includes(searchText)) ||
      note.keywords.some(keyword => keyword.toLowerCase().includes(searchText)) ||
      note.blueprintNodes.some(node => node.toLowerCase().includes(searchText)) ||
      (note.definitions && note.definitions.toLowerCase().includes(searchText))
    );
  }).slice(0, 8); // Limit to 8 results for better UX

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Focus input after a short delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredNotes.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredNotes.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredNotes[selectedIndex]) {
            onSelectNote(filteredNotes[selectedIndex]);
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredNotes, selectedIndex, onClose, onSelectNote]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] p-4 animate-fade-in">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl overflow-hidden animate-scale-in glass-effect">
        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes... (use ↑↓ to navigate, Enter to select, Esc to close)"
              className="pl-10"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotes.length > 0 ? (
            <div className="py-2">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-l-4 ${
                    index === selectedIndex
                      ? 'bg-accent border-primary text-accent-foreground'
                      : 'border-transparent hover:bg-accent'
                  }`}
                  onClick={() => {
                    onSelectNote(note);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {note.content.substring(0, 100)}
                        {note.content.length > 100 && '...'}
                      </p>
                      {note.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.hashtags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.hashtags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{note.hashtags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ml-2 ${note.color}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notes found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for hashtags, keywords, or content</p>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Start typing to search your notes</p>
              <div className="text-xs mt-2 space-y-1">
                <p>• Search by title, content, or hashtags</p>
                <p>• Use ↑↓ arrows to navigate</p>
                <p>• Press Enter to select, Esc to close</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with shortcuts */}
        {filteredNotes.length > 0 && (
          <div className="px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
            <span>{filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''}</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs">↑↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs">Enter</kbd>
                <span>select</span>
              </span>
              <span className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs">Esc</kbd>
                <span>close</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
