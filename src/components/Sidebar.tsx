import { Hash, BookOpen, Star, Calendar, Archive, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/notesStore';
import { getAllHashtags } from '@/lib/search';

interface SidebarProps {
  onOpenSettings: () => void;
  onOpenHashtagManager: () => void;
}

export function Sidebar({ onOpenSettings, onOpenHashtagManager }: SidebarProps) {
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
    <div className="w-64 bg-background border-r h-full overflow-y-auto custom-scroll animate-slide-in">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-shimmer">
          <BookOpen className="h-5 w-5 text-blue-500" />
          Notes
        </h2>
        
        {/* Quick Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Access</h3>
          <div className="space-y-1">
            <Button
              variant={!searchQuery ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleQuickFilter('all')}
              className="w-full justify-start btn-animated hover-lift transition-all duration-200"
            >
              <Archive className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              All Notes ({notes.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickFilter('pinned')}
              className="w-full justify-start btn-animated hover-lift transition-all duration-200 group"
            >
              <Star className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              Pinned ({pinnedNotes.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickFilter('recent')}
              className="w-full justify-start btn-animated hover-lift transition-all duration-200 group"
            >
              <Calendar className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              Recent
            </Button>
          </div>
        </div>

        {/* Popular Hashtags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHashtagManager}
              className="h-6 w-6 p-0 hover:text-primary"
              title="Manage hashtags"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
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
