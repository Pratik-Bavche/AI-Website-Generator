import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser(); 

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  // Check if user already exists
  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress ?? ""));

  // If not, insert new user
  if (userResult.length === 0) {
    await db.insert(usersTable).values({
      name: user.fullName ?? "NA",
      email: user.primaryEmailAddress?.emailAddress ?? "",
    });
  }

  return NextResponse.json({ user });
}
