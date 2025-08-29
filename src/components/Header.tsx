import React from 'react';
import { Search, Plus, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotesStore } from '@/store/notesStore';
import { useTheme } from '@/components/theme-provider';

interface HeaderProps {
  onNewNote: () => void;
  onOpenSettings: () => void;
}

export function Header({ onNewNote, onOpenSettings }: HeaderProps) {
  const { searchQuery, searchNotes } = useNotesStore();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <h1 className="text-xl font-bold">UE Learning Notes</h1>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes... (try #Blueprints or keywords)"
                value={searchQuery}
                onChange={(e) => searchNotes(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button onClick={onNewNote} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
