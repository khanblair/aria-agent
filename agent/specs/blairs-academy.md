# Blair's Academy

## Tagline
Programming language API docs, simplified

## Problem
Developers struggle to find and understand API documentation across different programming languages. The information is often scattered, inconsistently formatted, and difficult to copy‑paste into code, leading to wasted time and reduced productivity.

## Solution
A unified, language‑agnostic platform that aggregates API documentation into a clean, copy‑paste‑ready format. Docs are presented consistently, with searchable endpoints, ready‑to‑use code examples, and integration hints tailored to each language.

## Target Users
- **Junior developers** learning new languages and needing clear, concise references.  
- **Experienced developers** switching between languages or looking up unfamiliar APIs.  
- **Anyone** who needs a quick, reliable API reference without navigating multiple external sites.

## Core Features
1. **Language Selector** – Choose from Python, JavaScript, Go, Rust, TypeScript (expandable).  
2. **Searchable API Endpoints** – Full‑text search across all languages with instant filtering.  
3. **Code Examples with Copy Button** – Ready‑to‑run snippets for each API, copyable with a single click.  
4. **Integration Hints per Language** – Best‑practice notes, common pitfalls, and usage patterns.  
5. **Dark/Light Mode** – User‑controlled theme toggle for comfortable reading.  
6. **Responsive Design** – Optimized layout for desktop, tablet, and mobile devices.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS for a modern, responsive UI.  
- **Backend/Data Layer:** Convex – schema‑driven storage, caching, and incremental learning tracking.  
- **Deployment:** Vercel (preview & production environments).  

## Learning Roadmap (Incremental Learning Approach)
| Phase | Goal |
|-------|------|
| **DEFINE** | Create the spec (this document) and outline the project. |
| **DESIGN_RESEARCH** | Determine visual direction, UI components, and UX flow. |
| **BUILD_CORE** | Scaffold Next.js app, integrate Tailwind, set up Convex schema, create core pages & API routes. |
| **LEARN** | Incrementally fetch and store 10‑15 API docs per language (e.g., Python built‑ins, JS Array methods). |
| **VALIDATE** | Run type‑checking, unit tests, and Next.js build to ensure stability. |
| **DEPLOY_STAGING** | Deploy a Vercel preview for QA. |
| **DEPLOY_PROD** | Deploy the production version. |
| **POLISH** | Refine UI, improve search relevance, add dark mode toggle, ensure mobile responsiveness. |

The **LEARN** phase repeats for each language, gradually expanding the documentation corpus while updating UI components to display new content.

## Convex Schema (Core to Incremental Learning)