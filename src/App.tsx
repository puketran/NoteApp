import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { NoteEditor } from '@/components/NoteEditor';
import { SettingsModal } from '@/components/SettingsModal';
import { HashtagManager } from '@/components/HashtagManager';
import { QuickSearch } from '@/components/QuickSearch';
import { useNotesStore } from '@/store/notesStore';
import { Note } from '@/types';

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHashtagManager, setShowHashtagManager] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [viewingNote, setViewingNote] = useState<Note | undefined>();
  
  const { loadNotes, addNote, updateNote } = useNotesStore();

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+F or Cmd+F for quick search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        setShowQuickSearch(true);
      }
      
      // Ctrl+N or Cmd+N for new note
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        handleNewNote();
      }
      
      // Ctrl+, or Cmd+, for settings
      if ((event.ctrlKey || event.metaKey) && event.key === ',') {
        event.preventDefault();
        setShowSettings(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNewNote = () => {
    setEditingNote(undefined);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
    }
    setShowEditor(false);
    setEditingNote(undefined);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingNote(undefined);
  };

  const handleCloseView = () => {
    setViewingNote(undefined);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ue-notes-theme">
      <Router>
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <Sidebar 
            onOpenSettings={() => setShowSettings(true)}
            onOpenHashtagManager={() => setShowHashtagManager(true)}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              onNewNote={handleNewNote}
              onOpenSettings={() => setShowSettings(true)}
            />
            
            <Dashboard 
              onEditNote={handleEditNote}
              onViewNote={handleViewNote}
            />
          </div>

          {/* Modals */}
          {showEditor && (
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
            />
          )}

          {viewingNote && (
            <NoteViewer
              note={viewingNote}
              onClose={handleCloseView}
              onEdit={() => {
                handleCloseView();
                handleEditNote(viewingNote);
              }}
            />
          )}

          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />

          <HashtagManager
            isOpen={showHashtagManager}
            onClose={() => setShowHashtagManager(false)}
          />

          <QuickSearch
            isOpen={showQuickSearch}
            onClose={() => setShowQuickSearch(false)}
            onSelectNote={handleViewNote}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Simple Note Viewer Component
function NoteViewer({ note, onClose, onEdit }: {
  note: Note;
  onClose: () => void;
  onEdit: () => void;
}) {
  // Handle ESC key to close note
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in glass-effect">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{note.title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm border rounded hover:bg-accent"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom component styling for better integration
                h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold mb-2 text-foreground">{children}</h3>,
                p: ({children}) => <p className="mb-3 text-foreground leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-6 mb-3 text-foreground">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 mb-3 text-foreground">{children}</ol>,
                li: ({children}) => <li className="mb-1">{children}</li>,
                code: ({children, className}) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
                  ) : (
                    <code className={`block bg-muted p-3 rounded font-mono text-sm overflow-x-auto text-foreground ${className}`}>
                      {children}
                    </code>
                  );
                },
                pre: ({children}) => <pre className="bg-muted p-3 rounded overflow-x-auto mb-3">{children}</pre>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-3">
                    {children}
                  </blockquote>
                ),
                table: ({children}) => (
                  <table className="border-collapse border border-border w-full mb-3">{children}</table>
                ),
                th: ({children}) => (
                  <th className="border border-border px-3 py-2 bg-muted font-semibold text-left">{children}</th>
                ),
                td: ({children}) => (
                  <td className="border border-border px-3 py-2">{children}</td>
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
            
            {note.definitions && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <strong>Definition:</strong> {note.definitions}
              </div>
            )}
            
            {note.hashtags.length > 0 && (
              <div className="mt-4">
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {note.hashtags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {note.images.length > 0 && (
              <div className="mt-4">
                <strong>Images:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {note.images.map(image => (
                    <div key={image.id}>
                      <img src={image.dataUrl} alt={image.alt} className="rounded border" />
                      {image.caption && <p className="text-xs text-muted-foreground mt-1">{image.caption}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
