import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { PUT } from "../app/api/songs/save/route.ts";

const publicDirectory = path.resolve("public");
const temporaryDirectory = await mkdtemp(path.join(publicDirectory, ".viewer-save-test-"));

try {
  const nestedDirectory = path.join(temporaryDirectory, "nested");
  await mkdir(nestedDirectory);
  const fixturePath = path.join(nestedDirectory, "fixture.jps");
  const originalContent = "B: Original\nQ: | 1 2 3 |\n";
  const updatedContent = "B: Updated\nQ: | 1 3 5 |\n";
  await writeFile(fixturePath, originalContent, "utf8");
  const relativePath = path.relative(publicDirectory, fixturePath).split(path.sep).join("/");

  const response = await PUT(new Request("http://localhost/api/songs/save", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
    },
    body: JSON.stringify({ path: relativePath, content: updatedContent }),
  }));
  assert.equal(response.status, 200);
  assert.equal((await readFile(fixturePath, "utf8")), updatedContent);

  const forbiddenOrigin = await PUT(new Request("http://localhost/api/songs/save", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      origin: "http://attacker.example",
    },
    body: JSON.stringify({ path: relativePath, content: originalContent }),
  }));
  assert.equal(forbiddenOrigin.status, 403);
  assert.equal((await readFile(fixturePath, "utf8")), updatedContent);

  const traversal = await PUT(new Request("http://localhost/api/songs/save", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
    },
    body: JSON.stringify({ path: "../outside.jps", content: originalContent }),
  }));
  assert.equal(traversal.status, 400);

  console.log("Verified selected JPS file saves and rejects cross-origin and traversal requests.");
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
