import { readFile } from "fs/promises";
import path from "path";

export async function readSvgFromFile(filename: string): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "public/svg-files",
    filename
  );

  try {
    const svgContent = await readFile(filePath, "utf-8");
    return svgContent;
  } catch {
    return "";
  }
}