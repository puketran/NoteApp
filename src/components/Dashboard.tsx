import React, { useState } from 'react';
import { Grid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/NoteCard';
import { Note } from '@/types';
import { useNotesStore } from '@/store/notesStore';

interface DashboardProps {
  onEditNote: (note: Note) => void;
  onViewNote: (note: Note) => void;
}

export function Dashboard({ onEditNote, onViewNote }: DashboardProps) {
  const { filteredNotes, settings, updateSettings } = useNotesStore();
  const [showFilters, setShowFilters] = useState(false);

  const toggleViewMode = () => {
    updateSettings({ 
      viewMode: settings.viewMode === 'grid' ? 'list' : 'grid' 
    });
  };

  const changeSortBy = (sortBy: 'updated' | 'created' | 'title') => {
    updateSettings({ sortBy });
  };

  if (filteredNotes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">📝</div>
          <h2 className="text-xl font-semibold">No notes found</h2>
          <p className="text-muted-foreground max-w-md">
            Create your first Unreal Engine learning note or try searching with different keywords.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Try searching:</p>
            <ul className="space-y-1">
              <li><code className="bg-muted px-2 py-1 rounded">#Blueprints</code></li>
              <li><code className="bg-muted px-2 py-1 rounded">#Materials instanced static mesh</code></li>
              <li><code className="bg-muted px-2 py-1 rounded">#Niagara particles</code></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={settings.sortBy}
            onChange={(e) => changeSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded-md text-sm bg-background"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title A-Z</option>
          </select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleViewMode}
            title={`Switch to ${settings.viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {settings.viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 border-b bg-muted/50">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Quick filters:</span>
            {['#Blueprints', '#Materials', '#Niagara', '#UE5', '#Editor', '#C++'].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => {
                  const { searchNotes } = useNotesStore.getState();
                  searchNotes(tag);
                }}
                className="text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {settings.viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEditNote}
                onView={onViewNote}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="max-w-4xl">
                <NoteCard
                  note={note}
                  onEdit={onEditNote}
                  onView={onViewNote}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
