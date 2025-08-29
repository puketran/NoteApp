import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { NoteEditor } from '@/components/NoteEditor';
import { SettingsModal } from '@/components/SettingsModal';
import { useNotesStore } from '@/store/notesStore';
import { Note } from '@/types';

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [viewingNote, setViewingNote] = useState<Note | undefined>();
  
  const { loadNotes, addNote, updateNote } = useNotesStore();

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

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
          <Sidebar onOpenSettings={() => setShowSettings(true)} />
          
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
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
            <div className="whitespace-pre-wrap">{note.content}</div>
            
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
