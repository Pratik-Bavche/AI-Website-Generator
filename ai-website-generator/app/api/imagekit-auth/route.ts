import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "Missing ImageKit private key" },
      { status: 500 }
    );
  }

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  });

  const authParams = imagekit.getAuthenticationParameters();
  return NextResponse.json(authParams);
}
