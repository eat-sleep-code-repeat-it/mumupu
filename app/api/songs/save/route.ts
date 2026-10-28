import { lstat, realpath, writeFile } from "node:fs/promises";
import path from "node:path";

function isWithinDirectory(directory: string, filePath: string): boolean {
  const relativePath = path.relative(directory, filePath);
  return relativePath !== "" && !relativePath.startsWith(`..${path.sep}`) && relativePath !== ".." && !path.isAbsolute(relativePath);
}

export async function PUT(request: Request) {
  const origin = request.headers.get("origin");
  let requestOrigin: string;
  try {
    if (!origin) {
      return Response.json({ error: "Save requests must come from this site" }, { status: 403 });
    }
    requestOrigin = new URL(origin).origin;
  } catch (error) {
    if (error instanceof TypeError) {
      return Response.json({ error: "Save requests must come from this site" }, { status: 403 });
    }
    throw error;
  }
  if (requestOrigin !== new URL(request.url).origin) {
    return Response.json({ error: "Save requests must come from this site" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1_000_000) {
    return Response.json({ error: "Script is too large to save" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid save request" }, { status: 400 });
    }
    throw error;
  }

  if (
    typeof body !== "object"
    || body === null
    || !("path" in body)
    || typeof body.path !== "string"
    || !("content" in body)
    || typeof body.content !== "string"
  ) {
    return Response.json({ error: "A file path and script content are required" }, { status: 400 });
  }

  if (Buffer.byteLength(body.content, "utf8") > 1_000_000) {
    return Response.json({ error: "Script is too large to save" }, { status: 413 });
  }

  const pathParts = body.path.split("/");
  if (
    pathParts.length === 0
    || pathParts.some((part) => !part || part === "." || part === ".." || part.includes("\\"))
    || path.extname(pathParts.at(-1) ?? "").toLowerCase() !== ".jps"
  ) {
    return Response.json({ error: "Only existing .jps files can be saved" }, { status: 400 });
  }

  const publicDirectory = path.resolve(process.cwd(), "public");
  const targetPath = path.resolve(publicDirectory, ...pathParts);
  if (!isWithinDirectory(publicDirectory, targetPath)) {
    return Response.json({ error: "The selected file is outside the public directory" }, { status: 400 });
  }

  const publicRealPath = await realpath(publicDirectory);
  let targetRealPath: string;
  let targetStats;
  try {
    [targetRealPath, targetStats] = await Promise.all([realpath(targetPath), lstat(targetPath)]);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return Response.json({ error: "The selected .jps file does not exist" }, { status: 404 });
    }
    throw error;
  }
  if (!isWithinDirectory(publicRealPath, targetRealPath) || targetStats.isSymbolicLink() || !targetStats.isFile()) {
    return Response.json({ error: "Only regular .jps files inside the public directory can be saved" }, { status: 400 });
  }

  await writeFile(targetPath, body.content, "utf8");
  return Response.json({ saved: true });
}
