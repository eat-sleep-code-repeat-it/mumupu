import { NextResponse } from "next/server";
import { translate } from "@/lib/translate";

export async function POST(request: Request) {
  const input = await request.text();
  const svg = translate(input);

  return NextResponse.json({ svg });
}
