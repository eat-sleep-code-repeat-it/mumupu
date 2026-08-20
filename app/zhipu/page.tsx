"use client";

import { useEffect, useState } from "react";

export default function Zhipu() {
  const [text, setText] = useState("");
  const [songFiles, setSongFiles] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [svg, setSvg] = useState("");
  const [mode, setMode] = useState<"script" | "preview" | "zhipuPreview">("script");
  const [loadingMode, setLoadingMode] = useState<"preview" | "zhipuPreview" | null>(null);

  async function renderSvg(script: string): Promise<string> {
    const response = await fetch("/api/translate", {
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

  useEffect(() => {
    fetch("/api/songs")
      .then((response) => {
        if (!response.ok) {
          return { files: [] as string[] };
        }
        return response.json() as Promise<{ files: string[] }>;
      })
      .then((data) => setSongFiles(data.files))
      .catch((error) => {
        setSongFiles([]);
        console.error("Failed to load songs:", error);
      });
  }, []);

  async function handleSongSelect(file: string) {
    setMode("script");
    try {
      const response = await fetch(`/songs/${encodeURIComponent(file)}`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const content = await response.text();
      setSelectedSong(file);
      setText(content);
    } catch (error) {
      console.error("Failed to load selected song:", error);
    }
  }

  async function handlePreview() {
    if (loadingMode) {
      return;
    }

    setLoadingMode("preview");
    try {
      const nextSvg = await renderSvg(text);
      setSvg(nextSvg);
      setMode("preview");
    } catch (error) {
      console.error("Preview failed:", error);
      setSvg("<div style=\"color:red; padding:16px;\">Preview failed. Check console for details.</div>");
      setMode("preview");
    } finally {
      setLoadingMode(null);
    }
  }

  async function handleZhipuPreview() {
    if (loadingMode) {
      return;
    }

    setLoadingMode("zhipuPreview");
    try {
      const response = await fetch("/api/jianpu", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
        body: text,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setSvg(data.svg);
      setMode("zhipuPreview");
    } catch (error) {
      console.error("Zhipu preview failed:", error);
      setSvg("<div style=\"color:red; padding:16px;\">Zhipu preview failed. Check console for details.</div>");
      setMode("zhipuPreview");
    } finally {
      setLoadingMode(null);
    }
  }

  function handleScript() {
    setMode("script");
  }

  const buttonClass = (active: boolean) =>
    `rounded px-3 py-1 ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-black hover:bg-gray-300"
    }`;

  const isLoadingPreview = loadingMode === "preview";
  const isLoadingZhipuPreview = loadingMode === "zhipuPreview";
  const isAnyLoading = loadingMode !== null;

  return (
    <main className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="flex h-14 items-center gap-2 border-b bg-gray-100 px-4">
        <button className="rounded px-3 py-1 hover:bg-gray-200">Open</button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Save</button>
        <button
          onClick={handleScript}
          disabled={isAnyLoading}
          className={`${buttonClass(mode === "script")} ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
          Script
        </button>
        <button
          onClick={() => {
            void handlePreview();
          }}
          disabled={isAnyLoading}
          className={`${buttonClass(mode === "preview")} ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
          {isLoadingPreview ? "Previewing..." : "Preview"}
        </button>
        <button
          onClick={() => {
            void handleZhipuPreview();
          }}
          disabled={isAnyLoading}
          className={`${buttonClass(mode === "zhipuPreview")} ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
          {isLoadingZhipuPreview ? "zhipuPreviewing..." : "zhipuPreview"}
        </button>
        <button className="rounded px-3 py-1 hover:bg-gray-200">Export</button>
      </nav>

      {/* Editor */}
      <div className="min-h-0 flex-1 p-4">
        <div className="flex h-full min-h-0 gap-4">
          <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col rounded border border-gray-300 bg-gray-50 p-3">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Songs</h2>
            <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden text-sm text-gray-800">
              {songFiles.map((file) => (
                <li key={file}>
                  <button
                    type="button"
                    onClick={() => {
                      void handleSongSelect(file);
                    }}
                    className={`w-full truncate rounded px-2 py-1 text-left ${
                      selectedSong === file
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200"
                    }`}>
                    {file}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          {mode === "script" ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              wrap="off"
              className="h-full min-h-0 w-full min-w-0 resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          ) : (
            <div className="h-full min-h-0 w-full min-w-0 overflow-auto rounded border border-gray-300 bg-white p-3">
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
