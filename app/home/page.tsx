"use client";

import { useEffect, useState } from "react";
import { translate } from "@/lib/translate";

export default function Home() {
  const [text, setText] = useState("");
  const [svg, setSvg] = useState("");
  const [preview, setPreview] = useState(false);
  const [mode, setMode] = useState<"script" | "preview">("script");

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

  async function handlePreview() {
    const generatedSvg = translate(text);
    
    /*
    const response = await fetch("/api/svg");
    const data = await response.json();
    const generatedSvg = data.svg;
    */

    setSvg(generatedSvg);
    setPreview(true);
     setMode("preview");
  }

  function handleScript() {
    setPreview(false);
    setMode("script");
  }

  const buttonClass = (active: boolean) =>
    `rounded px-3 py-1 ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-black hover:bg-gray-300"
    }`;

  return (
    <main className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="flex h-14 items-center gap-2 border-b bg-gray-100 px-4">
        <button className="rounded px-3 py-1 hover:bg-gray-200">Open</button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Save</button>
        <button 
          onClick={handleScript}
          className={buttonClass(mode === "script")}>
          Script
        </button>
        <button 
          onClick={handlePreview}
          className={buttonClass(mode === "preview")}>
          Preview
        </button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Export</button>
      </nav>

      {/* Editor */}
      <div className="flex-1 p-4">
         {preview ? (
          <div
            className="h-full w-full bg-white"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          wrap="off"
          className="h-full w-full resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
          />
        )}
      </div>
    </main>
  );
}