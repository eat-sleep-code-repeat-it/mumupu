"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [svg, setSvg] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileFilter, setFileFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [renderError, setRenderError] = useState("");
  const [preview, setPreview] = useState(false);
  const [mode, setMode] = useState<"script" | "preview">("script");
  const fileRequestRef = useRef<AbortController | null>(null);

  async function renderSvg(script: string, signal?: AbortSignal): Promise<string> {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: script,
      signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.svg;
  }

  useEffect(() => {
    const controller = new AbortController();

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

    fetch("/api/songs", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json() as Promise<{ files: string[] }>;
      })
      .then((data) => setFiles(data.files))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load song list:", error);
        setFileError("Could not load songs.");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!text) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      renderSvg(text, controller.signal)
        .then((nextSvg) => {
          setSvg(nextSvg);
          setRenderError("");
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error("Automatic translation failed:", error);
          setRenderError("Translation failed. Check the script and try again.");
        });
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [text]);

  async function handlePreview() {
    try {
      const nextSvg = await renderSvg(text);
      setSvg(nextSvg);
      setRenderError("");
      setPreview(true);
      setMode("preview");
    } catch (error) {
      console.error("Translation failed:", error);
      setRenderError("Translation failed. Check the script and try again.");
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

  async function handleSelectFile(fileName: string) {
    fileRequestRef.current?.abort();
    const controller = new AbortController();
    fileRequestRef.current = controller;
    setFileError("");

    try {
      const response = await fetch(`/songs/${encodeURIComponent(fileName)}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const content = await response.text();
      setText(content);
      setSelectedFile(fileName);
      setPreview(false);
      setMode("script");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Failed to load song:", error);
      setFileError(`Could not load ${fileName}.`);
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
  const visibleFiles = files.filter((fileName) =>
    fileName.toLocaleLowerCase().includes(fileFilter.trim().toLocaleLowerCase()),
  );

  return (
    <main className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="flex h-14 items-center gap-2 border-b bg-gray-100 px-4">
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
      </nav>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-44 shrink-0 flex-col border-r border-gray-300 bg-gray-50 sm:w-64">
          <div className="border-b border-gray-300 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">Songs</h2>
              <span className="text-xs text-gray-500">{visibleFiles.length}</span>
            </div>
            <input
              type="search"
              value={fileFilter}
              onChange={(event) => setFileFilter(event.target.value)}
              placeholder="Filter files"
              aria-label="Filter song files"
              className="w-full border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-600"
            />
            {fileError && (
              <p className="mt-2 text-xs text-red-700" role="alert">{fileError}</p>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            {visibleFiles.map((fileName) => (
              <button
                key={fileName}
                type="button"
                title={fileName}
                onClick={() => handleSelectFile(fileName)}
                className={`block w-full truncate px-3 py-2 text-left text-sm ${
                  selectedFile === fileName
                    ? "bg-blue-100 font-medium text-blue-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-4">
          {preview ? (
            renderError ? (
              <div className="p-4 text-red-700" role="alert">
                {renderError}
              </div>
            ) : (
              <div
                className="h-full w-full overflow-auto bg-white"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )
          ) : (
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              wrap="off"
              aria-label="JPS script"
              className="h-full w-full resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />
          )}
        </div>
      </div>
    </main>
  );
}