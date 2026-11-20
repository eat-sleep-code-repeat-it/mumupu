import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import CircleOfFifths from "../home/circle-of-fifths";

function parseMarkdownTable(markdown: string): string[][] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()))
    .filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

export default async function HelpPage() {
  const markdown = await readFile(
    path.join(process.cwd(), "docs", "da-diao-yin-jie.md"),
    "utf8",
  );
  const [headers = [], ...rows] = parseMarkdownTable(markdown);

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Help</h1>
          <Link href="/" className="rounded bg-gray-200 px-3 py-1 text-black hover:bg-gray-300">
            Home
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-gray-800">
                {headers.map((header) => (
                  <th key={header} scope="col" className="px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-300">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CircleOfFifths />
      </div>
    </main>
  );
}
