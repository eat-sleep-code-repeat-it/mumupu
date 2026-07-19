import { readSvgFromFile } from "@/lib/svg";

export async function GET() {
  const svg = await readSvgFromFile("memory-from-cats.svg");

  return Response.json({
    svg,
  });
}