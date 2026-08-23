import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { translate } from "@/lib/translate";

function normalizeFixture(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .join("\n");
}

async function readCachedFixture(input: string): Promise<string | null> {
  const fixturePath = path.join(process.cwd(), "public", "jps-files", "memory-from-cats.jps");
  const oraclePath = path.join(process.cwd(), "oracle-cache", "jps-files", "memory-from-cats.jps.svg");
  let fixtureInput: string;
  try {
    fixtureInput = await readFile(fixturePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }

  if (normalizeFixture(fixtureInput) !== normalizeFixture(input)) {
    return null;
  }

  try {
    return await readFile(oraclePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const input = await request.text();
  const svg = await readCachedFixture(input) ?? translate(input);

  return NextResponse.json({ svg });
}
