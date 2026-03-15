import React from 'react';

interface LanguageCardProps {
  language: string;
  displayName: string;
  icon: string;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  displayName,
  icon,
}) => {
  return (
    <article
      className="flex flex-col items-center p-4 rounded-lg shadow hover:shadow-lg transition"
      aria-label={`Language card for ${displayName}`}
    >
      {/* Alt text is required for screen‑readers */}
      <img src={icon} alt={`Icon representing ${displayName}`} className="w-12 h-12 mb-2" />
      <h3 className="text-lg font-medium">{displayName}</h3>
      <p className="text-sm text-gray-500">{language}</p>
    </article>
  );
};

export default LanguageCard;