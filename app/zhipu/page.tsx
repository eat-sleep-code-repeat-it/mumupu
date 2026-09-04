"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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

type JpsFile = {
  name: string;
  path: string;
};

type JpsFolder = {
  name: string;
  path: string;
  files: JpsFile[];
  folders: JpsFolder[];
};

function filterFolders(folders: JpsFolder[], filter: string): JpsFolder[] {
  if (!filter) {
    return folders;
  }

  return folders.flatMap((folder) => {
    if (folder.name.toLocaleLowerCase().includes(filter)) {
      return [folder];
    }

    const files = folder.files.filter((file) =>
      file.name.toLocaleLowerCase().includes(filter),
    );
    const nestedFolders = filterFolders(folder.folders, filter);
    return files.length > 0 || nestedFolders.length > 0
      ? [{ ...folder, files, folders: nestedFolders }]
      : [];
  });
}

function countFiles(folders: JpsFolder[]): number {
  return folders.reduce(
    (count, folder) => count + folder.files.length + countFiles(folder.folders),
    0,
  );
}

function folderPaths(folders: JpsFolder[]): string[] {
  return folders.flatMap((folder) => [folder.path, ...folderPaths(folder.folders)]);
}

function publicFileUrl(filePath: string): string {
  return `/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

type FolderTreeProps = {
  folders: JpsFolder[];
  expandedFolders: Set<string>;
  selectedFile: string | null;
  onToggleFolder: (folderPath: string) => void;
  onSelectFile: (file: JpsFile) => void;
  depth?: number;
};

function FolderTree({
  folders,
  expandedFolders,
  selectedFile,
  onToggleFolder,
  onSelectFile,
  depth = 0,
}: FolderTreeProps) {
  return folders.map((folder) => {
    const isExpanded = expandedFolders.has(folder.path);
    return (
      <div key={folder.path}>
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => onToggleFolder(folder.path)}
          className="flex w-full items-center gap-2 py-2 pr-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-200"
          style={{ paddingLeft: 12 + depth * 14 }}
        >
          <span aria-hidden="true" className="w-3 shrink-0 text-center text-gray-500">
            {isExpanded ? "-" : "+"}
          </span>
          <span className="min-w-0 truncate" title={folder.name}>{folder.name}</span>
        </button>
        {isExpanded && (
          <div>
            {folder.folders.length > 0 && (
              <FolderTree
                folders={folder.folders}
                expandedFolders={expandedFolders}
                selectedFile={selectedFile}
                onToggleFolder={onToggleFolder}
                onSelectFile={onSelectFile}
                depth={depth + 1}
              />
            )}
            {folder.files.map((file) => (
              <button
                key={file.path}
                type="button"
                title={file.name}
                onClick={() => onSelectFile(file)}
                className={`block w-full truncate py-2 pr-3 text-left text-sm ${
                  selectedFile === file.path
                    ? "bg-blue-100 font-medium text-blue-900"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
                style={{ paddingLeft: 39 + depth * 14 }}
              >
                {file.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  });
}

