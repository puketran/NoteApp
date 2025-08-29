import React from 'react';
import { Hash, BookOpen, Star, Calendar, Archive, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/notesStore';
import { getAllHashtags } from '@/lib/search';

interface SidebarProps {
  onOpenSettings: () => void;
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const { notes, searchNotes, searchQuery } = useNotesStore();
  const allHashtags = getAllHashtags(notes);
  const pinnedNotes = notes.filter(note => note.pinned);
  
  const handleHashtagClick = (hashtag: string) => {
    searchNotes(hashtag);
  };
  
  const handleQuickFilter = (filter: string) => {
    switch (filter) {
      case 'all':
        searchNotes('');
        break;
      case 'pinned':
        searchNotes('');
        // The store will handle filtering pinned notes
        break;
      case 'recent':
        searchNotes('');
        break;
    }
  };

  return (
    <div className="w-64 bg-background border-r h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          UE Notes
        </h2>
        
        {/* Quick Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Access</h3>
          <div className="space-y-1">
            <Button
              variant={!searchQuery ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleQuickFilter('all')}
              className="w-full justify-start"
            >
              <Archive className="h-4 w-4 mr-2" />
              All Notes ({notes.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickFilter('pinned')}
              className="w-full justify-start"
            >
              <Star className="h-4 w-4 mr-2" />
              Pinned ({pinnedNotes.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickFilter('recent')}
              className="w-full justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Recent
            </Button>
          </div>
        </div>

        {/* Popular Hashtags */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
          <div className="space-y-1">
            {allHashtags.slice(0, 10).map((hashtag) => {
              const count = notes.filter(note => note.hashtags.includes(hashtag)).length;
              const isActive = searchQuery === hashtag;
              
              return (
                <Button
                  key={hashtag}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleHashtagClick(hashtag)}
                  className="w-full justify-between text-left"
                >
                  <span className="flex items-center">
                    <Hash className="h-3 w-3 mr-2" />
                    {hashtag.replace('#', '')}
                  </span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Pinned Notes</h3>
            <div className="space-y-1">
              {pinnedNotes.slice(0, 5).map((note) => (
                <Button
                  key={note.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Navigate to note - you'll implement this
                    console.log('Navigate to note:', note.id);
                  }}
                  className="w-full justify-start text-left truncate"
                  title={note.title}
                >
                  <Star className="h-3 w-3 mr-2 text-amber-500" />
                  <span className="truncate">{note.title}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="w-full justify-start"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
