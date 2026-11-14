import { NextResponse } from "next/server";

import { MAX_PNG_BYTES, parsePngToJps, PngToJpsError } from "@/lib/png-to-jps";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = MAX_PNG_BYTES + 1024 * 1024;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "PNG images must be 10 MB or smaller." }, { status: 413 });
  }

  const formData = await request.formData();
  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Choose a PNG image to parse." }, { status: 400 });
  }

  if (image.size > MAX_PNG_BYTES) {
    return NextResponse.json({ error: "PNG images must be 10 MB or smaller." }, { status: 413 });
  }

  try {
    const result = await parsePngToJps(Buffer.from(await image.arrayBuffer()), image.name);
    return NextResponse.json({
      script: result.script,
      outputPath: result.outputPath,
      confidence: result.confidence,
      warnings: result.warnings,
    });
  } catch (error) {
    if (error instanceof PngToJpsError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("PNG-to-JPS conversion failed", error);
    return NextResponse.json(
      { error: "Local OCR failed. Check the server logs and try again." },
      { status: 500 },
    );
  }
}
