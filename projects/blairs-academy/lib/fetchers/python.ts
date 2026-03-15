import { parsePythonDocs } from '@/lib/parsers/python';
import { DOCS_SOURCE_URL } from '@/lib/constants';

export async function fetchDocsForLanguage(lang: 'python') {
  // Example: fetch the built‑ins page
  const response = await fetch(`${DOCS_SOURCE_URL}/python/${lang}/builtins.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Python docs: ${response.status}`);
  }
  const raw = await response.json();
  return parsePythonDocs(raw);
}