export default function Zhipu() {
  const [text, setText] = useState("");
  const [transposedText, setTransposedText] = useState("");
  const [folders, setFolders] = useState<JpsFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileFilter, setFileFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [svg, setSvg] = useState("");
  const [adjustment, setAdjustment] = useState("0");
  const [transposeError, setTransposeError] = useState("");
  const [mode, setMode] = useState<"script" | "zhipuRender" | "zhipuSvgView">("script");
  const [loadingMode, setLoadingMode] = useState<"zhipuRender" | "zhipuSvgView" | null>(null);
  const [isTransposing, setIsTransposing] = useState(false);
  const [topScriptHeight, setTopScriptHeight] = useState<number | null>(null);
  const [scriptSplitMaxHeight, setScriptSplitMaxHeight] = useState(480);
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const fileRequestRef = useRef<AbortController | null>(null);
  const scriptSplitContainerRef = useRef<HTMLDivElement | null>(null);
  const topScriptPanelRef = useRef<HTMLDivElement | null>(null);
  const scriptSplitCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => scriptSplitCleanupRef.current?.(), []);
  useEffect(() => () => resizeCleanupRef.current?.(), []);

  useEffect(() => {
    const container = scriptSplitContainerRef.current;
    if (!container) {
      return;
    }

    const minPanelHeight = 96;
    const updateMaxHeight = () => {
      const height = container.getBoundingClientRect().height;
      setScriptSplitMaxHeight(Math.max(minPanelHeight, height - minPanelHeight - 24));
    };

    updateMaxHeight();
    const observer = new ResizeObserver(updateMaxHeight);
    observer.observe(container);
    return () => observer.disconnect();
  }, [mode, transposedText]);

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
    const controller = new AbortController();

    fetch("/api/songs", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json() as Promise<{ folders: JpsFolder[] }>;
      })
      .then((data) => {
        setFolders(data.folders);
        setExpandedFolders(new Set(data.folders.map((folder) => folder.path)));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load song list:", error);
        setFileError("Could not load songs.");
      });

    return () => controller.abort();
  }, []);

  async function handleSelectFile(file: JpsFile) {
    fileRequestRef.current?.abort();
    const controller = new AbortController();
    fileRequestRef.current = controller;
    setFileError("");
    setMode("script");

    try {
      const response = await fetch(publicFileUrl(file.path), {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const content = await response.text();
      setText(content);
      setSelectedFile(file.path);
      setTransposedText("");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Failed to load selected song:", error);
      setFileError(`Could not load ${file.name}.`);
    }
  }

  function handleToggleFolder(folderPath: string) {
    setExpandedFolders((current) => {
      const next = new Set(current);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  }

  function handleFileFilterChange(value: string) {
    setFileFilter(value);
    if (value.trim()) {
      setExpandedFolders((current) => new Set([...current, ...folderPaths(folders)]));
    }
  }

  function clampSidebarWidth(width: number) {
    const maximumWidth = Math.max(160, Math.min(480, window.innerWidth - 320));
    return Math.min(maximumWidth, Math.max(160, width));
  }

  function handleResizeStart(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    resizeCleanupRef.current?.();

    const startX = event.clientX;
    const startWidth = sidebarRef.current?.getBoundingClientRect().width ?? 256;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      setSidebarWidth(clampSidebarWidth(startWidth + moveEvent.clientX - startX));
    };
    const stopResizing = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      resizeCleanupRef.current = null;
    };

    resizeCleanupRef.current = stopResizing;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);
  }

  function handleResizeKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const currentWidth = sidebarRef.current?.getBoundingClientRect().width ?? 256;
    let nextWidth: number | null = null;

    if (event.key === "ArrowLeft") nextWidth = currentWidth - 16;
    if (event.key === "ArrowRight") nextWidth = currentWidth + 16;
    if (event.key === "Home") nextWidth = 160;
    if (event.key === "End") nextWidth = 480;

    if (nextWidth !== null) {
      event.preventDefault();
      setSidebarWidth(clampSidebarWidth(nextWidth));
    }
  }

  async function handleZhipuRender() {
    if (loadingMode) {
      return;
    }

    setLoadingMode("zhipuRender");
    setMode("zhipuRender");
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

  async function handleZhipuSvgView() {
    if (loadingMode || !transposedText) {
      return;
    }

    setLoadingMode("zhipuSvgView");
    setMode("zhipuSvgView");
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
      setMode("zhipuSvgView");
    } catch (error) {
      console.error("Zhipu transposed view failed:", error);
      setSvg("<div style=\"color:red; padding:16px;\">Zhipu transposed view failed. Check console for details.</div>");
      setMode("zhipuSvgView");
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

  function clampTopScriptHeight(height: number) {
    const containerHeight = scriptSplitContainerRef.current?.getBoundingClientRect().height ?? 480;
    const minPanelHeight = 96;
    const maxHeight = Math.max(minPanelHeight, containerHeight - minPanelHeight - 24);
    return Math.min(maxHeight, Math.max(minPanelHeight, height));
  }

  function handleScriptResizeStart(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    scriptSplitCleanupRef.current?.();

    const startY = event.clientY;
    const startHeight = topScriptPanelRef.current?.getBoundingClientRect().height ?? 200;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      setTopScriptHeight(clampTopScriptHeight(startHeight + moveEvent.clientY - startY));
    };
    const stopResizing = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      scriptSplitCleanupRef.current = null;
    };

    scriptSplitCleanupRef.current = stopResizing;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);
  }

  function handleScriptResizeKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const currentHeight = topScriptPanelRef.current?.getBoundingClientRect().height ?? 200;
    let nextHeight: number | null = null;

    if (event.key === "ArrowUp") nextHeight = currentHeight - 16;
    if (event.key === "ArrowDown") nextHeight = currentHeight + 16;
    if (event.key === "Home") nextHeight = 96;
    if (event.key === "End") nextHeight = Number.MAX_SAFE_INTEGER;

    if (nextHeight !== null) {
      event.preventDefault();
      setTopScriptHeight(clampTopScriptHeight(nextHeight));
    }
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
    const baseName = selectedFile?.split("/").pop() ?? "";
    const title = baseName.replace(/\.jps$/i, "") || "score";
    return `${title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")}${suffix}.svg`;
  }

  async function handleSave() {
    const suffix = mode === "zhipuSvgView" ? "-transposed" : "";
    await saveSvgAsFile(svgFilename(suffix));
  }

  const normalizedFilter = fileFilter.trim().toLocaleLowerCase();
  const visibleFolders = filterFolders(folders, normalizedFilter);
  const visibleFileCount = countFiles(visibleFolders);

  const isLoadingZhipuRender = loadingMode === "zhipuRender";
  const isLoadingZhipuSvgView = loadingMode === "zhipuSvgView";
  const isAnyLoading = loadingMode !== null || isTransposing;
  const isValidAdjustment = adjustment.trim() !== "" && Number.isInteger(Number(adjustment));
  const isTransposeDisabled = isAnyLoading || !isValidAdjustment;
  const adjustmentValidationMessage = adjustment.trim() !== "" && !isValidAdjustment
    ? "Please enter an integer transpose value, for example -1 or 1."
    : "";
  const transposeFeedback = transposeError || adjustmentValidationMessage;

  return (
    <main className="flex h-screen flex-col">
      {transposeFeedback && (
        <div className="px-4 pt-2 text-sm text-red-600">{transposeFeedback}</div>
      )}

      {/* Editor */}
      <div className="flex min-h-0 flex-1">
        <aside
          ref={sidebarRef}
          className="flex w-44 shrink-0 flex-col bg-gray-50 sm:w-64"
          style={sidebarWidth === null ? undefined : { width: sidebarWidth }}
        >
          <div className="border-b border-gray-300 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">JPS files</h2>
              <span className="text-xs text-gray-500">{visibleFileCount}</span>
            </div>
            <input
              type="search"
              value={fileFilter}
              onChange={(event) => handleFileFilterChange(event.target.value)}
              placeholder="Filter files"
              aria-label="Filter song files"
              className="w-full border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-600"
            />
            {fileError && (
              <p className="mt-2 text-xs text-red-700" role="alert">{fileError}</p>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-1">
            <FolderTree
              folders={visibleFolders}
              expandedFolders={expandedFolders}
              selectedFile={selectedFile}
              onToggleFolder={handleToggleFolder}
              onSelectFile={handleSelectFile}
            />
          </div>
        </aside>

        <div
          role="separator"
          aria-label="Resize file list"
          aria-orientation="vertical"
          aria-valuemin={160}
          aria-valuemax={480}
          aria-valuenow={sidebarWidth ?? undefined}
          tabIndex={0}
          onPointerDown={handleResizeStart}
          onKeyDown={handleResizeKeyDown}
          className="w-1 shrink-0 cursor-col-resize touch-none border-x border-gray-300 bg-gray-100 outline-none hover:bg-blue-400 focus:bg-blue-500"
        />

        <div className="min-w-0 flex-1 py-4 pr-4 pl-2">
          {mode === "script" ? (
            <div ref={scriptSplitContainerRef} className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4">
              <div
                ref={topScriptPanelRef}
                className={`flex min-h-0 flex-col ${transposedText ? "" : "h-full"}`}
                style={
                  transposedText
                    ? topScriptHeight === null
                      ? { flex: 1 }
                      : { height: topScriptHeight, flex: "0 0 auto" }
                    : undefined
                }
              >
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current script</span>
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => {
                        void handleZhipuRender();
                      }}
                      disabled={isAnyLoading}
                      className={`rounded px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
                      {isLoadingZhipuRender ? "zhipuRendering..." : "zhipuRender"}
                    </button>
                  </div>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (transposedText) {
                      setTransposedText("");
                    }
                  }}
                  wrap="off"
                  className="min-h-0 w-full min-w-0 flex-1 resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              {transposedText && (
                <>
                  <div
                    role="separator"
                    aria-label="Resize script panels"
                    aria-orientation="horizontal"
                    aria-valuemin={96}
                    aria-valuemax={scriptSplitMaxHeight}
                    aria-valuenow={topScriptHeight ?? undefined}
                    tabIndex={0}
                    onPointerDown={handleScriptResizeStart}
                    onKeyDown={handleScriptResizeKeyDown}
                    className="h-1 shrink-0 cursor-row-resize touch-none rounded border-y border-gray-300 bg-gray-100 outline-none hover:bg-blue-400 focus:bg-blue-500"
                  />
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Transposed script</span>
                      <button
                        onClick={() => {
                          void handleZhipuSvgView();
                        }}
                        disabled={isAnyLoading}
                        className={`rounded px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
                        {isLoadingZhipuSvgView ? "zhipuSvgViewing..." : "zhipuSvgView"}
                      </button>
                    </div>
                    <textarea
                      value={transposedText}
                      readOnly
                      wrap="off"
                      className="min-h-0 w-full min-w-0 flex-1 resize-none rounded border border-blue-300 bg-blue-50 p-4 font-mono text-gray-900 outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleScript}
                  disabled={isAnyLoading}
                  className={`rounded px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 ${isAnyLoading ? "cursor-not-allowed opacity-60" : ""}`}>
                  Script
                </button>
                <button
                  onClick={() => {
                    void handleSave();
                  }}
                  className="rounded px-3 py-1 hover:bg-gray-200">
                  Save
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto rounded border border-gray-300 bg-white p-3">
                {loadingMode ? (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    role="status"
                    aria-live="polite"
                  >
                    <span
                      className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Rendering score...</span>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: svg }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
