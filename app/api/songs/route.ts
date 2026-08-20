import { readdir } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const songsPath = path.join(process.cwd(), "public", "songs");
  const entries = await readdir(songsPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  return Response.json({
    files,
  });
}
