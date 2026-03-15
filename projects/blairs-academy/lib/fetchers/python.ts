import { fetch } from 'undici';

const PYPI_BASE = process.env.PYPI_BASE_URL ?? 'https://pypi.org/pypi';

export async function fetchPythonPackageDocs(pkg: string): Promise<string> {
  const url = `${PYPI_BASE}/${encodeURIComponent(pkg)}/json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch docs for ${pkg}: ${res.status}`);
  }
  const data = await res.json();
  // Simplify to a markdown‑ready string
  return data.info?.description ?? 'No description available.';
}