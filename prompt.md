# Prompt: Build a Web Note App for Unreal Engine Learning

**You are an expert full-stack architect and senior frontend engineer.**
Design and scaffold a production-ready **Unreal Engine Learning Notes** web application.

## 1) Summary

- **Purpose:** Help users capture and retrieve Unreal Engine learning notes: short keywords, blueprint elements, definitions, code snippets, and images (e.g., blueprint screenshots).
- **Users:** Individual learners (no collaboration in MVP).
- **Success criteria:** Quick capture, powerful hashtag/keyword search, frictionless image handling, low latency.

## 2) Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **UI:** Tailwind CSS + **shadcn/ui** (Radix primitives)
- **State:** Zustand (lightweight), React Query optional (if API added later)
- **Storage (MVP):** localStorage (notes, index, settings). Plan seam for future cloud sync.
- **Testing:** Vitest + @testing-library/react, Playwright (basic e2e)
- **Tooling:** ESLint, Prettier, Husky (pre-commit), commitlint

## 3) Core Features (MVP)

- Create/read/update/delete notes
- **Search:**

  - Hashtag search (e.g., `#Blueprints`, `#Materials`, `#UE5`, `#Niagara`)
  - Keyword search across title, content, definitions, and extracted “keywords” field
  - Combined queries (e.g., `#Blueprints instanced static mesh`)

- Tagging with inline **hashtag extraction** (auto-detect `#tags` in text) + tag chips
- **Blueprint-friendly content:** store **definitions**, **blueprint node names**, optional **C++ snippets**
- **Images:** paste/drag-drop image(s) into a note (store as data URL for MVP), inline preview, caption
- Color coding, pin/unpin, sort by updated/pinned
- Keyboard shortcuts: `n` new, `/` search, `Cmd/Ctrl+S` save, `Cmd/Ctrl+K` quick add
- Responsive layout + dark mode (system + toggle)

## 4) Information Architecture

- **Routes**

  - `/` Dashboard (search, filters, note grid/list)
  - `/note/:id` Editor (rich text basics, image gallery, blueprint fields)
  - `/settings` (theme, export/import JSON backup)

- **Components** (shadcn/ui where sensible)

  - Header, Sidebar, SearchBar (command palette optional)
  - NoteCard, NoteEditor (title, content, hashtags, keywords, images)
  - TagChip, PinToggle, ColorPicker, ImageThumb, ConfirmDialog, Toast

## 5) Data Model (TypeScript)

```ts
type ImageAsset = {
  id: string;
  dataUrl: string; // MVP: base64 data URL; later: file store/URL
  alt?: string;
  caption?: string;
};

type Note = {
  id: string;
  title: string; // 1–120 chars
  content: string; // freeform text (can include #tags inline)
  hashtags: string[]; // normalized, e.g., ["#Blueprints", "#UE5"]
  keywords: string[]; // ["instanced static mesh", "widget switcher"]
  blueprintNodes: string[]; // ["Add Instance", "Sequence", "ForEachLoop"]
  definitions?: string; // short glossary-style definition
  images: ImageAsset[]; // pasted/dragged images
  color: string; // Tailwind token, e.g., "bg-amber-50"
  pinned: boolean;
  updatedAt: number;
};
```

- **Storage key:** `ue-notes.v1`
- **Sort:** pinned first, then `updatedAt` desc

## 6) Search & Indexing (MVP)

- **Parsing:** Extract hashtags via regex `/(^|\\s)#([A-Za-z0-9_\\-]+)/g` and store in `hashtags` (normalized with leading `#`).
- **Index:** Simple in-memory index built on load & on note change:

  - Tokenize `title`, `content`, `definitions`, `keywords[]`, `blueprintNodes[]`.
  - Exact match boost for **hashtags**; partial match for keywords; phrase search for quoted terms.

- **Query behavior:**

  - Split user query into: `hashtags[]` (tokens starting with `#`) and `terms[]` (other tokens/phrases).
  - Score: hashtag hits > title > keywords/blueprintNodes > content/definitions.
  - Filter by hashtags if any provided.

- (Optional later) Replace with Lunr/FlexSearch while preserving the API.

## 7) UX Details

- Hashtag autocompletion when typing `#` in editor (suggest existing tags).
- Paste/drag image: create `ImageAsset`, show thumb grid; allow caption + alt text.
- Quick-add modal (`Cmd/Ctrl+K`): title, hashtags, keywords, blueprint nodes.
- Empty states with example queries (e.g., `Try: #Blueprints “instanced static mesh”`).
- Accessibility: focus rings, aria labels, proper roles, keyboard navigation via roving tabIndex.

## 8) Non-Functional

- Performance: bundle ≤ 300KB (gz), TTI < 2s on mid-range device.
- Lighthouse ≥ 90 (Performance/Accessibility/Best Practices/SEO).
- Reliability: all core actions work offline.
- Security: sanitize pasted HTML; no remote eval.

## 9) DevEx & Scripts

- `dev`, `build`, `preview`, `test`, `lint`, `format`, `e2e`
- Husky pre-commit: `lint` + `test`
- Minimal CI: install → lint → test → build

## 10) Deliverables (generate now)

1. Project tree (Vite + React + TS)
2. Implemented components/pages and Zustand store with localStorage persistence
3. Search service with hashtag parsing + ranking + tests
4. Image paste/drag-drop handler and gallery UI
5. Sample seed notes (5–8) covering #Blueprints, #Materials, #Niagara, #Editor, #C++
6. README with setup, key decisions, and migration path to cloud sync

## 11) Seed Examples (use these in the scaffold)

- `“Instanced Static Mesh”` → hashtags: `#Blueprints #UE5`; keywords: `["ISM", "Add Instance"]`; blueprintNodes: `["Add Instance", "ForEachLoop"]`; definition: “Efficiently renders many mesh instances.”
- `“Widget Switcher Basics”` → `#UI #Blueprints`; keywords: `["Widget Switcher", "visibility"]`; nodes: `["SetActiveWidgetIndex"]`
- `“Material Parameter Collections”` → `#Materials`; keywords: `["MPC", "global param"]`
- `“Niagara Spawn Burst”` → `#Niagara`; keywords: `["burst", "emitter"]`
- `“Editor Shortcuts”` → `#Editor`; keywords: `["F", "G", "End"]`

## 12) Future (scaffold hooks but leave stubbed)

- Export/import JSON; optional PNG export of a note
- Optional cloud: Supabase or Firebase (auth + storage)
- Media handling upgrade: move images from data URLs to object URLs/IndexedDB

---

### Clarify (if missing)

- Keep images as **data URLs** in MVP? Or use **IndexedDB** for larger files?
- Any must-have categories besides `#Blueprints #Materials #Niagara #Editor #C++ #UI #UE5`?
- Need code syntax highlighting in editor (for small C++ snippets)?
