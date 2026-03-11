# 🤖 ARIA — Autonomous Research & Implementation Agent

> Spends Week 1 researching. Week 2+ building, refining the design, evolving the schema, fixing deployments, and polishing — until it's actually good.

[![Agent Status](https://github.com/YOUR_USERNAME/aria-agent/actions/workflows/agent.yml/badge.svg)](https://github.com/YOUR_USERNAME/aria-agent/actions/workflows/agent.yml)
[![Journal](https://img.shields.io/badge/Evolution_Journal-Live-00ff88)](https://YOUR_USERNAME.github.io/aria-agent)

**Stack:** MiniMax M2.5 · Next.js 14 · Convex (free) · Vercel (free) · GitHub Actions

---

## What's New — The Build Pipeline

ARIA now:

1. **DESIGN_RESEARCH** — Searches the web for visual benchmarks, Dribbble references, color palettes, and Tailwind patterns *before* writing UI code
2. **DEPLOY_STAGING** — Deploys to a Vercel preview URL *before* calling it done
3. **DESIGN_REFINE** — Critiques the live preview: typography, contrast, spacing, mobile layout, component quality
4. **SCHEMA_REFINE** — Reviews the Convex data model: indexes, validators, query patterns, free tier fit
5. **REBUILD** — Applies all design + schema fixes in a targeted pass
6. *(repeats up to 3 times)*
7. **DEPLOY_PROD** — Full production deploy with pre-deploy checklist
8. **CICD_FIX** — If deployment fails, diagnoses from a pattern library (Convex errors, Vercel build errors, env var issues, bundle size problems)
9. **POLISH** — Performance, accessibility, copy, SEO, responsive check

---

## Full Phase Map

```
WEEK 1 — RESEARCH
  SCAN → INVESTIGATE (×5) → SYNTHESIZE → DECIDE

WEEK 2+ — BUILD
  DEFINE ──────────────────────────────────────────┐
       ↓                                           │
  DESIGN_RESEARCH  (web search for visual refs)   │
       ↓                                           │
  BUILD  (code informed by design research)        │
       ↓                                           │
  VALIDATE  (tsc + next build, self-repair ×5)     │
       ↓                                           │
  DEPLOY_STAGING  (preview URL, smoke tests)       │
       ↓                                           │
  DESIGN_REFINE  (critique live preview)           │
       ↓                                           │ up to
  SCHEMA_REFINE  (evolve Convex data model)        │ 3×
       ↓                                           │
  REBUILD  (apply all fixes)                       │
       ↓                                           │
  VALIDATE ────────────────────────────────────────┘
       ↓  (after 3 iterations)
  DEPLOY_PROD  (full production deploy)
       ↓
  CICD_FIX  (if anything breaks — pattern-matched diagnosis)
       ↓
  POLISH  (perf, a11y, copy, SEO, responsive)
       ↓
  REFLECT + PONDER (×3)
       ↓
  DISCOVER → next cycle
```

---

## Setup

### 1. Fork this repo

### 2. Add GitHub Secrets

| Secret | Where |
|--------|-------|
| `MINIMAX_API_KEY` | [platform.minimaxi.com](https://platform.minimaxi.com) |
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel → Settings → General |
| `CONVEX_DEPLOY_KEY` | Convex dashboard → Settings |
| `NEXT_PUBLIC_CONVEX_URL` | Convex dashboard → Settings (for Vercel env injection) |

### 3. Enable GitHub Pages → Source: GitHub Actions

### 4. Actions → ARIA → Run workflow

---

## Project Structure

```
aria-agent/
├── .github/workflows/agent.yml
├── agent/
│   ├── AGENT_PROMPT.md           # Full system prompt (all phases)
│   ├── runner.js                 # Phase orchestrator
│   ├── package.json              # openai dep
│   ├── memory/
│   │   ├── state.json            # Phase + iteration tracking
│   │   ├── backlog.json          # Adjacent problems
│   │   ├── cicd_patterns.json    # Growing CI/CD fix knowledge
│   │   ├── error_log.json
│   │   ├── lessons.json
│   │   └── deployments.json      # Preview + production URLs
│   ├── research/                 # Week 1 files
│   ├── design/                   # Design research, critiques, schema v2
│   ├── specs/
│   └── reflections/
├── projects/[slug]/              # Generated website code
└── docs/
    ├── build-journal.js
    └── journal/
```

---

## Cost

| | Monthly |
|--|--|
| MiniMax M2.5 (Starter Plan) | $10/mo |
| Vercel, Convex, GitHub Actions | $0 |
| **Total** | **~$3–8** |

---

## Resilience & Rate Limiting

ARIA is designed to stay within MiniMax's Starter limits:
- **Model**: Uses `MiniMax-M2.5` for the best power/speed balance.
- **Handling 429s**: Implements exponential backoff (retries with increasing delays) if rate limited.
- **RPM Management**: Adds mandatory inter-request delays to respect the 30 Requests Per Minute limit.
- **Efficiency**: Only 3 scheduled runs per day to stay well under the 250 Requests Per Day quota.

---

## License

MIT
