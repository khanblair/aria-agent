import Image from 'next/image';
import { FC } from 'react';

interface LanguageCardProps {
  language: string;
  icon: string;
  onSelect?: () => void;
}

const LanguageCard: FC<LanguageCardProps> = ({ language, icon, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {/* Added descriptive alt text for accessibility */}
      <Image src={icon} alt={`${language} icon`} width={64} height={64} />
      <h2 className="mt-2 text-lg font-medium">{language}</h2>
    </button>
  );
};

export default LanguageCard;