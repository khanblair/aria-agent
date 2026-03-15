import React from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const highlighted = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.javascript,
    language
  );

  return (
    <pre
      className="rounded bg-gray-900 text-gray-100 p-4 overflow-x-auto focus:outline-none"
      tabIndex={0}
    >
      <code
        dangerouslySetInnerHTML={{ __html: highlighted }}
        className={`language-${language}`}
      />
    </pre>
  );
}