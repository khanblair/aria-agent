import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center p-4">
      {/* Added alt text for accessibility */}
      <Image src="/logo.png" width={40} height={40} alt="Blair’s Academy logo" />
      <h1 className="ml-2 text-xl font-bold">Blair’s Academy</h1>
    </header>
  );
}