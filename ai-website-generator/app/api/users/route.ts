import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "User email missing" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ user: existingUser[0] });
    }

    const data = {
      name: user.fullName ?? "NA",
      email,
      credits: 5,
    };

    const [newUser] = await db.insert(usersTable).values(data).returning();

    return NextResponse.json({ user: newUser });
  } catch (err) {
    console.error("/api/users error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
