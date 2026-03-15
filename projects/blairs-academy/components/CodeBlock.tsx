import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

type Props = {
  language: string;
  code: string;
};

export default function CodeBlock({ language, code }: Props) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [code, language]);

  return (
    <pre
      ref={ref}
      className={`language-${language} bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto`}
      aria-label={`Code example in ${language}`}
    >
      <code>{code}</code>
    </pre>
  );
}