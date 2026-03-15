import Image from 'next/image';
import Link from 'next/link';

interface LanguageCardProps {
  name: string;
  slug: string;
  icon: string; // path to icon image
  color: string;
}

export default function LanguageCard({
  name,
  slug,
  icon,
  color,
}: LanguageCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className={`flex flex-col items-center p-4 rounded-lg shadow hover:shadow-lg transition ${color}`}
    >
      {/* ✅ Added alt text that describes the language */}
      <Image src={icon} alt={`${name} language icon`} width={64} height={64} />
      <span className="mt-2 text-lg font-medium">{name}</span>
    </Link>
  );
}