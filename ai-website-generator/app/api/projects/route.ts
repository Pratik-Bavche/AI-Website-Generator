import { db } from "@/config/db";
import { chatTable, frameTable, projectTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const {projectId,frameId,messages}=await req.json();
        const user=await currentUser();

        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 401 });
        }

        if (!projectId || !frameId || !messages) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //create project
        const projectResult=await db.insert(projectTable).values({
            projectId:projectId,
            createdBy:user.primaryEmailAddress?.emailAddress
        })

        //create frame
        const frameResult=await db.insert(frameTable).values({
            frameId:frameId,
            projectId:projectId
        })

        //create user message
        const chatResult=await db.insert(chatTable).values({
            chatMessage:messages,
            frameId:frameId,
            createdBy:user.primaryEmailAddress?.emailAddress
        })

        return NextResponse.json({
            projectId,frameId,messages
        })
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}