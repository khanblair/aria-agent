"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LanguageCard from './LanguageCard';

const languages = [
  { language: 'python', displayName: 'Python', icon: '/icons/python.svg' },
  { language: 'javascript', displayName: 'JavaScript', icon: '/icons/js.svg' },
  // Add more languages as needed
];

const LanguageSelector = () => {
  const router = useRouter();

  const handleSelect = (lang: string) => {
    router.push(`/${lang}`);
  };

  return (
    <section aria-label="Select a programming language" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {languages.map((lang) => (
        <button
          key={lang.language}
          onClick={() => handleSelect(lang.language)}
          className="focus:outline-none"
          aria-label={`Open ${lang.displayName} documentation`}
        >
          <LanguageCard {...lang} />
        </button>
      ))}
    </section>
  );
};

export default LanguageSelector;