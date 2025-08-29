import { Note } from '@/types';
import { generateId } from '@/lib/search';

export const seedNotes: Note[] = [
  {
    id: generateId(),
    title: "Instanced Static Mesh Components",
    content: "# Instanced Static Mesh Components\n\nISMs are crucial for **performance optimization** in UE5. They allow rendering thousands of identical meshes with minimal draw calls. Perfect for foliage, rocks, debris, etc.\n\n## Key Benefits:\n\n- Single draw call for multiple instances\n- GPU-based culling\n- LOD transitions\n- Hardware instancing support\n\n## Usage Example:\n\n```cpp\n// C++ Example\nUInstancedStaticMeshComponent* ISMComponent;\nISMComponent->AddInstance(Transform);\n```\n\n> **Important:** Always batch your instances for maximum performance gains!",
    hashtags: ["#Blueprints", "#UE5", "#Performance"],
    keywords: ["ISM", "Add Instance", "performance", "draw calls"],
    blueprintNodes: ["Add Instance", "ForEachLoop", "Get Instance Transform"],
    definitions: "Efficiently renders many identical mesh instances using hardware instancing to reduce draw calls.",
    images: [],
    color: "bg-green-100",
    pinned: true,
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    updatedAt: Date.now() - 86400000 * 2   // 2 days ago
  },
  
  {
    id: generateId(),
    title: "Widget Switcher Basics",
    content: "Widget Switcher is essential for UI state management. It allows you to switch between different panels or screens in your UI.\n\nCommon use cases:\n- Menu systems\n- Inventory tabs\n- Settings panels\n- Loading screens",
    hashtags: ["#UI", "#Blueprints", "#UMG"],
    keywords: ["Widget Switcher", "visibility", "UI panels", "menu"],
    blueprintNodes: ["SetActiveWidgetIndex", "Get Active Widget Index"],
    definitions: "A container widget that shows only one of its child widgets at a time, useful for creating tabbed interfaces.",
    images: [],
    color: "bg-blue-100",
    pinned: false,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1
  },
  
  {
    id: generateId(),
    title: "Material Parameter Collections",
    content: "## Material Parameter Collections (MPC)\n\nMPCs allow you to create **global parameters** that can be accessed by multiple materials simultaneously. Great for time of day systems, weather effects, etc.\n\n### Steps to Create:\n\n1. Create Material Parameter Collection asset\n2. Add scalar/vector parameters\n3. Reference in materials using `Collection Parameter` node\n4. Modify at runtime using Blueprint\n\n### Blueprint Usage:\n\n```blueprint\nSet Scalar Parameter Value\n├─ Collection: YourMPCAsset\n├─ Parameter Name: \"TimeOfDay\"\n└─ Value: 0.75\n```\n\n| Parameter Type | Use Case | Example |\n|----------------|----------|----------|\n| Scalar | Time values, intensity | Sun intensity, wind speed |\n| Vector | Colors, directions | Sun color, wind direction |\n| Linear Color | RGB values | Sky color, fog color |",
    hashtags: ["#Materials", "#UE5"],
    keywords: ["MPC", "global parameters", "time of day", "weather"],
    blueprintNodes: ["Set Scalar Parameter Value", "Set Vector Parameter Value"],
    definitions: "Global material parameters that can be shared across multiple materials and modified at runtime.",
    images: [],
    color: "bg-purple-100",
    pinned: true,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3
  },
  
  {
    id: generateId(),
    title: "Niagara Spawn Burst",
    content: "Spawn Burst creates an immediate burst of particles, perfect for explosions, impacts, or one-shot effects.\n\nKey parameters:\n- Spawn Count: Number of particles to spawn\n- Spawn Time: When to trigger the burst\n- Loop Behavior: Whether to repeat\n\nUseful for:\n- Explosion effects\n- Magic spell impacts\n- Debris on collision",
    hashtags: ["#Niagara", "#VFX"],
    keywords: ["burst", "emitter", "particles", "explosion"],
    blueprintNodes: ["Spawn System Attached", "Set Niagara Variable"],
    definitions: "A Niagara module that spawns a specific number of particles instantly at a given time.",
    images: [],
    color: "bg-amber-100",
    pinned: false,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 1
  },
  
  {
    id: generateId(),
    title: "Essential Editor Shortcuts",
    content: "Mastering these shortcuts will significantly speed up your workflow:\n\n**Navigation:**\n- F: Focus on selected object\n- G: Game view toggle\n- Ctrl+Shift+H: Hide/show selected\n- End: Drop to floor\n\n**Selection:**\n- H: Hide selected\n- Ctrl+H: Hide unselected\n- Shift+H: Unhide all\n\n**Viewport:**\n- F11: Immersive mode\n- Alt+G: Perspective/Orthographic toggle",
    hashtags: ["#Editor", "#Workflow"],
    keywords: ["shortcuts", "hotkeys", "navigation", "viewport"],
    blueprintNodes: [],
    definitions: "Keyboard shortcuts that improve editor navigation and workflow efficiency.",
    images: [],
    color: "bg-gray-100",
    pinned: false,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1
  },
  
  {
    id: generateId(),
    title: "C++ Actor Component Basics",
    content: "Creating reusable components in C++ for Blueprint integration:\n\n```cpp\nUCLASS(BlueprintType, Blueprintable)\nclass MYGAME_API UMyComponent : public UActorComponent\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere, BlueprintReadWrite)\n    float MyFloat = 1.0f;\n    \n    UFUNCTION(BlueprintCallable)\n    void MyFunction();\n};\n```\n\nKey macros:\n- UCLASS: Makes class available to UE\n- UPROPERTY: Exposes variables\n- UFUNCTION: Exposes functions to Blueprint",
    hashtags: ["#C++", "#Blueprints", "#Programming"],
    keywords: ["component", "UCLASS", "UPROPERTY", "UFUNCTION"],
    blueprintNodes: [],
    definitions: "Custom C++ components that can be attached to actors and exposed to Blueprint system.",
    images: [],
    color: "bg-pink-100",
    pinned: false,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000 // 1 hour ago
  },
  
  {
    id: generateId(),
    title: "Blueprint Event Dispatchers",
    content: "Event Dispatchers enable communication between different Blueprint classes without direct references.\n\nHow to use:\n1. Create Event Dispatcher in Blueprint\n2. Call dispatcher when event occurs\n3. Bind to dispatcher in other Blueprints\n4. Handle the event\n\nGreat for:\n- Player death events\n- Achievement unlocks\n- UI updates\n- Game state changes",
    hashtags: ["#Blueprints", "#Events"],
    keywords: ["event dispatcher", "communication", "events", "binding"],
    blueprintNodes: ["Call", "Bind Event", "Unbind Event"],
    definitions: "A Blueprint system for broadcasting events to multiple listeners without requiring direct object references.",
    images: [],
    color: "bg-green-100",
    pinned: false,
    createdAt: Date.now() - 3600000 * 12, // 12 hours ago
    updatedAt: Date.now() - 3600000 * 2   // 2 hours ago
  },
  
  {
    id: generateId(),
    title: "Landscape Auto-Material Setup",
    content: "Setting up automatic landscape materials based on slope and height:\n\n1. Create landscape material with layer blend nodes\n2. Use World Position and Landscape Layer Coords\n3. Add slope detection using DDX/DDY nodes\n4. Paint landscape layers in editor\n\nLayer types:\n- Weight-Blended: Smooth transitions\n- Alpha-Blended: Sharp cutoffs\n\nTips:\n- Use noise for natural variation\n- Combine slope + height for realistic results\n- Test with different landscape resolutions",
    hashtags: ["#Landscapes", "#Materials", "#Terrain"],
    keywords: ["auto material", "slope", "height", "layer blend"],
    blueprintNodes: [],
    definitions: "Automatic material assignment for landscapes based on geometric properties like slope angle and world height.",
    images: [],
    color: "bg-amber-100",
    pinned: false,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000
  }
];

export function initializeSeedData(): void {
  const existingData = localStorage.getItem('ue-notes.v1');
  
  if (!existingData || JSON.parse(existingData).length === 0) {
    localStorage.setItem('ue-notes.v1', JSON.stringify(seedNotes));
    console.log('Initialized with seed data');
  }
}
