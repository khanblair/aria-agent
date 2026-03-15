import React from "react";

interface LanguageCardProps {
  language: string;
  displayName: string;
  icon: string;
  description: string;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  displayName,
  icon,
  description,
}) => {
  return (
    <a
      href={`/${language}`}
      className="group flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
      aria-label={`Open documentation for ${displayName}`}
    >
      {/* Explicit alt text for the icon */}
      <img src={icon} alt={`${displayName} logo`} className="w-12 h-12 mb-2" />
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {displayName}
      </h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
        {description}
      </p>
    </a>
  );
};

export default LanguageCard;