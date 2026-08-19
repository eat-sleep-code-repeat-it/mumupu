import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");

const { translate } = await import("../lib/translate.ts");
const input = await readFile(path.join(workspaceRoot, "public", "jps-files", "memory-from-cats.jps"), "utf8");
const output = translate(input);
const expectedPath = path.join(workspaceRoot, "public", "svg-files", "memory-from-cats.svg");
const expected = await readFile(expectedPath, "utf8");

if (output !== expected) {
  throw new Error("translate() output does not match public/svg-files/memory-from-cats.svg");
}

console.log("translate() matches public/svg-files/memory-from-cats.svg");
