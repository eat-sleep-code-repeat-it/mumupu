import { readdir } from "node:fs/promises";
import path from "node:path";

type JpsFile = {
  name: string;
  path: string;
};

type JpsFolder = {
  name: string;
  path: string;
  files: JpsFile[];
  folders: JpsFolder[];
};

async function readJpsFolder(directoryPath: string, relativePath: string): Promise<JpsFolder | null> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".jps"))
    .map((entry) => ({
      name: entry.name,
      path: path.posix.join(relativePath, entry.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const folders = (await Promise.all(entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => readJpsFolder(
      path.join(directoryPath, entry.name),
      path.posix.join(relativePath, entry.name),
    ))))
    .filter((folder): folder is JpsFolder => folder !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (files.length === 0 && folders.length === 0) {
    return null;
  }

  return {
    name: path.basename(directoryPath),
    path: relativePath,
    files,
    folders,
  };
}

export async function GET() {
  const publicPath = path.join(process.cwd(), "public");
  const songsPath = path.join(publicPath, "songs");
  const entries = await readdir(songsPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".jps"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const publicFolder = await readJpsFolder(publicPath, "");

  return Response.json({
    files,
    folders: publicFolder?.folders ?? [],
  });
}
