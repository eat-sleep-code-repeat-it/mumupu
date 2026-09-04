"use client";

import { useEffect, useState } from "react";

type SaveFileHandle = {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type SaveFilePicker = (options: {
  suggestedName: string;
  types: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}) => Promise<SaveFileHandle>;

export default function Zhipu() {
  const [text, setText] = useState("");
  const [transposedText, setTransposedText] = useState("");
  const [songFiles, setSongFiles] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [svg, setSvg] = useState("");
  const [adjustment, setAdjustment] = useState("0");
  const [transposeError, setTransposeError] = useState("");
  const [mode, setMode] = useState<"script" | "zhipuRender" | "zhipuTransposedView">("script");
  const [loadingMode, setLoadingMode] = useState<"zhipuRender" | "zhipuTransposedView" | null>(null);
  const [isTransposing, setIsTransposing] = useState(false);

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
      setTransposedText("");
    } catch (error) {
      console.error("Failed to load selected song:", error);
    }
  }

  async function handleZhipuRender() {
    if (loadingMode) {
      return;
    }

    setLoadingMode("zhipuRender");
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
      setMode("zhipuRender");
    } catch (error) {
      console.error("Zhipu render failed:", error);
      setSvg("<div style=\"color:red; padding:16px;\">Zhipu render failed. Check console for details.</div>");
      setMode("zhipuRender");
    } finally {
      setLoadingMode(null);
    }
  }

  async function handleZhipuTransposedView() {
    if (loadingMode || !transposedText) {
      return;
    }

    setLoadingMode("zhipuTransposedView");
    try {
      const response = await fetch("/api/jianpu", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
        body: transposedText,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setSvg(data.svg);
      setMode("zhipuTransposedView");
    } catch (error) {
      console.error("Zhipu transposed view failed:", error);
      setSvg("<div style=\"color:red; padding:16px;\">Zhipu transposed view failed. Check console for details.</div>");
      setMode("zhipuTransposedView");
    } finally {
      setLoadingMode(null);
    }
  }

  async function handleTranspose() {
    if (loadingMode || isTransposing) {
      return;
    }

    const numericAdjustment = Number(adjustment);
    if (!Number.isInteger(numericAdjustment)) {
      setTransposeError("Please enter an integer transpose value, for example -1 or 1.");
      return;
    }

    setTransposeError("");
    setIsTransposing(true);
    try {
      const response = await fetch("/api/transpose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: text,
          adjustment: numericAdjustment,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorData?.error ?? `Request failed: ${response.status}`);
      }

      const data = (await response.json()) as { script: string };
      setTransposedText(data.script);
      setMode("script");
      setTransposeError("");
    } catch (error) {
      console.error("Transpose failed:", error);
      setTransposeError(
        error instanceof Error
          ? error.message
          : "Transpose failed. Please try again.",
      );
    } finally {
      setIsTransposing(false);
    }
  }

  function handleScript() {
    setMode("script");
  }

  async function saveSvgAsFile(filename: string) {
    const showSaveFilePicker = (
      window as Window & { showSaveFilePicker?: SaveFilePicker }
    ).showSaveFilePicker;

    try {
      const fileHandle = showSaveFilePicker
        ? await showSaveFilePicker({
            suggestedName: filename,
            types: [
              {
                description: "SVG image",
                accept: { "image/svg+xml": [".svg"] },
              },
            ],
          })
        : null;
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });

      if (fileHandle) {
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Save failed:", error);
    }
  }

  function svgFilename(suffix: string) {
    const title = selectedSong.replace(/\.jps$/i, "") || "score";
    return `${title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")}${suffix}.svg`;
  }

  async function handleSave() {
    await saveSvgAsFile(svgFilename(""));
  }

  async function handleExportSvg() {
    await saveSvgAsFile(svgFilename("-transposed"));
  }

  const buttonClass = (active: boolean) =>
    `rounded px-3 py-1 ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-black hover:bg-gray-300"
    }`;

  const isLoadingZhipuRender = loadingMode === "zhipuRender";
  const isLoadingZhipuTransposedView = loadingMode === "zhipuTransposedView";
  const isAnyLoading = loadingMode !== null || isTransposing;
  const isValidAdjustment = adjustment.trim() !== "" && Number.isInteger(Number(adjustment));
  const isTransposeDisabled = isAnyLoading || !isValidAdjustment;
  const adjustmentValidationMessage = adjustment.trim() !== "" && !isValidAdjustment
    ? "Please enter an integer transpose value, for example -1 or 1."
    : "";
  const transposeFeedback = transposeError || adjustmentValidationMessage;

  return (
    <main className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="flex h-14 items-center gap-2 border-b bg-gray-100 px-4">
        <button
          onClick={handleScript}
          disabled={isAnyLoading}
          className={`${buttonClass(mode === "script")} ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
          Script
        </button>
        <button
          onClick={() => {
            void handleZhipuRender();
          }}
          disabled={isAnyLoading}
          className={`${buttonClass(mode === "zhipuRender")} ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
          {isLoadingZhipuRender ? "zhipuRendering..." : "zhipuRender"}
        </button>
        {mode === "zhipuRender" && (
          <button
            onClick={() => {
              void handleSave();
            }}
            className="rounded px-3 py-1 hover:bg-gray-200">
            Save
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span>Semitone shift</span>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => {
                setAdjustment(e.target.value);
                if (transposeError) {
                  setTransposeError("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isTransposeDisabled) {
                  void handleTranspose();
                }
              }}
              className="w-20 rounded border border-gray-300 px-2 py-1"
            />
          </label>
          <button
            onClick={() => {
              void handleTranspose();
            }}
            disabled={isTransposeDisabled}
            className={`rounded px-3 py-1 ${isTransposeDisabled ? "cursor-not-allowed bg-gray-200 text-black opacity-60" : "bg-gray-200 text-black hover:bg-gray-300"}`}>
            {isTransposing ? "Transposing..." : "Transpose"}
          </button>
          {transposedText && (
            <button
              onClick={() => {
                void handleZhipuTransposedView();
              }}
              disabled={isAnyLoading}
              className={`${buttonClass(mode === "zhipuTransposedView")} ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
              {isLoadingZhipuTransposedView ? "zhipuTransposedViewing..." : "zhipuTransposedView"}
            </button>
          )}
          {mode === "zhipuTransposedView" && (
            <button
              onClick={() => {
                void handleExportSvg();
              }}
              className="rounded px-3 py-1 hover:bg-gray-200">
              ExportSvg
            </button>
          )}
        </div>
      </nav>
      {transposeFeedback && (
        <div className="px-4 pt-2 text-sm text-red-600">{transposeFeedback}</div>
      )}

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
            <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3">
              <div className={transposedText ? "min-h-0 flex-1" : "h-full"}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Current script</div>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (transposedText) {
                      setTransposedText("");
                    }
                  }}
                  wrap="off"
                  className="h-full min-h-0 w-full min-w-0 resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              {transposedText && (
                <div className="min-h-0 flex-1">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Transposed script</div>
                  <textarea
                    value={transposedText}
                    readOnly
                    wrap="off"
                    className="h-full min-h-0 w-full min-w-0 resize-none rounded border border-blue-300 bg-blue-50 p-4 font-mono text-gray-900 outline-none"
                  />
                </div>
              )}
            </div>
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
