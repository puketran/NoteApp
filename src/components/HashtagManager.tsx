import { useState } from 'react';
import { Edit, Trash2, Tag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotesStore } from '@/store/notesStore';
import { getAllHashtags } from '@/lib/search';

interface HashtagManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HashtagManager({ isOpen, onClose }: HashtagManagerProps) {
  const { notes, renameHashtag, removeHashtag, getNotesWithHashtag } = useNotesStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [deletingTag, setDeletingTag] = useState<string | null>(null);

  const allHashtags = getAllHashtags(notes);

  const handleRename = (oldTag: string) => {
    if (newTagName.trim() && newTagName !== oldTag) {
      const formattedNewTag = newTagName.startsWith('#') ? newTagName : `#${newTagName}`;
      renameHashtag(oldTag, formattedNewTag);
      setEditingTag(null);
      setNewTagName('');
    }
  };

  const handleDelete = (tag: string, deleteNotes: boolean) => {
    removeHashtag(tag, deleteNotes);
    setDeletingTag(null);
  };

  const startEdit = (tag: string) => {
    setEditingTag(tag);
    setNewTagName(tag.replace('#', ''));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden glass-effect">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Manage Hashtags
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-accent"
          >
            ✕
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] custom-scroll">
          {allHashtags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hashtags found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allHashtags.map((tag) => {
                const notesWithTag = getNotesWithHashtag(tag);
                
                return (
                  <div
                    key={tag}
                    className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover-lift transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                        {tag}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {notesWithTag.length} note{notesWithTag.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {editingTag === tag ? (
                        <div className="flex items-center space-x-2 animate-scale-in">
                          <Input
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="New tag name"
                            className="h-8 w-32"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(tag);
                              if (e.key === 'Escape') setEditingTag(null);
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRename(tag)}
                            className="h-8 px-2"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTag(null)}
                            className="h-8 px-2"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(tag)}
                            className="h-8 w-8 hover:text-blue-500"
                            title="Rename hashtag"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingTag(tag)}
                            className="h-8 w-8 hover:text-destructive"
                            title="Delete hashtag"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingTag && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-md glass-effect animate-bounce-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-semibold">Delete Hashtag</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">
                What would you like to do with the hashtag{' '}
                <span className="font-medium text-foreground">{deletingTag}</span>?
              </p>
              
              <div className="text-sm text-muted-foreground mb-6">
                This hashtag is used in {getNotesWithHashtag(deletingTag).length} note(s).
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(deletingTag, false)}
                  className="w-full justify-start"
                >
                  Remove hashtag only (keep notes)
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deletingTag, true)}
                  className="w-full justify-start"
                >
                  Delete hashtag and all its notes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setDeletingTag(null)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
