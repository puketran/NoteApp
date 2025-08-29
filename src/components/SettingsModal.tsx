import React, { useRef } from 'react';
import { Download, Upload, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/notesStore';
import { storage } from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { notes, importNotes, updateSettings, settings } = useNotesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = storage.exportNotesToJson(notes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ue-learning-notes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedNotes = storage.importNotesFromJson(text);
      importNotes(importedNotes);
      alert(`Successfully imported ${importedNotes.length} notes!`);
    } catch (error) {
      alert('Error importing notes: ' + (error as Error).message);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL notes? This cannot be undone.')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {['light', 'dark', 'system'].map((theme) => (
                <Button
                  key={theme}
                  variant={settings.theme === theme ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange(theme as any)}
                  className="capitalize"
                >
                  {theme}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Data Management</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Notes
              </Button>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Notes
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Storage Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Total notes: {notes.length}</p>
              <p>Storage: localStorage (local only)</p>
              <p>Images: Stored as base64 data URLs</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will permanently delete all notes and settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
