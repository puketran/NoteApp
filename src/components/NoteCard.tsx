import { Pin, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note } from '@/types';
import { formatDate } from '@/lib/search';
import { useNotesStore } from '@/store/notesStore';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onView: (note: Note) => void;
}

export function NoteCard({ note, onEdit, onView }: NoteCardProps) {
  const { togglePin, deleteNote, duplicateNote } = useNotesStore();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id);
    }
  };

  const handleDuplicate = () => {
    duplicateNote(note.id);
  };

  // Simple function to strip markdown for preview
  const stripMarkdown = (text: string): string => {
    return text
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '[Code Block]') // Replace code blocks
      .replace(/>\s+/g, '') // Remove blockquotes
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
      .replace(/^\s*[-+*]\s+/gm, '• ') // Convert list items to bullets
      .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists to bullets
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  return (
    <div 
      className={`${note.color} rounded-lg border p-4 shadow-sm note-card hover-lift animate-fade-in group cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={() => onView(note)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 
          className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-gray-100 transition-colors duration-200"
        >
          {note.title || 'Untitled'}
        </h3>
        
        <div 
          className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePin(note.id)}
            className={`h-8 w-8 btn-animated transition-all duration-200 hover:scale-110 ${note.pinned ? 'text-amber-500 glow-effect' : 'text-muted-foreground hover:text-amber-500'}`}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(note)}
            className="h-8 w-8 btn-animated transition-all duration-200 hover:scale-110 hover:text-blue-500"
            title="Edit note"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDuplicate}
            className="h-8 w-8 btn-animated transition-all duration-200 hover:scale-110 hover:text-green-500"
            title="Duplicate note"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 btn-animated transition-all duration-200 hover:scale-110 text-destructive hover:text-destructive"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {note.content && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
          {(() => {
            const cleanContent = stripMarkdown(note.content);
            const preview = cleanContent.substring(0, 150);
            return preview + (cleanContent.length > 150 ? '...' : '');
          })()}
        </p>
      )}

      {note.definitions && (
        <div className="mb-3">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Definition: {note.definitions}
          </p>
        </div>
      )}

      {note.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.hashtags.map((tag, index) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all duration-200 cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                const { searchNotes } = useNotesStore.getState();
                searchNotes(tag);
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {(note.keywords.length > 0 || note.blueprintNodes.length > 0) && (
        <div className="space-y-2 mb-3">
          {note.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Keywords:</span>
              {note.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
          
          {note.blueprintNodes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Nodes:</span>
              {note.blueprintNodes.map((node) => (
                <span
                  key={node}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs"
                >
                  {node}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {note.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {note.images.slice(0, 3).map((image) => (
            <img
              key={image.id}
              src={image.dataUrl}
              alt={image.alt || 'Note image'}
              className="w-16 h-16 object-cover rounded border"
            />
          ))}
          {note.images.length > 3 && (
            <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
              +{note.images.length - 3}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{formatDate(note.updatedAt)}</span>
        <span className="text-xs opacity-60">Click to view</span>
      </div>
    </div>
  );
}
