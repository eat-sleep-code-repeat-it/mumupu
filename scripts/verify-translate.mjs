import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");

const { translate } = await import("../lib/translate.ts");
const input = await readFile(path.join(workspaceRoot, "input", "cat.jps"), "utf8");
const output = translate(input);
const expectedPath = path.join(workspaceRoot, "out", "cat.svg");
const expected = await readFile(expectedPath, "utf8");

if (output !== expected) {
  throw new Error("translate() output does not match out/cat.svg");
}

console.log("translate() matches out/cat.svg");
