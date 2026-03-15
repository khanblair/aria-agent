# Blair's Academy

**Tagline:** Programming language API docs, simplified

---

## Problem

Developers struggle to find and understand API documentation across different programming languages. Official docs are often:
- Overwhelming (thousands of APIs)
- Hard to navigate
- Missing practical examples

---

## Solution

A unified platform presenting API docs in clean, copy-paste-ready format. Users can:
- Select their target language
- Browse curated API lists
- Copy working code examples
- Understand integration patterns

---

## Target Users

- Junior developers learning new languages
- Experienced devs switching languages
- Anyone needing quick API reference

---

## Core Features

1. **Language Selector** - Grid of Python, JavaScript, Go, Rust, TypeScript
2. **Curated API Lists** - Most-used APIs per language (not everything)
3. **Code Examples** - Copy-paste ready snippets with explanations
4. **Search** - Find APIs within selected language
5. **Dark/Light Mode** - Toggle for readability
6. **Responsive Design** - Works on mobile and desktop

---

## Learning Roadmap

### Python (Priority Order)
1. Built-in functions: `print`, `len`, `range`, `enumerate`, `zip`, `map`, `filter`
2. Core modules: `os`, `sys`, `json`, `collections`, `itertools`
3. Common libs: `requests`, `datetime`, `pathlib`

### JavaScript
1. Array methods: `map`, `filter`, `reduce`, `forEach`, `find`
2. Object methods: `keys`, `values`, `entries`, `assign`
3. String methods: `split`, `slice`, `replace`, `match`
4. Async: `Promise`, `async/await`, `fetch`

### Go
1. fmt package: `Println`, `Printf`, `Sprintf`, `Errorf`
2. Strings: `Contains`, `Split`, `ToLower`, `Trim`
3. Core: `os`, `json`, `http`, `io`

### Rust
1. Option/Result: `Some`, `None`, `Ok`, `Err`, `unwrap`
2. Collections: `Vec`, `String`, `HashMap`
3. Traits: `Clone`, `Debug`, `Display`

### TypeScript
1. Utility types: `Partial`, `Required`, `Pick`, `Omit`
2. Generics basics
3. Common patterns

---

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** Convex (for caching learned APIs)
- **Hosting:** Vercel
- **AI:** Groq API (for incremental learning)

---

## Incremental Learning

The platform learns 10-15 APIs at a time:
1. Fetch from official docs
2. Parse and simplify
3. Store in Convex cache
4. Display in UI
5. Deploy

This avoids rate limits and keeps content manageable.

---

## Design Direction

- **Theme:** Clean, developer-focused, minimal
- **Colors:** Dark mode default (like VS Code)
- **Typography:** Monospace for code, sans-serif for text
- **Layout:** Sidebar for navigation, main area for docs

---

## Acceptance Criteria

- [ ] Language selector grid on homepage
- [ ] Individual language pages work
- [ ] Code examples have copy button
- [ ] Dark/light mode toggle works
- [ ] Search filters APIs
- [ ] Mobile responsive
- [ ] Deploys to Vercel successfully
