// Central entry point that lazily loads language‑specific fetchers.
// This reduces the initial bundle size.

export async function getFetcher(language: string) {
  switch (language) {
    case "python":
      const { fetchPythonDocs } = await import("./fetchers/python");
      return fetchPythonDocs;
    // Future languages can be added here with their own dynamic import.
    default:
      throw new Error(`No fetcher available for language: ${language}`);
  }
}