import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const frameId = searchParams.get("frameId");
    const projectId = searchParams.get("projectId");

    if (!frameId) {
      return NextResponse.json({ error: "frameId is required" }, { status: 400 });
    }

    const frameResult = await db
      .select()
      .from(frameTable)
      //@ts-ignore
      .where(eq(frameTable.frameId, frameId));

    if (!frameResult || frameResult.length === 0) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    const chatResult = await db
      .select()
      .from(chatTable)
      //@ts-ignore
      .where(eq(chatTable.frameId, frameId));

    // Flatten the messages array if needed
    const chatMessages = chatResult.flatMap((chat) => {
      const message = chat.chatMessage;
      // If message is an array, return it as is, otherwise wrap it in array
      return Array.isArray(message) ? message : [message];
    });

    const finalResult = {
      ...frameResult[0],
      chatMessages: chatMessages,
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error("Error fetching frame details:", error);
    return NextResponse.json({ error: "Failed to fetch frame details" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { frameId, messages } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    // Insert new chat message
    const chatResult = await db.insert(chatTable).values({
      chatMessage: messages,
      frameId: frameId,
      createdBy: user.primaryEmailAddress?.emailAddress,
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error saving chat message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function PUT(req:NextRequest) {
  const {designCode,frameId,projectId}=await req.json();
  const result=await db.update(frameTable).set({
    designCode:designCode
  }).where(and(eq(frameTable.frameId,frameId),eq(frameTable.projectId,projectId)))
  return NextResponse.json({result:'Updated'})
}
