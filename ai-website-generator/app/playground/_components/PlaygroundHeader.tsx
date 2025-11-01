import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

const PlaygroundHeader = () => {
  return (
    <div className="flex justify-between p-4 shadow">
      <div className="flex gap-1 items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={35}
          height={35}
          style={{ height: "auto" }}
        />
        <h2 className="font-bold text-xl">AI Website Generator</h2>
      </div>
      <Button className='cursor-pointer'>Save</Button>
    </div>
  );
};

export default PlaygroundHeader;
