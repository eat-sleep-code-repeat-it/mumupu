"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  useEffect(() => {
    fetch("/jps-files/memory-from-cats.jps")
      .then((response) => {
        if (!response.ok) {
          return "";
        }
        return response.text();
      })
      .then((content) => setText(content))
      .catch((error) => {
        setText("");
        console.error("Failed to load file:", error);
      });
  }, []);

  return (
    <main className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="flex h-14 items-center gap-2 border-b bg-gray-100 px-4">
        <button className="rounded px-3 py-1 hover:bg-gray-200">Open</button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Save</button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Script</button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Preview</button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Export</button>
      </nav>

      {/* Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          wrap="off"
          className="h-full w-full resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
          />
      </div>
    </main>
  );
}