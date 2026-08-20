"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [svg, setSvg] = useState("");
  const [preview, setPreview] = useState(false);
  const [mode, setMode] = useState<"script" | "preview">("script");

  async function renderSvg(script: string): Promise<string> {
    const response = await fetch("/api/jianpu", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: script,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.svg;
  }

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
    try {
      const nextSvg = await renderSvg(text);
      setSvg(nextSvg);
      setPreview(true);
      setMode("preview");
    } catch (error) {
      console.error("Translation failed:", error);
      setSvg("<div style=\"color:red; padding:16px;\">Translation failed. Check console for details.</div>");
      setPreview(true);
      setMode("preview");
    }
  }

  async function handleSave() {
    try {
      const svgToSave = await renderSvg(text);
      setSvg(svgToSave);
      const title = text.match(/^B:\s*(.+)$/m)?.[1]?.trim() || "score";
      const filename = `${title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")}.svg`;
      const blob = new Blob([svgToSave], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Save failed:", error);
    }
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
        <button
          onClick={handleSave}
          className="rounded px-3 py-1 hover:bg-gray-200">
          Save
        </button>
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