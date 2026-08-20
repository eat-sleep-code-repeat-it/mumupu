import { readFile } from "node:fs/promises";

import { translate } from "@/lib/translate";

export async function GET() {
  const jpsPath = new URL("../../../public/jps-files/memory-from-cats.jps", import.meta.url);
  const source = await readFile(jpsPath, "utf8");
  const svg = translate(source);

  return Response.json({
    svg,
  });
}