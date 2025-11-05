import { PricingTable } from '@clerk/nextjs';
import React from 'react';

const Pricing = () => {
  return (
    <div className='flex flex-col items-center h-[80%] w-full justify-center'>
      <h2 className='font-bold text-3xl my-5'>Pricing</h2>
      <div className='flex w-[800px]'>
      <PricingTable />
      </div>
    </div>
  );
}

export default Pricing;
