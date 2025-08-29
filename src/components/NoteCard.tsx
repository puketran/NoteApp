import React from 'react';
import { Pin, Edit, Trash2, Eye } from 'lucide-react';
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
  const { togglePin, deleteNote } = useNotesStore();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id);
    }
  };

  return (
    <div className={`${note.color} rounded-lg border p-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <h3 
          className="font-semibold text-lg line-clamp-2 cursor-pointer hover:text-primary"
          onClick={() => onView(note)}
        >
          {note.title || 'Untitled'}
        </h3>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePin(note.id)}
            className={`h-8 w-8 ${note.pinned ? 'text-amber-500' : 'text-muted-foreground'}`}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(note)}
            className="h-8 w-8"
            title="Edit note"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {note.content && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {note.content.replace(/#\w+/g, '').trim().substring(0, 150)}
          {note.content.length > 150 && '...'}
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
          {note.hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
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
              <span className="text-xs font-medium text-muted-foreground">Keywords:</span>
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
              <span className="text-xs font-medium text-muted-foreground">Nodes:</span>
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

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(note.updatedAt)}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(note)}
          className="h-6 px-2 text-xs"
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      </div>
    </div>
  );
}
