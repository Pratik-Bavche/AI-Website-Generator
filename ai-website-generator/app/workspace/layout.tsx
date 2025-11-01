import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';

const WorkspaceLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <AppHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
