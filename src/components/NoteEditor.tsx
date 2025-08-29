import React, { useState, useRef, useEffect } from 'react';
import { Save, X, Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note, ImageAsset } from '@/types';
import { generateId, isValidImageFile, fileToDataUrl, getAllHashtags } from '@/lib/search';
import { useNotesStore } from '@/store/notesStore';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS = [
  'bg-slate-50 dark:bg-slate-800',
  'bg-amber-50 dark:bg-amber-900/30',
  'bg-blue-50 dark:bg-blue-900/30',
  'bg-green-50 dark:bg-green-900/30',
  'bg-purple-50 dark:bg-purple-900/30',
  'bg-pink-50 dark:bg-pink-900/30',
  'bg-gray-50 dark:bg-gray-800'
];

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [hashtags, setHashtags] = useState(note?.hashtags.join(' ') || '');
  const [keywords, setKeywords] = useState(note?.keywords.join(', ') || '');
  const [blueprintNodes, setBlueprintNodes] = useState(note?.blueprintNodes.join(', ') || '');
  const [definitions, setDefinitions] = useState(note?.definitions || '');
  const [color, setColor] = useState(note?.color || 'bg-white');
  const [images, setImages] = useState<ImageAsset[]>(note?.images || []);
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notes } = useNotesStore();
  const availableHashtags = getAllHashtags(notes);

  // Handle ESC key to close editor
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for the note');
      return;
    }

    const hashtagArray = hashtags
      .split(/\s+/)
      .filter(tag => tag.startsWith('#') && tag.length > 1)
      .map(tag => tag.trim());

    const keywordArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const nodeArray = blueprintNodes
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    onSave({
      title: title.trim(),
      content: content.trim(),
      hashtags: hashtagArray,
      keywords: keywordArray,
      blueprintNodes: nodeArray,
      definitions: definitions.trim() || undefined,
      images,
      color,
      pinned
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageAsset[] = [];
    
    for (let i = 0; i < files.length && i < 5; i++) {
      const file = files[i];
      if (isValidImageFile(file)) {
        try {
          const dataUrl = await fileToDataUrl(file);
          newImages.push({
            id: generateId(),
            dataUrl,
            alt: file.name,
            caption: ''
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const updateImageCaption = (imageId: string, caption: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, caption } : img
      )
    );
  };

  const addHashtag = (hashtag: string) => {
    const currentTags = hashtags.split(' ').filter(tag => tag.trim());
    if (!currentTags.includes(hashtag)) {
      setHashtags(currentTags.concat(hashtag).join(' '));
    }
    setShowHashtagSuggestions(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-6xl max-h-[95vh] overflow-hidden animate-scale-in glass-effect">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleSave} 
              className="flex items-center gap-2 btn-animated glow-effect transition-all duration-200 hover:scale-105"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="btn-animated transition-all duration-200 hover:scale-105"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Takes 2/3 of space */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  maxLength={120}
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here... 

You can paste large explanations from Unreal Engine documentation.
Use #hashtags for easy categorization.
Drag and drop images directly into the image section below."
                  rows={20}
                  className="min-h-[500px] resize-none"
                />
              </div>

              {/* Image Upload Area with Drag & Drop */}
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop images here, or click to select
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Add Images
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                </div>
                
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.dataUrl}
                          alt={image.alt || 'Note image'}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Input
                          value={image.caption || ''}
                          onChange={(e) => updateImageCaption(image.id, e.target.value)}
                          placeholder="Image caption..."
                          className="mt-2 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Sidebar - Takes 1/3 of space */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hashtags</label>
                <div className="space-y-2">
                  <Input
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#Blueprints #UE5 #Materials"
                    onFocus={() => setShowHashtagSuggestions(true)}
                  />
                  
                  {/* Hashtag Suggestions */}
                  {showHashtagSuggestions && availableHashtags.length > 0 && (
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2 bg-popover">
                      <p className="text-xs text-muted-foreground mb-2">Available hashtags:</p>
                      <div className="flex flex-wrap gap-1">
                        {availableHashtags.map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            onClick={() => addHashtag(tag)}
                            className="text-xs h-6"
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Keywords</label>
                <Textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="instanced static mesh, widget switcher, performance optimization"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Blueprint Nodes</label>
                <Textarea
                  value={blueprintNodes}
                  onChange={(e) => setBlueprintNodes(e.target.value)}
                  placeholder="Add Instance, ForEachLoop, Sequence, Branch"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Definition</label>
                <Textarea
                  value={definitions}
                  onChange={(e) => setDefinitions(e.target.value)}
                  placeholder="Short definition or explanation..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_OPTIONS.map((colorOption) => (
                    <button
                      key={colorOption}
                      className={`w-8 h-8 rounded border-2 ${colorOption} ${
                        color === colorOption ? 'border-primary' : 'border-gray-300'
                      }`}
                      onClick={() => setColor(colorOption)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="pinned" className="text-sm font-medium">
                  Pin this note
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
