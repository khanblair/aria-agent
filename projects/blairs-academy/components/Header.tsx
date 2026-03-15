import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Blair&apos;s Academy
        </h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          Programming language API docs, simplified
        </p>
      </div>
    </header>
  );
};

export default Header;