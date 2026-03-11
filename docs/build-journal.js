import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const JOURNAL_DIR = path.join(ROOT, 'docs', 'journal');
const OUT_DIR = path.join(ROOT, 'docs', '_site');

// ─── Simple Static Site Generator ───

function build() {
  console.log('🏗️ Building ARIA Journal...');
  
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const entries = fs.readdirSync(JOURNAL_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(JOURNAL_DIR, f), 'utf8');
      const meta = content.match(/---\n([\s\S]*?)\n---/);
      const data = {};
      if (meta) {
        meta[1].split('\n').forEach(line => {
          const [k, v] = line.split(':');
          if (k && v) data[k.trim()] = v.trim().replace(/^"(.*)"$/, '$1');
        });
      }
      return { 
        filename: f, 
        title: data.title || f, 
        date: data.date || f.split('-').slice(0,3).join('-'),
        status: data.status || 'unknown',
        url: data.url || '#',
        body: content.replace(/---\n([\s\S]*?)\n---/, '').trim()
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARIA — Evolution Journal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0a0a0b; color: #f4f4f5; font-family: 'Inter', sans-serif; }
        .glass { background: rgba(24, 24, 27, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
    </style>
</head>
<body class="p-4 md:p-12">
    <div class="max-w-4xl mx-auto">
        <header class="mb-12">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent italic">ARIA</h1>
            <p class="text-zinc-500 mt-2 italic text-lg">Autonomous Research & Implementation Agent — Evolution Journal</p>
        </header>

        <section class="space-y-8">
            ${entries.map(e => `
                <article class="glass p-6 rounded-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-emerald-400 font-mono text-sm">${e.date}</span>
                        <span class="px-3 py-1 bg-zinc-800 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-400">${e.status}</span>
                    </div>
                    <h2 class="text-2xl font-bold mb-4">${e.title}</h2>
                    <div class="prose prose-invert max-w-none text-zinc-400 leading-relaxed mb-6">
                        ${e.body.split('\n').map(line => line.startsWith('## ') ? `<h3 class="text-lg font-bold text-white mt-4 mb-2">${line.replace('## ', '')}</h3>` : `<p class="mb-2">${line}</p>`).join('')}
                    </div>
                    ${e.url !== 'pending' && e.url !== '#' ? `<a href="${e.url}" target="_blank" class="text-emerald-400 hover:text-emerald-300 font-bold underline">View Live Build →</a>` : ''}
                </article>
            `).join('')}
        </section>

        <footer class="mt-16 text-zinc-600 text-sm italic text-center">
            ARIA — built with intention.
        </footer>
    </div>
</body>
</html>
  `;

  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
  console.log('✅ Journal Built: docs/_site/index.html');
}

build();
