// agent/runner.js — ARIA
// Full build pipeline: design research, refinement cycles, schema evolution, CI/CD fixing

import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const ROOT       = path.join(__dirname, "..");
const MEMORY_DIR = path.join(__dirname, "memory");
const RESEARCH_DIR = path.join(__dirname, "research");
const DESIGN_DIR = path.join(__dirname, "design");
const SPECS_DIR  = path.join(__dirname, "specs");
const REFLECTIONS_DIR = path.join(__dirname, "reflections");

// Groq API Configuration - Round-robin across 3 keys for rate limit balancing
const GROQ_KEYS = [
  process.env.GROQ_API_KEY1,
  process.env.GROQ_API_KEY2,
  process.env.GROQ_API_KEY3
].filter(Boolean);

let currentKeyIndex = 0;

function getNextKey() {
  if (GROQ_KEYS.length === 0) {
    throw new Error("No Groq API keys configured");
  }
  const key = GROQ_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
  log(`   🔑 Using Groq key ${currentKeyIndex}/${GROQ_KEYS.length}`);
  return key;
}

// Groq uses OpenAI-compatible API
const MODEL = "compound-beta-2024-12-13"; // Groq compound model

// OpenAI-compatible client pointed at Groq
const createGroqClient = (apiKey) => new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

// Rate limit: Groq free tier - use shorter delay for faster runs
// Adjust based on actual rate limits
const INTER_REQUEST_DELAY = 30_000; // 30 seconds between calls

async function callAI(systemPrompt, userMessage, maxTokens = 8000) {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const apiKey = getNextKey();
      const ai = createGroqClient(apiKey);

      log(`🧠 Groq [${MODEL}] → ${maxTokens} tokens (Attempt ${attempt + 1})`);
      const response = await ai.chat.completions.create({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userMessage  },
        ],
      });

      const text = response.choices[0]?.message?.content || "";
      log(`   ← ${text.length} chars`);

      // Mandatory breather — respect Groq rate limits
      log(`   ⏳ Waiting ${INTER_REQUEST_DELAY/1000}s before next call...`);
      await sleep(INTER_REQUEST_DELAY);

      return text;

    } catch (err) {
      const isRetryable = err?.status === 429
        || err?.code === "ECONNRESET" || err?.code === "ECONNREFUSED"
        || err?.code === "ETIMEDOUT"  || err?.code === "ENOTFOUND"
        || err?.message?.toLowerCase().includes("connection error")
        || err?.message?.toLowerCase().includes("network")
        || err?.message?.toLowerCase().includes("rate limit");
      if (isRetryable) {
        attempt++;
        const wait = err?.status === 429
          ? Math.pow(2, attempt) * 30_000  // 30s, 60s, 120s for rate limits
          : Math.pow(2, attempt) * 10_000; // 10s, 20s, 40s for connection errors
        log(`  ⚠️  ${err?.status === 429 ? "Rate limited (429)" : `Connection error (${err?.code || err?.message?.slice(0, 40)})`}. Waiting ${wait/1000}s... (attempt ${attempt}/${MAX_RETRIES})`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
  throw new Error(`Max retries exceeded for Groq [${MODEL}]`);
}

import https from "https";

async function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  log(`📤 Telegram → ${message.slice(0, 50)}...`);
  const data = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown",
  });

  return new Promise((resolve) => {
    const req = https.request(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      },
      (res) => {
        resolve();
      }
    );
    req.on("error", (e) => {
      log(`  ⚠️ Telegram error: ${e.message}`);
      resolve();
    });
    req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ─── Utils ────────────────────────────────────────────────────────────────────

function readJSON(p, fb = null) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fb; }
}
function writeJSON(p, d) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(d, null, 2));
}
function appendLog(p, entry) {
  const a = readJSON(p, []);
  a.push({ ...entry, timestamp: new Date().toISOString() });
  writeJSON(p, a);
}
function log(msg) {
  console.log(`[${new Date().toISOString().split("T")[1].slice(0,8)}] ${msg}`);
}
function today() { return new Date().toISOString().split("T")[0]; }
function readPrompt() {
  const p = path.join(__dirname, "AGENT_PROMPT.md");
  if (!fs.existsSync(p)) throw new Error("AGENT_PROMPT.md is missing from agent/ directory");
  return fs.readFileSync(p, "utf8");
}

function shell(cmd, opts = {}) {
  return spawnSync("bash", ["-c", cmd], {
    cwd: opts.cwd || ROOT,
    timeout: opts.timeout || 180000,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    encoding: "utf8",
  });
}

function projectDir(slug) { return path.join(ROOT, "projects", slug); }

// ─── File Parser ──────────────────────────────────────────────────────────────

function parseAndWriteFiles(response, slug) {
  const dir = projectDir(slug);
  const written = [];
  const pattern = /```[\w.-]*\n\/\/ FILE: ([^\n]+)\n([\s\S]*?)```/g;
  let m;
  while ((m = pattern.exec(response)) !== null) {
    const [, relPath, content] = m;
    const full = path.join(dir, relPath.trim());
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content.trimEnd());
    written.push(relPath.trim());
    log(`  📄 ${relPath.trim()}`);
  }
  return written;
}

function applyBacklogUpdate(response) {
  const m = response.match(/\/\/ BACKLOG_UPDATE\s*\n({[\s\S]*?})\s*\n/);
  if (!m) return;
  try {
    const u = JSON.parse(m[1]);
    const bp = path.join(MEMORY_DIR, "backlog.json");
    const bl = readJSON(bp, []);
    const item = bl.find(b => b.slug === u.slug);
    if (item) {
      (item.thinking_notes = item.thinking_notes || []).push({ note: u.observation, added_at: new Date().toISOString() });
      writeJSON(bp, bl);
      log(`  📝 Backlog updated: ${u.slug}`);
    }
  } catch {}
}

