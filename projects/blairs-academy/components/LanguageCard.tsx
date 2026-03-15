import Image from 'next/image';
import Link from 'next/link';

type Props = {
  language: string;
  displayName: string;
  color: string;
};

export default function LanguageCard({ language, displayName, color }: Props) {
  return (
    <Link href={`/${language}`} className="block">
      <div className={`rounded-lg p-4 shadow-md hover:shadow-lg transition ${color}`}>
        {/* Added alt text for the language icon */}
        <Image
          src={`/icons/${language}.svg`}
          width={48}
          height={48}
          alt={`${displayName} icon`}
        />
        <h2 className="mt-2 text-center text-lg font-medium">{displayName}</h2>
      </div>
    </Link>
  );
}