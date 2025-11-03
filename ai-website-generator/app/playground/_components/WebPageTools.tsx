import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Copy } from 'lucide-react';

const ViewCodeBlock = ({ children, code }: any) => {
  return (
    <Dialog>

      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className='max-w-4xl max-h-[300px] overflow-auto'>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Source Code
            <Copy className="w-4 h-4 ml-2 cursor-pointer" />
          </DialogTitle>
          <DialogDescription>
            <div>
              <SyntaxHighlighter language="html">
                {code}
              </SyntaxHighlighter>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCodeBlock;
