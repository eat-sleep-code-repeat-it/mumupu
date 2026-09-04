#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { transposeScriptByAdjustment } from "../lib/transpose-core.mjs";

function parseArgs(argv) {
  let adjustment = null;
  let inputFile = "";
  let outputFile = "";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if ((arg === "-a" || arg === "--adjustment") && i + 1 < argv.length) {
      adjustment = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if ((arg === "-i" || arg === "--input") && i + 1 < argv.length) {
      inputFile = argv[i + 1];
      i += 1;
      continue;
    }
    if ((arg === "-o" || arg === "--output") && i + 1 < argv.length) {
      outputFile = argv[i + 1];
      i += 1;
    }
  }

  return { adjustment, inputFile, outputFile };
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function printUsage() {
  console.error("Usage: node scripts/transpose.mjs -a <integer> [-i input.jps] [-o output.jps]");
}

async function main() {
  const { adjustment, inputFile, outputFile } = parseArgs(process.argv.slice(2));

  if (!Number.isInteger(adjustment)) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const source = inputFile
    ? await readFile(path.resolve(inputFile), "utf8")
    : await readStdin();

  const transposed = transposeScriptByAdjustment(source, adjustment);

  if (outputFile) {
    await writeFile(path.resolve(outputFile), transposed, "utf8");
  } else {
    process.stdout.write(transposed);
  }
}

void main();
