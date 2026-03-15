import React, { useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, atomLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const { resolvedTheme } = useTheme();
  const preRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Simple visual feedback (could be replaced with toast)
      if (preRef.current) {
        preRef.current.style.outline = '2px solid #4caf50';
        setTimeout(() => {
          if (preRef.current) preRef.current.style.outline = 'none';
        }, 800);
      }
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
        aria-label="Copy code to clipboard"
      >
        Copy
      </button>

      <pre
        ref={preRef}
        className="overflow-x-auto rounded-md"
        tabIndex={0}
        role="region"
        aria-label={`Code example in ${language}`}
      >
        <SyntaxHighlighter
          language={language}
          style={resolvedTheme === 'dark' ? atomDark : atomLight}
          customStyle={{ margin: 0, background: 'transparent' }}
        >
          {code}
        </SyntaxHighlighter>
      </pre>
    </div>
  );
};

export default CodeBlock;