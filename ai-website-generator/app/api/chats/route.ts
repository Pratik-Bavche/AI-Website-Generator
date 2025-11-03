import { db } from "@/config/db";
import { chatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { messages, frameId } = await req.json();

    if (!messages || !frameId) {
      return NextResponse.json({ error: "Missing messages or frameId" }, { status: 400 });
    }

    const result = await db
      .update(chatTable)
      .set({ chatMessage: messages })
      .where(eq(chatTable.frameId, frameId));

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating chat messages:", error);
    return NextResponse.json({ error: "Failed to update chat messages" }, { status: 500 });
  }
}
