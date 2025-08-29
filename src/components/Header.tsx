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
    <header className="sticky top-0 z-50 w-full border-b glass-effect animate-slide-in relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-blue-400/20 rounded-full animate-float"></div>
        <div className="absolute top-2 right-8 w-2 h-2 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1 left-20 w-1 h-1 bg-pink-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container flex h-14 items-center relative z-10">
        <div className="mr-4 flex items-center space-x-3">
          {/* Decorative Logo/Icon */}
          <div className="relative group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse-glow flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <div className="w-4 h-4 rounded-sm bg-white/30 backdrop-blur-sm border border-white/40 shadow-inner transition-all duration-300 group-hover:bg-white/40"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-bounce-slow shadow-md transition-all duration-300 group-hover:scale-125"></div>
            
            {/* Tooltip on hover */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm border rounded px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              UE Learning Notes
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400/70 animate-float shadow-sm"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/50 animate-float shadow-sm" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-1 h-1 rounded-full bg-pink-400/70 animate-float shadow-sm" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes... (Ctrl+F for quick search)"
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
              className="btn-animated hover-lift transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSettings}
              title="Settings"
              className="btn-animated hover-lift transition-all duration-200"
            >
              <Settings className="h-4 w-4 transition-transform duration-200 hover:rotate-90" />
            </Button>
            
            <Button 
              onClick={onNewNote} 
              className="flex items-center gap-2 btn-animated glow-effect transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
