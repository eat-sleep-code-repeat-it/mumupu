"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type JpsFile = {
  name: string;
  path: string;
};

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

export default function Home() {
  const [text, setText] = useState("");
  const [svgs, setSvgs] = useState<string[]>([]);
  const [folders, setFolders] = useState<JpsFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileFilter, setFileFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [renderError, setRenderError] = useState("");
  const [scriptSaveError, setScriptSaveError] = useState("");
  const [scriptSaveMessage, setScriptSaveMessage] = useState("");
  const [isSavingScript, setIsSavingScript] = useState(false);
  const [isRenderingSelectedFile, setIsRenderingSelectedFile] = useState(false);
  const [renderRevision, setRenderRevision] = useState(0);
  const [preview, setPreview] = useState(true);
  const [mode, setMode] = useState<"script" | "preview">("preview");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const fileRequestRef = useRef<AbortController | null>(null);
  const selectedFileRenderGenerationRef = useRef(0);

  async function renderScore(script: string, signal?: AbortSignal): Promise<{ pages: string[]; exportSvg: string }> {
    const response = await fetch("/api/jianpu", {
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

    const data = await response.json() as { pages?: unknown; exportSvg?: unknown };
    if (!Array.isArray(data.pages) || data.pages.length === 0 || !data.pages.every((page) => typeof page === "string")) {
      throw new Error("Renderer returned an invalid page list");
    }
    if (typeof data.exportSvg !== "string") {
      throw new Error("Renderer returned an invalid SVG export");
    }
    return { pages: data.pages, exportSvg: data.exportSvg };
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
        return response.json() as Promise<{ folders: JpsFolder[] }>;
      })
      .then((data) => {
        setFolders(data.folders);
        setExpandedFolders(new Set());
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

  useEffect(() => () => resizeCleanupRef.current?.(), []);

  useEffect(() => {
    if (!text) {
      return;
    }

    const renderGeneration = selectedFileRenderGenerationRef.current;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      renderScore(text, controller.signal)
        .then(({ pages }) => {
          setSvgs(pages);
          setRenderError("");
          if (renderGeneration === selectedFileRenderGenerationRef.current) {
            setIsRenderingSelectedFile(false);
          }
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error("Automatic translation failed:", error);
          setRenderError("Translation failed. Check the script and try again.");
          if (renderGeneration === selectedFileRenderGenerationRef.current) {
            setIsRenderingSelectedFile(false);
          }
        });
    }, 400);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [text, renderRevision]);

  async function handlePreview() {
    try {
      const { pages } = await renderScore(text);
      setSvgs(pages);
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
    const title = text.match(/^B:\s*(.+)$/m)?.[1]?.trim() || "score";
    const filename = `${title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")}.svg`;
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
      const { pages, exportSvg } = await renderScore(text);
      setSvgs(pages);
      const blob = new Blob([exportSvg], { type: "image/svg+xml;charset=utf-8" });

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

  async function handleSaveScript() {
    if (!selectedFile || isSavingScript) {
      return;
    }

    setIsSavingScript(true);
    setScriptSaveError("");
    setScriptSaveMessage("");
    try {
      const response = await fetch("/api/songs/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: selectedFile, content: text }),
      });
      if (!response.ok) {
        const data = await response.json() as { error?: unknown };
        throw new Error(typeof data.error === "string" ? data.error : `Request failed: ${response.status}`);
      }
      setScriptSaveMessage(`Saved changes to ${selectedFile}.`);
    } catch (error) {
      console.error("Script save failed:", error);
      setScriptSaveError(error instanceof Error ? error.message : "Could not save script.");
    } finally {
      setIsSavingScript(false);
    }
  }

  async function handleSelectFile(file: JpsFile) {
    fileRequestRef.current?.abort();
    const controller = new AbortController();
    fileRequestRef.current = controller;
    selectedFileRenderGenerationRef.current += 1;
    setFileError("");
    setRenderError("");
    setScriptSaveError("");
    setScriptSaveMessage("");
    setIsRenderingSelectedFile(true);
    setPreview(true);
    setMode("preview");

    try {
      const response = await fetch(publicFileUrl(file.path), {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const content = await response.text();
      setText(content);
      setRenderRevision((current) => current + 1);
      setSelectedFile(file.path);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Failed to load song:", error);
      setFileError(`Could not load ${file.name}.`);
      if (fileRequestRef.current === controller) {
        setIsRenderingSelectedFile(false);
      }
    }
  }

  function handleScript() {
    setPreview(false);
    setMode("script");
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

  const buttonClass = (active: boolean) =>
    `rounded px-3 py-1 ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-black hover:bg-gray-300"
    }`;
  const normalizedFilter = fileFilter.trim().toLocaleLowerCase();
  const visibleFolders = filterFolders(folders, normalizedFilter);
  const visibleFileCount = countFiles(visibleFolders);

  return (
    <main className="flex h-screen flex-col">
      {/* Navigation */}
      <nav className="flex h-14 items-center gap-2 border-b bg-gray-100 px-4">
        <button
          type="button"
          onClick={() => setIsSidebarVisible((visible) => !visible)}
          aria-expanded={isSidebarVisible}
          aria-controls="viewer-file-panel"
          className={buttonClass(isSidebarVisible)}>
          {isSidebarVisible ? "Hide files" : "Show files"}
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
        {isSidebarVisible && (
          <>
            <aside
              id="viewer-file-panel"
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
          </>
        )}

        <div className="min-w-0 flex-1 p-4">
          {preview ? (
            <div className="flex h-full flex-col gap-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                  Save SVG
                </button>
              </div>
              <div className="min-h-0 flex-1">
                {isRenderingSelectedFile ? (
                  <div
                    className="flex h-full w-full items-center justify-center bg-white"
                    role="status"
                    aria-live="polite"
                  >
                    <span
                      className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Rendering score...</span>
                  </div>
                ) : renderError ? (
                  <div className="p-4 text-red-700" role="alert">
                    {renderError}
                  </div>
                ) : (
                  <div className="h-full w-full overflow-auto bg-gray-100 p-4">
                    <div className="mx-auto max-w-[1000px]">
                      {svgs.map((page, index) => (
                        <div
                          key={index}
                          aria-label={`Score page ${index + 1}`}
                          className="mb-4 bg-white shadow [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                          dangerouslySetInnerHTML={{ __html: page }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  {selectedFile && (
                    <p className="text-sm text-gray-600">Editing {selectedFile}</p>
                  )}
                  {scriptSaveError
                    ? <p className="text-sm text-red-700" role="alert">{scriptSaveError}</p>
                    : scriptSaveMessage && <p className="text-sm text-green-700" role="status">{scriptSaveMessage}</p>}
                </div>
                <button
                  type="button"
                  onClick={handleSaveScript}
                  disabled
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  Save Script
                </button>
              </div>
              <textarea
                value={text}
                disabled={isSavingScript}
                onChange={(event) => {
                  setText(event.target.value);
                  setScriptSaveError("");
                  setScriptSaveMessage("");
                }}
                wrap="off"
                aria-label="JPS script"
                className="min-h-0 flex-1 resize-none rounded border border-gray-700 bg-black p-4 font-mono text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
