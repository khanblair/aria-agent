/**
 * Minimal fetchers for each language.
 * In a real product you would parse the official docs HTML / JSON
 * and extract a structured list of endpoints. Here we return a
 * single placeholder entry per language to keep the demo simple.
 */

export async function fetchFromOfficialDocs(lang: string) {
  // Placeholder – replace with real scraping/parsing logic.
  switch (lang) {
    case 'python':
      return {
        endpoint: 'builtins',
        title: 'Python Built‑ins',
        content: 'Common built‑in functions such as print, len, range, enumerate, zip.',
        example: `print("Hello, world!")\nfor i, val in enumerate([10, 20, 30]):\n    print(i, val)`,
      };
    case 'javascript':
      return {
        endpoint: 'Array',
        title: 'Array.prototype.map',
        content: 'Creates a new array populated with the results of calling a provided function on every element.',
        example: `const nums = [1,2,3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled); // [2,4,6]`,
      };
    case 'go':
      return {
        endpoint: 'fmt',
        title: 'fmt.Printf',
        content: 'Formats according to a format specifier and writes to standard output.',
        example: `fmt.Printf("Hello %s\\n", "world")`,
      };
    case 'rust':
      return {
        endpoint: 'Vec',
        title: 'Vec::new',
        content: 'Creates a new, empty vector.',
        example: `let mut v = Vec::new();\nv.push(1);\nprintln!("{:?}", v); // [1]`,
      };
    case 'typescript':
      return {
        endpoint: 'Array',
        title: 'Array.map',
        content: 'Creates a new array with the results of calling a provided function on every element.',
        example: `const nums: number[] = [1,2,3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled); // [2,4,6]`,
      };
    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
}

/**
 * Returns true if the cached entry is older than 24 hours.
 */
export function isStale(fetchedAt: string) {
  const fetched = new Date(fetchedAt);
  const now = new Date();
  const diff = now.getTime() - fetched.getTime();
  return diff > 24 * 60 * 60 * 1000; // 24 h in ms
}