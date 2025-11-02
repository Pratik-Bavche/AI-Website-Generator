import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const PlaygroundHeader = () => {
  return (
    <div className="flex justify-between p-4 shadow">
      <div className="flex gap-2 items-center">
        <Image
          src="/logo.svg"
          alt="AI Website Generator Logo"
          width={35}
          height={35}
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
        <h2 className="font-bold text-xl">AI Website Generator</h2>
      </div>
      <Button className="cursor-pointer">Save</Button>
    </div>
  );
};

export default PlaygroundHeader;