function extractJSON(response, marker) {
  const re = new RegExp(`\\/\\/ ${marker}\\s*\\n({[\\s\\S]*?})\\s*\\n`);
  const m = response.match(re);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

function extractJSONArray(response, marker) {
  const re = new RegExp(`\\/\\/ ${marker}\\s*\\n(\\[[\\s\\S]*?\\])\\s*\\n`);
  const m = response.match(re);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

// ─── Memory Context ───────────────────────────────────────────────────────────

function buildCtx(state) {
  const ctx = {
    state,
    past_ideas:    readJSON(path.join(MEMORY_DIR, "past_ideas.json"), []),
    lessons:       readJSON(path.join(MEMORY_DIR, "lessons.json"), []).slice(-8),
    recent_errors: readJSON(path.join(MEMORY_DIR, "error_log.json"), []).slice(-5),
    deployments:   readJSON(path.join(MEMORY_DIR, "deployments.json"), []),
    backlog:       readJSON(path.join(MEMORY_DIR, "backlog.json"), []),
    chosen:        readJSON(path.join(MEMORY_DIR, "chosen_problem.json"), null),
    cicd_patterns: readJSON(path.join(MEMORY_DIR, "cicd_patterns.json"), []),
  };

  // Research files
  if (fs.existsSync(RESEARCH_DIR)) {
    const synth = path.join(RESEARCH_DIR, "synthesis.md");
    if (fs.existsSync(synth)) ctx.synthesis = fs.readFileSync(synth, "utf8");
    const scans = fs.readdirSync(RESEARCH_DIR).filter(f => f.startsWith("scan-"));
    if (scans.length) ctx.latest_scan = fs.readFileSync(path.join(RESEARCH_DIR, scans.at(-1)), "utf8");
  }

  // Design files
  if (state.current_project && fs.existsSync(DESIGN_DIR)) {
    const dr = path.join(DESIGN_DIR, `${state.current_project}-design-research.md`);
    if (fs.existsSync(dr)) ctx.design_research = fs.readFileSync(dr, "utf8");
    // Latest critique
    const critiques = fs.readdirSync(DESIGN_DIR)
      .filter(f => f.startsWith(`${state.current_project}-critique`))
      .sort();
    if (critiques.length) ctx.latest_critique = fs.readFileSync(path.join(DESIGN_DIR, critiques.at(-1)), "utf8");
    // Schema v2
    const sv2 = path.join(DESIGN_DIR, `${state.current_project}-schema-v2.ts`);
    if (fs.existsSync(sv2)) ctx.schema_v2 = fs.readFileSync(sv2, "utf8");
  }

  // Spec
  if (state.current_project) {
    const sp = path.join(SPECS_DIR, `${state.current_project}.md`);
    if (fs.existsSync(sp)) ctx.spec = fs.readFileSync(sp, "utf8");
    // Also try without .md extension for blairs-academy
    const sp2 = path.join(SPECS_DIR, "blairs-academy.md");
    if (fs.existsSync(sp2)) ctx.spec = fs.readFileSync(sp2, "utf8");
  }

  // System prompt from AGENT_PROMPT.md
  ctx.system = readPrompt();

  return ctx;
}

function getProjectTree(dir, depth = 0) {
  if (depth > 3 || !fs.existsSync(dir)) return "";
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !["node_modules", ".next", ".git", ".vercel", ".turbo"].includes(e.name))
    .map(e => {
      const pad = "  ".repeat(depth);
      return e.isDirectory()
        ? `${pad}${e.name}/\n${getProjectTree(path.join(dir, e.name), depth + 1)}`
        : `${pad}${e.name}`;
    }).join("\n");
}

// ─── WEEK 1: RESEARCH PHASES (from v2, unchanged) ─────────────────────────────

async function runScan(state, ctx) {
  log("🔭 SCAN");
  const resp = await callAI(readPrompt(),
    `PHASE: SCAN. Today: ${today()}
Past ideas: ${JSON.stringify(ctx.past_ideas.map(i => i.title || i.slug))}
Seeded backlog: ${JSON.stringify(ctx.backlog.filter(b => b.ready_for_research))}
Explore 10 problem domains. Include // SCAN_COMPLETE block.`);

  fs.mkdirSync(RESEARCH_DIR, { recursive: true });
  fs.writeFileSync(path.join(RESEARCH_DIR, `scan-${today()}.md`), resp);
  const sc = extractJSON(resp, "SCAN_COMPLETE");
  return { ...state, research_phase: "INVESTIGATE", investigated_slugs: [],
    scan_top_5: sc?.top_5_slugs || [], scan_complete_date: today(),
    last_action: "Scanned problem domains", next_action: "Investigate top candidates" };
}

async function runInvestigate(state, ctx) {
  log("🔬 INVESTIGATE");
  const done = state.investigated_slugs || [];
  const remaining = (state.scan_top_5 || []).filter(s => !done.includes(s));
  if (!remaining.length) {
    return { ...state, research_phase: "SYNTHESIZE", last_action: "All investigated", next_action: "Synthesize" };
  }
  const target = remaining[0];
  const resp = await callAI(readPrompt(),
    `PHASE: INVESTIGATE. Target: "${target}"
Scan context: ${ctx.latest_scan?.slice(0, 1500) || "N/A"}
Include // INVESTIGATE_COMPLETE block.`);

  fs.writeFileSync(path.join(RESEARCH_DIR, `investigate-${target}.md`), resp);
  const ic = extractJSON(resp, "INVESTIGATE_COMPLETE");

  // Seed adjacents
  const bl = readJSON(path.join(MEMORY_DIR, "backlog.json"), []);
  for (const adj of (ic?.adjacent_problems || [])) {
    if (!bl.find(b => b.slug === adj)) bl.push({
      slug: adj, title: adj, hypothesis: "",
      connection_to_main: `from investigation of ${target}`,
      score_at_seed: 0, thinking_notes: [], informed_by_main_build: [],
      ready_for_research: false, seeded_at: new Date().toISOString(),
    });
  }
  writeJSON(path.join(MEMORY_DIR, "backlog.json"), bl);
  return { ...state, investigated_slugs: [...done, target],
    last_action: `Investigated ${target}`, next_action: remaining.length > 1 ? `Investigate ${remaining[1]}` : "Synthesize" };
}

async function runSynthesize(state, ctx) {
  log("⚗️  SYNTHESIZE");
  const investigations = (state.scan_top_5 || []).map(slug => {
    const fp = path.join(RESEARCH_DIR, `investigate-${slug}.md`);
    return `### ${slug}\n${fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").slice(0, 600) : "(missing)"}`;
  }).join("\n\n---\n\n");
  const resp = await callAI(readPrompt(),
    `PHASE: SYNTHESIZE. Investigations:\n${investigations}\nBacklog: ${JSON.stringify(ctx.backlog)}
Include // SYNTHESIS_COMPLETE block.`, 10000);
  fs.writeFileSync(path.join(RESEARCH_DIR, "synthesis.md"), resp);
  const sc = extractJSON(resp, "SYNTHESIS_COMPLETE");
  return { ...state, research_phase: "DECIDE", synthesis_chosen: sc?.chosen_slug,
    synthesis_backlog: sc?.backlog_slugs || [], last_action: `Chose: ${sc?.chosen_slug}`, next_action: "Decide" };
}

async function runDecide(state, ctx) {
  log("🎯 DECIDE");
  const resp = await callAI(readPrompt(),
    `PHASE: DECIDE. Synthesis:\n${ctx.synthesis || "N/A"}
Chosen: ${state.synthesis_chosen}. Backlog: ${JSON.stringify(state.synthesis_backlog)}
Output: // FILE: memory/chosen_problem.json, ## COMMITMENT, // BACKLOG_SEED`);

  const cm = resp.match(/\/\/ FILE: memory\/chosen_problem\.json\s*\n```[\w]*\n({[\s\S]*?})```/);
  if (cm) {
    try { writeJSON(path.join(MEMORY_DIR, "chosen_problem.json"), { ...JSON.parse(cm[1]), decided_at: new Date().toISOString() }); }
    catch {}
  }
  const commit = resp.match(/## COMMITMENT\s*\n([\s\S]*?)(?=\n##|\n\/\/|$)/);
  if (commit) fs.writeFileSync(path.join(MEMORY_DIR, "commitment.md"), commit[1].trim());

  const bsm = resp.match(/\/\/ BACKLOG_SEED\s*\n(\[[\s\S]*?\])\s*```/);
  if (bsm) {
    try {
      const seeds = JSON.parse(bsm[1]);
      const bl = readJSON(path.join(MEMORY_DIR, "backlog.json"), []);
      seeds.forEach(s => { if (!bl.find(b => b.slug === s.slug)) bl.push(s); });
      writeJSON(path.join(MEMORY_DIR, "backlog.json"), bl);
    } catch {}
  }

  const chosen = readJSON(path.join(MEMORY_DIR, "chosen_problem.json"), {});
  return { ...state, current_phase: "DEFINE", research_phase: null, week: 2,
    current_project: chosen.slug || state.synthesis_chosen, build_start_date: today(),
    last_action: `Committed to: ${chosen.slug}`, next_action: "Define spec" };
}

// ─── BUILD PHASES ─────────────────────────────────────────────────────────────

async function runDefine(state, ctx) {
  log("📋 DEFINE - Creating Blair's Academy specification");

  const prompt = `Create SPEC.md for Blair's Academy.

## Project: Blair's Academy
**Tagline:** Programming language API docs, simplified

## Problem
Developers struggle to find and understand API documentation across different programming languages.

## Solution
A unified platform presenting API docs in clean, copy-paste-ready format.

## Target Users
- Junior developers learning new languages
- Experienced devs switching languages
- Anyone needing quick API reference

## Core Features to Implement
1. Language selector (Python, JavaScript, Go, Rust, TypeScript)
2. Searchable API endpoints
3. Code examples with copy button
4. Integration hints per language
5. Dark/light mode
6. Responsive design

## Tech Stack
- Next.js 14 + Tailwind CSS
- Convex for backend data
- Vercel deployment

Write the full spec. Use this format:
\`\`\`markdown
// FILE: agent/specs/blairs-academy.md
# Blair's Academy
[full spec content]
\`\`\``;

  const resp = await callAI(ctx.system, prompt);

  // Extract and write spec
  const sm = resp.match(/```markdown\n\/\/ FILE: agent\/specs\/blairs-academy\.md\n([\s\S]*?)```/);
  if (sm) {
    fs.mkdirSync(SPECS_DIR, { recursive: true });
    fs.writeFileSync(path.join(SPECS_DIR, "blairs-academy.md"), sm[1].trim());
    log("  📝 Spec written to agent/specs/blairs-academy.md");
  }

  return { ...state, current_phase: "DESIGN_RESEARCH",
    last_action: "Spec defined for Blair's Academy",
    next_action: "Research visual direction" };
}

// ─── NEW: DESIGN RESEARCH ─────────────────────────────────────────────────────

async function runDesignResearch(state, ctx) {
  log("🎨 DESIGN_RESEARCH — searching web for doc display patterns");

  const prompt = `Research best practices for API documentation display.

Search for:
1. "best API documentation websites 2024"
2. "DevDocs Dash documentation UI design"
3. "MDN web docs design patterns"
4. "developer documentation dark mode examples"

Find patterns for:
- Code block display with syntax highlighting
- Search functionality for APIs
- Language/framework switchers
- Copy-paste code examples
- Mobile responsive doc layouts

Output design direction as:
// FILE: agent/design/blairs-academy-design.md
[Key design patterns with colors, fonts, component suggestions]`;

  const resp = await callAI(ctx.system, prompt, 10000);

  // Save design research
  fs.mkdirSync(DESIGN_DIR, { recursive: true });
  fs.writeFileSync(path.join(DESIGN_DIR, "blairs-academy-design.md"), resp);
  log("  🎨 Design research written");

  return { ...state, current_phase: "BUILD_CORE",
    last_action: "Design research complete", next_action: "Build core foundation" };
}

// ─── BUILD ────────────────────────────────────────────────────────────────────

async function runBuild(state, ctx) {
  log("🏗️  BUILD");

  const resp = await callAI(readPrompt(),
    `PHASE: BUILD. Project: ${state.current_project}

Spec:
${ctx.spec || "(not found)"}

Design Research (use this to inform ALL visual decisions):
${ctx.design_research || "(not found — use spec visual direction)"}

Lessons from past builds:
${JSON.stringify(ctx.lessons)}

Backlog (for BACKLOG_UPDATE at end):
${JSON.stringify(ctx.backlog.map(b => ({ slug: b.slug, title: b.title })))}

Generate ALL production files. Use // FILE: format.
Implement the design research — specific colors, fonts, layout patterns.
End with // BACKLOG_UPDATE block.`, 16000);

  const written = parseAndWriteFiles(resp, state.current_project);
  applyBacklogUpdate(resp);
  log(`  📦 ${written.length} files`);

  return { ...state, current_phase: "VALIDATE", refinement_iteration: 0,
    last_action: `Built ${written.length} files`, next_action: "Validate" };
}

// ─── BUILD_CORE ───────────────────────────────────────────────────────────────

async function runBuildCore(state, ctx) {
  log("🏗️ BUILD_CORE - Building complete Blair's Academy with dynamic fetching");

  const projectPath = projectDir("blairs-academy");
  const specPath = path.join(SPECS_DIR, "blairs-academy.md");

  // Check spec exists
  if (!fs.existsSync(specPath)) {
    throw new Error("SPEC.md not found. Run DEFINE phase first.");
  }

  const spec = fs.readFileSync(specPath, "utf8");
  const designPath = path.join(DESIGN_DIR, "blairs-academy-design.md");
  const design = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : "";

  const prompt = `You are building Blair's Academy - a programming language documentation platform with DYNAMIC fetching.

## SPEC.md
${spec}

## Design Direction
${design}

## CRITICAL: Dynamic Fetching Architecture
This app must fetch docs from official sources at runtime, with caching to AVOID duplication:

1. API Route: \`app/api/docs/[lang]/route.ts\`
   - Receives language param (python, javascript, go, rust, typescript)
   - Checks Convex cache FIRST (avoid duplicate fetches)
   - Only fetches from official docs if cache is stale (>24h) or missing
   - Stores fresh data in Convex

2. Convex Schema for CACHING (avoid duplication):
\`\`\`typescript
defineSchema({
  docs_cache: defineTable({
    language: string,
    endpoint: string,
    title: string,
    content: string,
    example: string,
    fetchedAt: string,  // timestamp to check freshness
  }).index("language", ["language"]),
})
\`\`\`

3. Data Sources:
   - Python: https://docs.python.org/3/library/ or Pypi API
   - JavaScript: https://developer.mozilla.org/api/v1/
   - Go: https://pkg.go.dev/std
   - Rust: https://doc.rust-lang.org/std/
   - TypeScript: https://www.typescriptlang.org/docs/

## Required Files

### Core Setup:
- package.json, tsconfig.json, next.config.js, tailwind.config.ts
- app/layout.tsx - Main layout with language nav
- app/globals.css - Tailwind + dark mode

### Dynamic Pages:
- app/page.tsx - Language selection grid (Python, JS, Go, Rust, TS)
- app/[lang]/page.tsx - Dynamic doc page that fetches from /api/docs/[lang]

### API Routes (DYNAMIC FETCHING):
- app/api/docs/python/route.ts - Fetch Python docs
- app/api/docs/javascript/route.ts - Fetch JS docs
- app/api/docs/go/route.ts - Fetch Go docs
- app/api/docs/rust/route.ts - Fetch Rust docs
- app/api/docs/typescript/route.ts - Fetch TS docs

### Convex:
- convex/schema.ts - docs_cache table to avoid duplication
- convex/functions.ts - Query functions for cached docs

### Components:
- components/CodeBlock.tsx - Syntax highlighted code with copy
- components/LanguageSelector.tsx - Language switcher
- components/SearchBar.tsx - Search docs
- components/DarkModeToggle.tsx - Dark/light mode

### Caching Logic (IMPORTANT):
\`\`\`typescript
// In API route - AVOID duplication by checking cache first
export async function GET(request: Request, { params }: { params: { lang: string } }) {
  const lang = params.lang;

  // Check Convex cache first - avoid duplicate fetches
  const cached = await convex.query("docs_cache:getByLanguage", { language: lang });

  if (cached && !isStale(cached.fetchedAt)) {
    return Response.json({ source: "cache", data: cached }); // Serve cached, no fetch
  }

  // Fetch from official source (only if needed)
  const fresh = await fetchFromOfficialDocs(lang);

  // Store in cache to avoid future duplication
  await convex mutation("docs_cache:upsert", { language: lang, ...fresh });

  return Response.json({ source: "fresh", data: fresh });
}
\`\`\`

Write ALL files. Use // FILE: path/to/file.ts format.`;

  const result = await callAI(ctx.system, prompt, 16000);

  // Parse and write files
  const written = parseAndWriteFiles(result, "blairs-academy");
  log(`  📦 ${written.length} files`);

  // Initialize git and install deps
  shell(`cd ${projectPath} && git init && npm install && npx convex dev --init`);

  return {
    ...state,
    current_phase: "VALIDATE",
    last_action: "Built complete Blair's Academy with dynamic fetching",
    next_action: "Validate build",
  };
}

// ─── BUILD_LANGUAGE ───────────────────────────────────────────────────────────

// ─── VALIDATE ─────────────────────────────────────────────────────────────────

async function runValidate(state, ctx) {
  log("✅ VALIDATE");
  const dir = projectDir(state.current_project);
  const MAX = 5;
  const errors = [];

  for (let attempt = 1; attempt <= MAX; attempt++) {
    log(`  Attempt ${attempt}/${MAX}`);
    let fail = null;

    // npm ci (clean install)
    let r = shell("npm ci", { cwd: dir, timeout: 120000 });
    if (r.status !== 0) fail = { type: "npm_ci", msg: (r.stderr || r.stdout || "").slice(0, 2000) };

    // tsc
    if (!fail) {
      r = shell("npx tsc --noEmit", { cwd: dir, timeout: 60000 });
      if (r.status !== 0) fail = { type: "typescript", msg: (r.stdout || r.stderr || "").slice(0, 2000) };
      else log("    ✅ TypeScript OK");
    }

    // next build
    if (!fail) {
      r = shell("npx next build", { cwd: dir, timeout: 180000 });
      if (r.status !== 0) fail = { type: "build", msg: ((r.stdout || "") + (r.stderr || "")).slice(0, 2000) };
      else log("    ✅ Build OK");
    }

    if (!fail) {
      appendLog(path.join(MEMORY_DIR, "success_log.json"), { project: state.current_project, attempts: attempt });
      // Decide next phase: first time → DEPLOY_STAGING, after refinement → DEPLOY_STAGING again
      const nextPhase = "DEPLOY_STAGING";
      return { ...state, current_phase: nextPhase,
        last_action: `Validated in ${attempt} attempt(s)`, errors_this_run: errors };
    }

    log(`  ❌ ${fail.type}: fixing...`);
    errors.push(fail);

    const fix = await callAI(readPrompt(),
      `REPAIR MODE. Project: ${state.current_project}. Attempt ${attempt}/${MAX}.
Error type: ${fail.type}
Error:
${fail.msg}
Project tree:
${getProjectTree(dir)}
Fix using // FILE: format. Include // REPAIR_ANALYSIS { "root_cause", "fix", "files" }`, 8000);

    parseAndWriteFiles(fix, state.current_project);
    const ra = extractJSON(fix, "REPAIR_ANALYSIS");
    appendLog(path.join(MEMORY_DIR, "error_log.json"), {
      project: state.current_project, attempt, error_type: fail.type,
      error_message: fail.msg.slice(0, 300), root_cause: ra?.root_cause || "unknown",
    });
    log(`  🔧 Fix applied: ${ra?.root_cause || "unknown"}`);
  }

  log("  💀 Max attempts — returning to DEFINE");
  return { ...state, current_phase: "DEFINE", status: "FAILED",
    last_action: `VALIDATE failed after ${MAX} attempts`, errors_this_run: errors };
}

// ─── DEPLOY STAGING ───────────────────────────────────────────────────────────

async function runDeployStaging(state) {
  log("🔬 DEPLOY_STAGING — preview deploy");
  const dir = projectDir(state.current_project);

  if (!process.env.VERCEL_TOKEN) {
    log("  No VERCEL_TOKEN — mock staging");
    return { ...state, current_phase: "DEPLOY_PROD",
      preview_url: `https://${state.current_project}-preview.vercel.app`,
      last_action: "Mock staging deploy", next_action: "Deploy to production" };
  }

  // Deploy Convex if present
  if (fs.existsSync(path.join(dir, "convex"))) {
    log("  Deploying Convex preview...");
    const cr = shell("npx convex deploy", { cwd: dir, timeout: 120000 });
    if (cr.status !== 0) log(`  ⚠️  Convex preview warning: ${(cr.stderr || "").slice(0, 200)}`);
    else log("  ✅ Convex preview OK");
  }

  // Vercel preview (no --prod flag)
  log("  Deploying Vercel preview...");
  const vr = shell(`vercel deploy --token ${process.env.VERCEL_TOKEN} 2>&1`, { cwd: dir, timeout: 180000 });
  const output = (vr.stdout || "") + (vr.stderr || "");
  const urlMatch = output.match(/https:\/\/[a-z0-9-]+-[a-z0-9]+-[^.]+\.vercel\.app|https:\/\/[a-z0-9-]+\.vercel\.app/);
  const previewUrl = urlMatch ? urlMatch[0] : null;

  if (previewUrl) log(`  ✅ Preview: ${previewUrl}`);
  else log(`  ⚠️  Could not extract preview URL`);

  // Smoke tests
  let smokeTests = { http_status: 0, has_error_page: false, response_ms: 0 };
  if (previewUrl) {
    const smoke = shell(`curl -s -o /dev/null -w "%{http_code}|%{time_total}" "${previewUrl}"`, {});
    const parts = (smoke.stdout || "").split("|");
    smokeTests.http_status = parseInt(parts[0]) || 0;
    smokeTests.response_ms = Math.round((parseFloat(parts[1]) || 0) * 1000);
    const body = shell(`curl -s "${previewUrl}" 2>/dev/null | head -c 5000`, {});
    smokeTests.has_error_page = (body.stdout || "").toLowerCase().includes("<title>error");
    log(`  🧪 Smoke: HTTP ${smokeTests.http_status}, ${smokeTests.response_ms}ms`);
  }

  appendLog(path.join(MEMORY_DIR, "deployments.json"), {
    project: state.current_project, url: previewUrl,
    type: "preview", smoke_tests: smokeTests,
  });

  return { ...state, current_phase: "DEPLOY_PROD", preview_url: previewUrl,
    last_action: `Staging: ${previewUrl || "failed"}`, next_action: "Deploy to production" };
}

// ─── NEW: DESIGN REFINE ───────────────────────────────────────────────────────

async function runDesignRefine(state, ctx) {
  const iter = (state.refinement_iteration || 0) + 1;
  log(`🎨 DESIGN_REFINE — iteration ${iter}/3`);

  // Read current file list for context
  const dir = projectDir(state.current_project);
  const tree = getProjectTree(dir);

  const resp = await callAI(readPrompt(),
    `PHASE: DESIGN_REFINE. Project: ${state.current_project}
Refinement iteration: ${iter}/3
Preview URL: ${state.preview_url || "not available"}

Design research that was planned:
${ctx.design_research?.slice(0, 2000) || "N/A"}

Current project file structure:
${tree}

Read the CSS/component files in the project and critique:
1. Does the implementation match the design research palette and fonts?
2. What looks visually weak?
3. What specific Tailwind/CSS changes would improve it?

Produce the full design critique document following DESIGN_REFINE format.
Include // DESIGN_CRITIQUE JSON block with prioritized fixes.

Output critique as:
\`\`\`markdown
// FILE: critique-${iter}.md  
[critique content]
\`\`\``, 8000);

  fs.mkdirSync(DESIGN_DIR, { recursive: true });
  const cm = resp.match(/```markdown\n\/\/ FILE: critique-\d+\.md\n([\s\S]*?)```/);
  if (cm) {
    fs.writeFileSync(path.join(DESIGN_DIR, `${state.current_project}-critique-${iter}.md`), cm[1].trim());
  } else {
    fs.writeFileSync(path.join(DESIGN_DIR, `${state.current_project}-critique-${iter}.md`), resp);
  }

  const dc = extractJSON(resp, "DESIGN_CRITIQUE");
  log(`  📋 ${dc?.fixes?.length || 0} fixes identified`);

  return { ...state, current_phase: "SCHEMA_REFINE", refinement_iteration: iter,
    last_action: `Design critique ${iter} complete`, next_action: "Review schema" };
}

// ─── NEW: SCHEMA REFINE ───────────────────────────────────────────────────────

async function runSchemaRefine(state, ctx) {
  log("🗄️  SCHEMA_REFINE");

  const dir = projectDir(state.current_project);
  const schemaPath = path.join(dir, "convex", "schema.ts");
  const hasConvex = fs.existsSync(schemaPath);

  if (!hasConvex) {
    log("  No Convex schema — skipping");
    return { ...state, current_phase: "REBUILD",
      last_action: "No Convex — schema refine skipped", next_action: "Apply design fixes" };
  }

  const currentSchema = fs.readFileSync(schemaPath, "utf8");
  // Read all convex functions for context
  const convexDir = path.join(dir, "convex");
  const convexFiles = fs.readdirSync(convexDir)
    .filter(f => f.endsWith(".ts"))
    .map(f => `// ${f}\n${fs.readFileSync(path.join(convexDir, f), "utf8").slice(0, 500)}`)
    .join("\n\n---\n\n");

  const resp = await callAI(readPrompt(),
    `PHASE: SCHEMA_REFINE. Project: ${state.current_project}

Current Convex schema:
${currentSchema}

Current Convex functions:
${convexFiles}

Spec requirements:
${ctx.spec?.slice(0, 1000) || "N/A"}

Review the schema against the SCHEMA_REFINE checklist in your system prompt.
If improvements are needed, output:
\`\`\`typescript
// FILE: design-schema-v2.ts
[improved schema with migration comments]
\`\`\`

Include // SCHEMA_CHANGES { "version", "changes", "migration_needed" }

If no changes needed, output: // SCHEMA_CHANGES { "version": "v1", "changes": [], "no_changes": true }`, 6000);

  const sc = extractJSON(resp, "SCHEMA_CHANGES");

  if (!sc?.no_changes) {
    const sm = resp.match(/```typescript\n\/\/ FILE: design-schema-v2\.ts\n([\s\S]*?)```/);
    if (sm) {
      fs.writeFileSync(path.join(DESIGN_DIR, `${state.current_project}-schema-v2.ts`), sm[1].trim());
      log(`  🗄️  Schema v2 written: ${sc?.changes?.join(", ") || "updated"}`);
    }
  } else {
    log("  ✅ Schema is fine — no changes needed");
  }

  return { ...state, current_phase: "REBUILD",
    last_action: `Schema refined: ${sc?.changes?.length || 0} changes`, next_action: "Apply all fixes" };
}

// ─── NEW: REBUILD ─────────────────────────────────────────────────────────────

async function runRebuild(state, ctx) {
  const iter = state.refinement_iteration || 1;
  log(`🔨 REBUILD — applying iteration ${iter} fixes`);

  const dir = projectDir(state.current_project);
  const tree = getProjectTree(dir);

  // Read current UI files to show the agent what it's changing
  const componentFiles = [];
  const compDir = path.join(dir, "components");
  if (fs.existsSync(compDir)) {
    fs.readdirSync(compDir).forEach(f => {
      if (f.endsWith(".tsx") || f.endsWith(".ts")) {
        componentFiles.push(`// components/${f}\n${fs.readFileSync(path.join(compDir, f), "utf8").slice(0, 800)}`);
      }
    });
  }
  const appPage = path.join(dir, "app", "page.tsx");
  const tailwindConfig = path.join(dir, "tailwind.config.ts");

  const resp = await callAI(readPrompt(),
    `PHASE: REBUILD. Project: ${state.current_project}. Iteration: ${iter}

Design critique to apply:
${ctx.latest_critique?.slice(0, 2000) || "N/A"}

Schema changes to apply:
${ctx.schema_v2 ? `New schema:\n${ctx.schema_v2}` : "No schema changes"}

Current tailwind.config.ts:
${fs.existsSync(tailwindConfig) ? fs.readFileSync(tailwindConfig, "utf8").slice(0, 1000) : "not found"}

Current app/page.tsx:
${fs.existsSync(appPage) ? fs.readFileSync(appPage, "utf8").slice(0, 1500) : "not found"}

Current components:
${componentFiles.join("\n\n---\n\n").slice(0, 3000)}

Apply ALL fixes from the design critique AND schema changes.
Output ONLY the changed files using // FILE: format.
Add // CHANGED: [what changed] comment at the top of each modified file.

Include // REBUILD_COMPLETE { "iteration", "files_changed", "fixes_applied" }`, 12000);

  const written = parseAndWriteFiles(resp, state.current_project);

  // If schema changed, update convex/schema.ts
  if (ctx.schema_v2) {
    const convexSchema = path.join(dir, "convex", "schema.ts");
    if (fs.existsSync(convexSchema)) {
      fs.writeFileSync(convexSchema, ctx.schema_v2);
      written.push("convex/schema.ts (from v2)");
      log("  🗄️  convex/schema.ts updated from v2");
    }
  }

  const rc = extractJSON(resp, "REBUILD_COMPLETE");
  log(`  🔨 ${written.length} files updated`);

  // Decide: more refinement cycles, or deploy prod?
  const maxIter = 3;
  const nextPhase = iter >= maxIter ? "DEPLOY_PROD" : "VALIDATE";

  return { ...state, current_phase: nextPhase,
    last_action: `Rebuild ${iter}: ${rc?.fixes_applied?.length || written.length} fixes`,
    next_action: iter >= maxIter ? "Deploy to production" : "Re-validate then re-stage" };
}

// ─── NEW: DEPLOY PROD ─────────────────────────────────────────────────────────

async function runDeployProd(state) {
  log("🚀 DEPLOY_PROD — production deployment");
  const dir = projectDir(state.current_project);

  // Pre-deploy checklist
  log("  Running pre-deploy checks...");
  const checks = [
    { cmd: "npm ci", label: "npm ci" },
    { cmd: "npx tsc --noEmit", label: "tsc" },
    { cmd: "npx next build", label: "next build" },
  ];

  for (const check of checks) {
    const r = shell(check.cmd, { cwd: dir, timeout: 180000 });
    if (r.status !== 0) {
      log(`  ❌ Pre-deploy check failed: ${check.label}`);
      appendLog(path.join(MEMORY_DIR, "error_log.json"), {
        project: state.current_project, phase: "DEPLOY_PROD",
        error_type: "pre_deploy_check", error_message: `${check.label} failed`,
      });
      return { ...state, current_phase: "CICD_FIX", cicd_fix_attempts: 0,
        last_action: `Pre-deploy ${check.label} failed`, next_action: "Fix CI/CD" };
    }
    log(`  ✅ ${check.label}`);
  }

  if (!process.env.VERCEL_TOKEN) {
    log("  No VERCEL_TOKEN — mock production");
    const url = `https://${state.current_project}.vercel.app`;
    appendLog(path.join(MEMORY_DIR, "deployments.json"), {
      project: state.current_project, url, type: "production", status: "MOCK",
    });
    return { ...state, current_phase: "POLISH", production_url: url,
      last_action: `Mock production: ${url}`, next_action: "Polish" };
  }

  // Convex production
  if (fs.existsSync(path.join(dir, "convex"))) {
    log("  Deploying Convex production...");
    const cr = shell("npx convex deploy --prod", { cwd: dir, timeout: 120000 });
    if (cr.status !== 0) {
      log(`  ❌ Convex production failed`);
      return { ...state, current_phase: "CICD_FIX", cicd_fix_attempts: 0,
        cicd_context: { error: "convex_prod_failed", log: (cr.stderr || "").slice(0, 1000) },
        last_action: "Convex production deploy failed", next_action: "Fix CI/CD" };
    }
    log("  ✅ Convex production deployed");
  }

  // Vercel production
  log("  Deploying Vercel production...");
  const vr = shell(`vercel --prod --yes --token ${process.env.VERCEL_TOKEN} 2>&1`, { cwd: dir, timeout: 180000 });
  const output = (vr.stdout || "") + (vr.stderr || "");
  const urlM = output.match(/https:\/\/[a-z0-9-]+\.vercel\.app/g);
  // Last URL in output is usually production
  const prodUrl = urlM ? urlM[urlM.length - 1] : null;

  if (vr.status !== 0) {
    log("  ❌ Vercel production failed");
    return { ...state, current_phase: "CICD_FIX", cicd_fix_attempts: 0,
      cicd_context: { error: "vercel_prod_failed", log: output.slice(0, 1000) },
      last_action: "Vercel production deploy failed", next_action: "Fix CI/CD" };
  }

  log(`🚀 Deployed (prod): ${prodUrl}`);
  await sendTelegram(`✅ *Project Deployed to Production!*\n\n🔗 [View Site](${prodUrl})`);

  // Full smoke test suite
  const routes = ["/"];
  const smokeResults = {};
  for (const route of routes) {
    const r = shell(`curl -s -o /dev/null -w "%{http_code}|%{time_total}" "${prodUrl}${route}"`, {});
    const parts = (r.stdout || "").split("|");
    smokeResults[route] = { status: parseInt(parts[0]) || 0, ms: Math.round((parseFloat(parts[1]) || 0) * 1000) };
    log(`  🧪 GET ${route}: ${smokeResults[route].status} (${smokeResults[route].ms}ms)`);
  }

  appendLog(path.join(MEMORY_DIR, "deployments.json"), {
    project: state.current_project, url: prodUrl, type: "production",
    status: "SUCCESS", smoke_tests: smokeResults,
  });

  return { ...state, current_phase: "POLISH", production_url: prodUrl,
    last_action: `Production deployed: ${prodUrl}`, next_action: "Polish" };
}

// ─── NEW: CICD FIX ────────────────────────────────────────────────────────────

async function runCICDFix(state, ctx) {
  const attempt = (state.cicd_fix_attempts || 0) + 1;
  log(`🔧 CICD_FIX — attempt ${attempt}/3`);

  if (attempt > 3) {
    log("  Max CICD fix attempts — going to REFLECT anyway");
    return { ...state, current_phase: "REFLECT",
      last_action: "CICD could not be fixed after 3 attempts", next_action: "Reflect" };
  }

  const dir = projectDir(state.current_project);
  const cicdContext = state.cicd_context || {};

  const resp = await callAI(readPrompt(),
    `PHASE: CICD_FIX. Project: ${state.current_project}. Attempt ${attempt}/3.

CI/CD failure context:
${JSON.stringify(cicdContext)}

Recent error log:
${JSON.stringify(ctx.recent_errors.slice(-3))}

Known CI/CD patterns:
${JSON.stringify(ctx.cicd_patterns.slice(-5))}

Project structure:
${getProjectTree(dir)}

Diagnose the CI/CD failure using the patterns in your system prompt.
Output:
1. Diagnosis (which pattern this matches)
2. Fixed files using // FILE: format
3. Shell commands to run (// CICD_COMMANDS ["cmd1", "cmd2"])
4. // CICD_FIX_ANALYSIS { "pattern", "root_cause", "fix" }`, 8000);

  const written = parseAndWriteFiles(resp, state.current_project);

  // Run any specific fix commands
  const cmdMatch = resp.match(/\/\/ CICD_COMMANDS\s*\n(\[[\s\S]*?\])\s*\n/);
  if (cmdMatch) {
    try {
      const cmds = JSON.parse(cmdMatch[1]);
      for (const cmd of cmds.slice(0, 5)) { // max 5 commands
        log(`  $ ${cmd}`);
        const r = shell(cmd, { cwd: dir, timeout: 60000 });
        if (r.status !== 0) log(`  ⚠️  Command failed: ${(r.stderr || "").slice(0, 100)}`);
        else log(`  ✅ OK`);
      }
    } catch {}
  }

  const analysis = extractJSON(resp, "CICD_FIX_ANALYSIS");
  appendLog(path.join(MEMORY_DIR, "cicd_patterns.json"), {
    project: state.current_project, pattern: analysis?.pattern,
    root_cause: analysis?.root_cause, fix: analysis?.fix,
  });
  appendLog(path.join(MEMORY_DIR, "error_log.json"), {
    project: state.current_project, phase: "CICD_FIX", attempt,
    error_type: "cicd", root_cause: analysis?.root_cause,
  });

  log(`  🔧 CICD fix: ${analysis?.pattern || "unknown pattern"}`);

  return { ...state, current_phase: "DEPLOY_PROD", cicd_fix_attempts: attempt,
    last_action: `CICD fix ${attempt}: ${analysis?.root_cause || "applied"}`,
    next_action: "Retry production deploy" };
}

// ─── NEW: POLISH ──────────────────────────────────────────────────────────────

async function runPolish(state, ctx) {
  log("✨ POLISH — final quality pass");

  const dir = projectDir(state.current_project);

  // Run automated checks
  const bundleCheck = shell("npx next build 2>&1 | grep -E 'Route|Size|First Load|kB'", { cwd: dir });
  const bundleInfo = (bundleCheck.stdout || "").slice(0, 500);

  // Find accessibility issues
  const imgCheck = shell("grep -r '<img ' app/ components/ --include='*.tsx' 2>/dev/null | grep -v 'alt=' | wc -l", { cwd: dir });
  const missingAlts = parseInt(imgCheck.stdout || "0");

  // Find process.env without checks
  const envCheck = shell("grep -r 'process\\.env\\.' app/ --include='*.tsx' 2>/dev/null | grep -v '??' | wc -l", { cwd: dir });
  const unsafeEnvAccess = parseInt(envCheck.stdout || "0");

  const resp = await callAI(readPrompt(),
    `PHASE: POLISH. Project: ${state.current_project}
Production URL: ${state.production_url || "not available"}

Bundle analysis:
${bundleInfo}

Automated issues found:
- Images missing alt text: ${missingAlts}
- Unsafe env access (no ?? fallback): ${unsafeEnvAccess}

Project structure:
${getProjectTree(dir)}

Spec:
${ctx.spec?.slice(0, 500) || "N/A"}

Run through the full POLISH checklist. Fix whatever you find.
Output fixed files using // FILE: format.
Include // POLISH_COMPLETE { "performance_issues_fixed", "accessibility_issues_fixed", "copy_improvements", "ready_for_reflect" }`, 10000);

  const written = parseAndWriteFiles(resp, state.current_project);
  const pc = extractJSON(resp, "POLISH_COMPLETE");
  log(`  ✨ ${written.length} files polished`);
  log(`  📊 Perf fixes: ${pc?.performance_issues_fixed?.length || 0}, A11y: ${pc?.accessibility_issues_fixed?.length || 0}`);

  // If any polish changes were made, do a final build + deploy
  if (written.length > 0 && process.env.VERCEL_TOKEN) {
    log("  Redeploying after polish...");
    const finalBuild = shell("npm ci && npx next build", { cwd: dir, timeout: 240000 });
    if (finalBuild.status === 0) {
      const redeploy = shell(`vercel --prod --yes --token ${process.env.VERCEL_TOKEN} 2>&1`, { cwd: dir, timeout: 180000 });
      const finalUrl = ((redeploy.stdout || "") + (redeploy.stderr || "")).match(/https:\/\/[a-z0-9-]+\.vercel\.app/g)?.pop();
      if (finalUrl) {
        log(`  ✅ Final deploy: ${finalUrl}`);
        appendLog(path.join(MEMORY_DIR, "deployments.json"), {
          project: state.current_project, url: finalUrl, type: "production_polished", status: "SUCCESS",
        });
      }
    }
  }

  return { ...state, current_phase: "REFLECT",
    last_action: `Polish complete — ${written.length} improvements`, next_action: "Reflect" };
}

// ─── REFLECT + PONDER (from v2) ───────────────────────────────────────────────

async function runReflect(state, ctx) {
  log("🪞 REFLECT");

  const deployments = readJSON(path.join(MEMORY_DIR, "deployments.json"), []);
  const latestDeploy = deployments.filter(d => d.project === state.current_project && d.type === "production_polished").pop()
    || deployments.filter(d => d.project === state.current_project).pop();
  const projectErrors = readJSON(path.join(MEMORY_DIR, "error_log.json"), []).filter(e => e.project === state.current_project);

  const resp = await callAI(readPrompt(),
    `PHASE: REFLECT. Project: ${state.current_project}
Deployment: ${JSON.stringify(latestDeploy)}
Production URL: ${state.production_url || "N/A"}
Errors: ${JSON.stringify(projectErrors)}
Spec: ${ctx.spec?.slice(0, 800) || "N/A"}
Backlog: ${JSON.stringify(ctx.backlog)}

Output:
1. \`\`\`markdown\n// FILE: reflection.md\n[content]\`\`\`
2. // NEW_LESSONS [...]
3. // BACKLOG_INFORMED [{ "slug", "note" }]
4. // JOURNAL_ENTRY { "title", "summary", "problem_solved", "key_learning", "backlog_thoughts" }`);

  const rm = resp.match(/\/\/ FILE: reflection\.md\s*\n```[\w]*\n([\s\S]*?)```/);
  if (rm) {
    fs.mkdirSync(REFLECTIONS_DIR, { recursive: true });
    fs.writeFileSync(path.join(REFLECTIONS_DIR, `${state.current_project}-reflection.md`), rm[1].trim());
  }

  const nl = extractJSONArray(resp, "NEW_LESSONS");
  if (nl) {
    const ls = readJSON(path.join(MEMORY_DIR, "lessons.json"), []);
    ls.push(...nl.map(l => ({ ...l, from_project: state.current_project })));
    writeJSON(path.join(MEMORY_DIR, "lessons.json"), ls);
    log(`  📚 ${nl.length} lessons`);
  }

  const bi = extractJSONArray(resp, "BACKLOG_INFORMED");
  if (bi) {
    const bl = readJSON(path.join(MEMORY_DIR, "backlog.json"), []);
    bi.forEach(u => {
      const item = bl.find(b => b.slug === u.slug);
      if (item) {
        (item.informed_by_main_build = item.informed_by_main_build || []).push({ from_phase: "REFLECT", note: u.note, added_at: new Date().toISOString() });
      }
    });
    writeJSON(path.join(MEMORY_DIR, "backlog.json"), bl);
  }

  const je = extractJSON(resp, "JOURNAL_ENTRY");
  if (je) {
    const dateStr = today();
    const journalPath = path.join(ROOT, "docs", "journal", `${dateStr}-${state.current_project}.md`);
    fs.mkdirSync(path.dirname(journalPath), { recursive: true });
    const url = latestDeploy?.url || state.production_url || "pending";
    fs.writeFileSync(journalPath, `---
title: "${je.title || state.current_project}"
date: ${dateStr}
status: ${latestDeploy?.status === "SUCCESS" ? "live" : "failed"}
url: ${url}
refinement_iterations: ${state.refinement_iteration || 0}
---

## What I Built
${je.summary || ""}

## The Problem I Solved
${je.problem_solved || ""}

## Key Learning
${je.key_learning || ""}

## Adjacent Problems Developing
${je.backlog_thoughts || ""}

## Stats
- Refinement iterations: ${state.refinement_iteration || 0}
- Build errors fixed: ${projectErrors.length}
- Live URL: [${url}](${url})
`);
    log("  📔 Journal written");
  }

  return { ...state, current_phase: "PONDER", ponder_count: 0,
    cycle_count: (state.cycle_count || 0) + 1, status: "SUCCESS",
    last_action: `Reflected on ${state.current_project}`, next_action: "Ponder backlog" };
}

async function runPonder(state, ctx) {
  const count = (state.ponder_count || 0) + 1;
  log(`🤔 PONDER ${count}/3`);

  const resp = await callAI(readPrompt(),
    `PHASE: PONDER. Run ${count}/3. Project finished: ${state.current_project}
Backlog: ${JSON.stringify(ctx.backlog, null, 2)}

Think deeply about one backlog item. Update its notes. Score it.
Output:
// PONDER_UPDATE { "item_pondered", "ponder_count": ${count}, "new_thinking_note", "updated_score", "ready_for_research": bool, "key_insight" }
// BACKLOG_FULL [updated full array]`);

  const bf = resp.match(/\/\/ BACKLOG_FULL\s*\n(\[[\s\S]*?\])\s*\n/);
  if (bf) { try { writeJSON(path.join(MEMORY_DIR, "backlog.json"), JSON.parse(bf[1])); } catch {} }

  const pu = extractJSON(resp, "PONDER_UPDATE");
  const done = count >= 3;

  return { ...state, current_phase: done ? "DISCOVER" : "PONDER", ponder_count: count,
    current_project: done ? null : state.current_project,
    last_action: `Pondered: ${pu?.key_insight?.slice(0, 80) || "backlog item"}`,
    next_action: done ? "Start next cycle" : `Ponder run ${count + 1}/3` };
}

async function runDiscover(state, ctx) {
  log("🔍 DISCOVER — starting next cycle");
  const seeded = ctx.backlog.find(b => b.ready_for_research);
  if (seeded) {
    log(`  ✨ Seeded: ${seeded.slug}`);
    const preload = `# PRE-SEEDED\n**${seeded.title}**\nHypothesis: ${seeded.hypothesis}\nNotes:\n${seeded.thinking_notes.map(n => `- ${n.note}`).join("\n")}`;
    fs.mkdirSync(RESEARCH_DIR, { recursive: true });
    fs.writeFileSync(path.join(RESEARCH_DIR, `investigate-${seeded.slug}.md`), preload);
    seeded.ready_for_research = false;
    writeJSON(path.join(MEMORY_DIR, "backlog.json"), ctx.backlog);
    return { ...state, current_phase: "SCAN", research_phase: "SCAN",
      week: (state.week || 1) + 1, investigated_slugs: [seeded.slug],
      scan_top_5: [seeded.slug], last_action: `Fast-tracked ${seeded.slug}`, next_action: "Scan" };
  }
  return { ...state, current_phase: "SCAN", research_phase: "SCAN",
    week: (state.week || 1) + 1, investigated_slugs: [], scan_top_5: [],
    last_action: "Starting new cycle", next_action: "Scan domains" };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

/** Pre-create every directory ARIA may write to. Prevents ENOENT on first run. */
function ensureDirectories() {
  const dirs = [
    MEMORY_DIR, RESEARCH_DIR, DESIGN_DIR, SPECS_DIR, REFLECTIONS_DIR,
    path.join(ROOT, "docs", "journal"),
    path.join(ROOT, "docs", "_site"),
    path.join(ROOT, "projects"),
  ];
  dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));
  log(`📁 Directories verified (${dirs.length})`);
}

async function main() {
  log(`🤖 ARIA (${MODEL})`);
  ensureDirectories();
  const statePath = path.join(MEMORY_DIR, "state.json");
  let state = readJSON(statePath, {
    current_phase: "DEFINE", current_project: "blairs-academy",
    week: 1, refinement_iteration: 0, cicd_fix_attempts: 0, cycle_count: 0,
    languages_built: [], languages_pending: ["python", "javascript", "go", "rust", "typescript"],
    preview_url: null, production_url: null, status: "READY",
  });

  const nextRun = new Date(Date.now() + 5 * 3600000).toISOString().replace("T", " ").substring(0, 16) + " UTC";
  await sendTelegram(`🚀 *ARIA session started* using ${MODEL}\n📍 Phase: *${state.current_phase}*\n🏗️ Project: *${state.current_project || "none"}*\n⏳ Next run: \`${nextRun}\``);

  log(`Phase: ${state.current_phase} | Week: ${state.week} | Project: ${state.current_project || "none"} | Refinement: ${state.refinement_iteration || 0}/3`);

  const ctx = buildCtx(state);
  let newState;

  try {
    switch (state.current_phase) {
      case "DEFINE":          newState = await runDefine(state, ctx);         break;
      case "DESIGN_RESEARCH": newState = await runDesignResearch(state, ctx); break;
      case "BUILD_CORE":      newState = await runBuildCore(state, ctx);      break;
      case "VALIDATE":        newState = await runValidate(state, ctx);       break;
      case "DEPLOY_STAGING":  newState = await runDeployStaging(state);      break;
      case "DEPLOY_PROD":     newState = await runDeployProd(state);          break;
      case "CICD_FIX":        newState = await runCICDFix(state, ctx);        break;
      case "POLISH":          newState = await runPolish(state, ctx);        break;
      default:
        log(`Unknown phase "${state.current_phase}" — resetting to DEFINE`);
        newState = { ...state, current_phase: "DEFINE" };
    }

    newState.last_run = new Date().toISOString();
    newState.status = newState.status || "SUCCESS";

  } catch (err) {
    log(`❌ FATAL in ${state.current_phase}: ${err.message}`);
    console.error(err.stack);
    appendLog(path.join(MEMORY_DIR, "error_log.json"), {
      phase: state.current_phase, project: state.current_project,
      error_type: "FATAL", error_message: err.message, stack: err.stack?.slice(0, 500),
    });
    newState = { ...state, last_run: new Date().toISOString(), status: "FAILED",
      last_action: `FATAL: ${err.message.slice(0, 100)}`, next_action: "Retry" };
  }

  writeJSON(statePath, newState);
  log(`✅ Done → ${newState.current_phase}: ${newState.next_action}`);

  const statusEmoji = newState.status === "SUCCESS" ? "🏁" : "❌";
  await sendTelegram(`${statusEmoji} *Phase ${state.current_phase} ${newState.status}*\n📝 Action: ${newState.last_action}\n➡️ Next: *${newState.next_action}*`);
}

main().catch(console.error);
