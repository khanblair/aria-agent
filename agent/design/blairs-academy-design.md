# Blair's Academy - Design Research

## Design Inspiration

### Reference Sites
- **DevDocs** (devdocs.io) - Clean API documentation grid
- **MDN Web Docs** (developer.mozilla.org) - Standard for web docs
- **Dash** (kapeli.com/dash) - macOS doc viewer
- **Rust Docs** (doc.rust-lang.org) - Clean, minimal

---

## Visual Direction

### Color Palette

**Dark Mode (Primary):**
- Background: `#0d1117` (GitHub dark)
- Surface: `#161b22` (cards, sidebar)
- Border: `#30363d`
- Text Primary: `#e6edf3`
- Text Secondary: `#8b949e`
- Accent: `#58a6ff` (links, buttons)
- Code Background: `#1f2428`

**Light Mode:**
- Background: `#ffffff`
- Surface: `#f6f8fa`
- Border: `#d0d7de`
- Text Primary: `#1f2328`
- Text Secondary: `#656d76`
- Accent: `#0969da`

### Typography

- **Headings:** Inter, system-ui, sans-serif
- **Body:** Inter, system-ui, sans-serif
- **Code:** JetBrains Mono, Fira Code, monospace

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Search | Dark Mode Toggle                 │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│   SIDEBAR   │              MAIN CONTENT                     │
│              │                                              │
│  - Language  │   API Title                                 │
│    Selector  │   ─────────                                 │
│              │   Description                               │
│  - API List  │                                              │
│              │   ┌─────────────────────────────────────┐   │
│              │   │  Code Example (copyable)           │   │
│              │   └─────────────────────────────────────┘   │
│              │                                              │
│              │   Parameters                                 │
│              │   Returns                                    │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Components

1. **LanguageCard** - Grid item for language selection
2. **CodeBlock** - Syntax highlighted with copy button
3. **SearchBar** - Filter APIs within language
4. **Sidebar** - Language switcher + API list
5. **DarkModeToggle** - Theme switcher
6. **ApiDoc** - Main doc display component

### Spacing
- Base unit: 4px
- Card padding: 16px (4 units)
- Section gap: 24px (6 units)
- Page margin: 32px (8 units)

### Animations
- Button hover: 150ms ease
- Page transitions: 200ms ease
- Copy success: Checkmark fade
