# Unreal Engine Learning Notes

A modern, responsive web application for capturing and organizing Unreal Engine learning notes. Built with React 18, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality

- **Create, Read, Update, Delete** notes with rich metadata
- **Powerful Search** with hashtag filtering and keyword matching
- **Image Support** - paste or drag-drop images with captions
- **Tagging System** - automatic hashtag extraction from content
- **Blueprint Integration** - dedicated fields for UE-specific content
- **Pin/Unpin** important notes
- **Color Coding** for visual organization

### 🔍 Advanced Search

- **Hashtag Search**: `#Blueprints`, `#Materials`, `#Niagara`
- **Keyword Search**: Search across title, content, definitions, and metadata
- **Combined Queries**: `#Blueprints instanced static mesh`
- **Real-time Filtering** with instant results

### 📱 User Experience

- **Responsive Design** - works on desktop, tablet, and mobile
- **Dark/Light Mode** with system preference detection
- **Keyboard Shortcuts** for power users
- **Grid/List View** toggle
- **Offline-First** - works without internet connection

### 🎨 Unreal Engine Specific

- **Blueprint Nodes** tracking
- **Definitions** field for quick reference
- **Keywords** for technical terms
- **Image Gallery** for blueprint screenshots
- **Color-coded Categories**

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Storage**: localStorage (with cloud sync hooks)
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library (planned)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd unreal-engine-notes
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests (when implemented)
npm run test:e2e     # Run E2E tests (when implemented)
```

## Usage

### Creating Your First Note

1. Click the **"New Note"** button in the header
2. Add a descriptive title
3. Write your content (use `#hashtags` for easy searching)
4. Add relevant keywords and Blueprint nodes
5. Upload screenshots if needed
6. Save your note

### Search Tips

- **Basic search**: Just type keywords
- **Hashtag filtering**: `#Blueprints` `#Materials` `#UE5`
- **Combined search**: `#Niagara particles explosion`
- **Quoted phrases**: `"instanced static mesh"`

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick search
- `N` - New note
- `/` - Focus search bar
- `Ctrl/Cmd + S` - Save current note (in editor)

## Data Storage

### Current Implementation (MVP)

- **localStorage**: All data stored locally in browser
- **JSON Export/Import**: Manual backup and restore
- **Image Storage**: Base64 data URLs (suitable for screenshots)

### Migration Path (Future)

The application is designed with cloud sync in mind:

```typescript
// Current storage interface
interface Storage {
  loadNotes(): Note[];
  saveNotes(notes: Note[]): void;
  // Future cloud methods
  syncWithCloud?(): Promise<void>;
  resolveConflicts?(): Promise<Note[]>;
}
```

Future enhancements:

- **Supabase/Firebase** integration for cloud sync
- **IndexedDB** for larger image storage
- **Conflict Resolution** for multi-device usage
- **Real-time Collaboration** (advanced feature)

## Architecture Decisions

### Why Zustand over Redux?

- **Lightweight**: ~2KB vs 50KB+ for Redux toolkit
- **Simple API**: Less boilerplate code
- **TypeScript-first**: Excellent type inference
- **Performance**: Minimal re-renders

### Why localStorage over IndexedDB?

- **Simplicity**: Easier to implement and debug
- **Sufficient for MVP**: Most notes are text-based
- **Easy Migration**: Simple to upgrade to IndexedDB later
- **Universal Support**: Works in all browsers

### Why Tailwind CSS?

- **Rapid Development**: Utility-first approach
- **Consistent Design**: Built-in design system
- **Bundle Size**: Only includes used classes
- **Dark Mode**: Built-in dark mode support

## Sample Data

The application includes seed data covering common Unreal Engine topics:

- **Instanced Static Mesh Components** (#Blueprints #Performance)
- **Widget Switcher Basics** (#UI #Blueprints)
- **Material Parameter Collections** (#Materials)
- **Niagara Spawn Burst** (#Niagara #VFX)
- **Essential Editor Shortcuts** (#Editor #Workflow)
- **C++ Actor Component Basics** (#C++ #Programming)

## Performance Considerations

### Bundle Size Targets

- **Total Bundle**: <300KB gzipped
- **Initial Load**: <2s on mid-range devices
- **Lighthouse Score**: >90 across all metrics

### Optimizations

- **Code Splitting**: Vendor chunks separated
- **Tree Shaking**: Unused code eliminated
- **Image Optimization**: WebP format when possible
- **Lazy Loading**: Routes and heavy components

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Storage**: localStorage (required)
- **JavaScript**: ES2020 features

## Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Husky**: Pre-commit hooks for quality

### Testing Strategy (Planned)

```bash
# Unit Tests
npm test -- src/lib/search.test.ts

# Integration Tests
npm test -- src/components/Dashboard.test.tsx

# E2E Tests
npm run test:e2e -- tests/note-creation.spec.ts
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Self-Hosted

```bash
npm run build
# Serve dist/ folder with any static server
```

## Roadmap

### Phase 1 (MVP) ✅

- [x] Core CRUD operations
- [x] Search and filtering
- [x] Image support
- [x] Data export/import
- [x] Responsive design
- [x] Dark mode

### Phase 2 (Enhanced)

- [ ] Cloud synchronization
- [ ] Offline-first PWA
- [ ] Advanced search filters
- [ ] Note templates
- [ ] Bulk operations

### Phase 3 (Advanced)

- [ ] Real-time collaboration
- [ ] Version history
- [ ] Plugin system
- [ ] API for external tools
- [ ] Mobile app

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [Contact information]

---

**Happy Learning with Unreal Engine! 🚀**
