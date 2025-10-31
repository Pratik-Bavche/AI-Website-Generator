import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const MenuOptions=[
    {
        name:"Pricing",
        path:"/pricing"
    },
    {
        name:"Contact Us",
        path:"/contact-us"
    }
]

const Header = () => {
  return (
    <div className='flex items-center justify-between p-4 shadow'>
      {/* Logo */}
      <div className='flex gap-1 items-center'>
        <Image src={'/logo.svg'} alt='logo' width={35} height={35} style={{height:"auto"}}/>
        <h2 className='font-bold text-xl'>Ai Website Generator</h2>
      </div>

      {/* Menu Options */}
        <div className='flex gap-3'>
            {MenuOptions.map((menu,index)=>(
                <Button className='cursor-pointer' variant={"ghost"} key={index}>{menu.name}</Button>
            ))}
        </div>

        {/* Get Started Button */}
        <div>
            <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
            <Button className='cursor-pointer'>Get Started <ArrowRight/></Button>
            </SignInButton>
        </div>
    </div>
  );
}

export default Header;
