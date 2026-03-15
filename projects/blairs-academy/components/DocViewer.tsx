"use client";

import { FC } from 'react';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { APIInfo } from '@/lib/fetchers/python';

type DocViewerProps = {
  api: APIInfo;
};

export const DocViewer: FC<DocViewerProps> = ({ api }) => {
  return (
    <article className="prose lg:prose-xl max-w-none p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{api.title}</h1>
        <button
          onClick={() => navigator.clipboard.writeText(api.example)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          title="Copy example to clipboard"
        >
          <ClipboardIcon className="h-5 w-5" />
          Copy example
        </button>
      </header>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p>{api.description}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Signature</h2>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          {api.signature}
        </pre>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Parameters</h2>
        <ul className="list-disc list-inside">
          {api.parameters.map((p) => (
            <li key={p.name}>
              <code className="font-mono">{p.name}</code> – {p.description}
              {p.optional && <span className="text-gray-500"> (optional)</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Return Type</h2>
        <p>{api.returnType}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Example</h2>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
          {api.example}
        </pre>
      </section>
    </article>
  );
};