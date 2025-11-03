import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const PlaygroundHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Logo and Title */}
      <div className="flex gap-2 items-center">
        <Image
          src="/logo.svg"
          alt="AI Website Generator Logo"
          width={35}
          height={35}
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">
          AI Website Generator
        </h2>
      </div>

      {/* Styled Save Button */}
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer shadow hover:shadow-md"
      >
        Save
      </Button>
    </div>
  );
};

export default PlaygroundHeader;
