"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { UserDetailContext } from "@/context/UserDetailContext";

export function AppSidebar() {
  const [projectList,setProjectList]=useState([])
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-1 items-center">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={35}
                  height={35}
                  style={{ height: "auto" }}
                />
                <h2 className="font-bold text-xl">Ai Website Generator</h2>
              </div>
              <Link href="/workspace" className="mt-5 w-full">
              <Button className="w-full">
                  Add New Project <PlusIcon/>
              </Button>
              </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup >
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            {projectList.length==0 && <h2 className="text-sm px-2 text-gray-500">No Projects found</h2> }
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 border rounded-xl space-y-3 bg-secondary">
          <h2 className="flex justify-between items-center">
            Remaining credits:
            <span className="font-bold">{userDetail?.credits ?? 0}</span>
          </h2>

          <Progress value={33} />

          <Button className="w-full cursor-pointer">Upgrade to Unlimited</Button>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <UserButton />
          <Button variant={'ghost'} className="cursor-pointer">Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}