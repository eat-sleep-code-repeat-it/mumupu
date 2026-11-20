"use client";

import Link from "next/link";
import {
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { checkScriptRules, type ScriptRuleIssue } from "@/lib/accidental-rules";

type JpsFile = {
  name: string;
  path: string;
  lastModified: number;
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

function mostRecentlyUpdatedJpsFile(folders: JpsFolder[]): JpsFile | null {
  const files = folders.flatMap((folder) => [
    ...folder.files,
    ...listJpsFiles(folder.folders),
  ]);
  return files.sort(
    (left, right) =>
      right.lastModified - left.lastModified || left.path.localeCompare(right.path),
  )[0] ?? null;
}

function listJpsFiles(folders: JpsFolder[]): JpsFile[] {
  return folders.flatMap((folder) => [
    ...folder.files,
    ...listJpsFiles(folder.folders),
  ]);
}

function folderPathsForFile(filePath: string): string[] {
  const segments = filePath.split("/");
  segments.pop();
  return segments.map((_, index) => segments.slice(0, index + 1).join("/"));
}

function folderPaths(folders: JpsFolder[]): string[] {
  return folders.flatMap((folder) => [folder.path, ...folderPaths(folder.folders)]);
}

function publicFileUrl(filePath: string): string {
  return `/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

function isLocalHostname(hostname: string): boolean {
  const normalizedHostname = hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  return normalizedHostname === "localhost" || normalizedHostname === "127.0.0.1" || normalizedHostname === "::1";
}

function subscribeToHostnameChanges(): () => void {
  return () => {};
}

function isLocalDevelopmentHost(): boolean {
  return process.env.NODE_ENV === "development" && isLocalHostname(window.location.hostname);
}

function renderHighlightedScript(text: string, issues: ScriptRuleIssue[]): ReactNode {
  if (issues.length === 0) {
    return text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  issues.forEach((issue, index) => {
    if (issue.start > cursor) {
      parts.push(text.slice(cursor, issue.start));
    }
    parts.push(
      <mark
        key={`${issue.start}-${index}`}
        title={issue.message}
        className="rounded-sm bg-amber-300 text-black underline decoration-red-700 decoration-2 underline-offset-2"
      >
        {text.slice(issue.start, issue.end)}
      </mark>,
    );
    cursor = issue.end;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function summarizeRuleIssues(issues: ScriptRuleIssue[]): string {
  const summaries = [
    ["accidental", "possible missing natural sign"],
    ["bracket", "bracket pairing issue"],
    ["quote", "unpaired double quote"],
  ].flatMap(([kind, label]) => {
    const count = issues.filter((issue) => issue.kind === kind).length;
    return count > 0 ? [`${count} ${label}${count === 1 ? "" : "s"}`] : [];
  });

  return `Found ${summaries.join(", ")}. Review the highlighted locations.`;
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
          className="flex min-h-11 w-full items-center gap-2 py-2 pr-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-200 md:min-h-0"
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
                className={`block min-h-11 w-full truncate py-2 pr-3 text-left text-sm md:min-h-0 ${
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

export default function ScriptWorkspace({ createPage = false }: { createPage?: boolean }) {
  const [text, setText] = useState("");
  const [svgs, setSvgs] = useState<string[]>([]);
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [folders, setFolders] = useState<JpsFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileFilter, setFileFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [lastSavedText, setLastSavedText] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [renderError, setRenderError] = useState("");
  const [semitoneShift, setSemitoneShift] = useState("0");
  const [transposeError, setTransposeError] = useState("");
  const [transposeMessage, setTransposeMessage] = useState("");
  const [isSavingEdits, setIsSavingEdits] = useState(false);
  const [saveEditsError, setSaveEditsError] = useState("");
  const [saveEditsMessage, setSaveEditsMessage] = useState("");
  const [isExportingMusicXML, setIsExportingMusicXML] = useState(false);
  const [musicXMLExportError, setMusicXMLExportError] = useState("");
  const [isTransposing, setIsTransposing] = useState(false);
  const [isRenderingSelectedFile, setIsRenderingSelectedFile] = useState(false);
  const [renderRevision, setRenderRevision] = useState(0);
  const [preview, setPreview] = useState(!createPage);
  const [mode, setMode] = useState<"script" | "preview">(
    createPage ? "script" : "preview",
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const scriptEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const scriptHighlightRef = useRef<HTMLPreElement | null>(null);
  const importFileRef = useRef<HTMLInputElement | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const fileRequestRef = useRef<AbortController | null>(null);
  const selectedFileRenderGenerationRef = useRef(0);
  const canSaveEdits = useSyncExternalStore(
    subscribeToHostnameChanges,
    isLocalDevelopmentHost,
    () => false,
  );
  const ruleCheckIssues = useMemo(() => checkScriptRules(text), [text]);
  const hasUnsavedEdits = selectedFile !== null && lastSavedText !== null && text !== lastSavedText;

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
      const data = await response.json() as { error?: unknown };
      throw new Error(
        typeof data.error === "string" ? data.error : `Renderer request failed: ${response.status}`,
      );
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

  function getPreviewErrorMessage(error: unknown): string {
    const reason = error instanceof Error ? error.message : "Unknown rendering error.";
    return `Could not render preview: ${reason}`;
  }

  useEffect(() => {
    if (createPage) {
      return;
    }

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
        const latestFile = mostRecentlyUpdatedJpsFile(data.folders);
        if (!latestFile) {
          throw new Error("No JPS files were found.");
        }
        setExpandedFolders(new Set(folderPathsForFile(latestFile.path)));
        void handleSelectFile(latestFile);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load song list:", error);
        setFileError("Could not load songs.");
      });

    return () => {
      controller.abort();
      fileRequestRef.current?.abort();
    };
  }, [createPage]);

  useEffect(() => () => resizeCleanupRef.current?.(), []);

  useEffect(() => {
    const editor = scriptEditorRef.current;
    const highlight = scriptHighlightRef.current;
    if (editor && highlight) {
      highlight.scrollTop = editor.scrollTop;
      highlight.scrollLeft = editor.scrollLeft;
    }
  }, [ruleCheckIssues]);

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
          setRenderedText(text);
          setRenderError("");
          if (renderGeneration === selectedFileRenderGenerationRef.current) {
            setIsRenderingSelectedFile(false);
          }
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error("Automatic score preview failed:", error);
          setRenderedText(null);
          setRenderError(getPreviewErrorMessage(error));
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
    if (renderedText === text && svgs.length > 0) {
      setRenderError("");
      setPreview(true);
      setMode("preview");
      return;
    }

    try {
      const { pages } = await renderScore(text);
      setSvgs(pages);
      setRenderedText(text);
      setRenderError("");
      setPreview(true);
      setMode("preview");
    } catch (error) {
      console.error("Score preview failed:", error);
      setRenderedText(null);
      setRenderError(getPreviewErrorMessage(error));
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
      setRenderedText(text);
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

  async function handleExportMusicXML() {
    setIsExportingMusicXML(true);
    setMusicXMLExportError("");
    try {
      const response = await fetch("/api/jps-to-musicxml", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
        body: text,
      });
      const data = await response.json() as {
        musicXml?: unknown;
        filename?: unknown;
        error?: unknown;
      };
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : `Request failed: ${response.status}`,
        );
      }
      if (typeof data.musicXml !== "string" || typeof data.filename !== "string") {
        throw new Error("MusicXML converter returned an invalid response.");
      }

      const blob = new Blob([data.musicXml], {
        type: "application/vnd.recordare.musicxml+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("MusicXML export failed:", error);
      setMusicXMLExportError(
        error instanceof Error ? error.message : "Could not export the JPS script.",
      );
    } finally {
      setIsExportingMusicXML(false);
    }
  }

  async function handleTranspose() {
    const adjustment = Number(semitoneShift);
    if (!Number.isInteger(adjustment)) {
      setTransposeError("Please enter an integer transpose value, for example -1 or 1.");
      return;
    }

    const renderGeneration = selectedFileRenderGenerationRef.current;
    setIsTransposing(true);
    setTransposeError("");
    setTransposeMessage("");
    setSaveEditsError("");
    setSaveEditsMessage("");

    try {
      const response = await fetch("/api/transpose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script: text, adjustment }),
      });

      const data = await response.json() as { script?: unknown; error?: unknown };
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : `Request failed: ${response.status}`,
        );
      }
      if (typeof data.script !== "string") {
        throw new Error("Transpose returned an invalid script.");
      }
      if (renderGeneration !== selectedFileRenderGenerationRef.current) {
        return;
      }

      setText(data.script);
      setTransposeMessage(`Transposed script by ${adjustment} semitone${Math.abs(adjustment) === 1 ? "" : "s"}.`);
    } catch (error) {
      if (renderGeneration !== selectedFileRenderGenerationRef.current) {
        return;
      }
      console.error("Transpose failed:", error);
      setTransposeError(
        error instanceof Error ? error.message : "Transpose failed. Please try again.",
      );
    } finally {
      setIsTransposing(false);
    }
  }

  async function handleSelectFile(file: JpsFile) {
    fileRequestRef.current?.abort();
    const controller = new AbortController();
    fileRequestRef.current = controller;
    selectedFileRenderGenerationRef.current += 1;
    setFileError("");
    setRenderError("");
    setTransposeMessage("");
    setTransposeError("");
    setSaveEditsError("");
    setSaveEditsMessage("");
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
      setLastSavedText(content);
      setSemitoneShift("0");
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

  async function handleImportFileChange(
    event: ReactChangeEvent<HTMLInputElement>,
  ) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) {
      return;
    }
    const fileName = file.name.toLowerCase();
    const isMusicXml = /\.(musicxml|xml|mxl)$/.test(fileName);
    if (!isMusicXml && !/\.(jps|txt)$/.test(fileName)) {
      setFileError("Choose a .jps, .txt, .musicxml, .xml, or .mxl file.");
      return;
    }
    if (
      hasUnsavedEdits
      && !window.confirm("Discard your unsaved edits and import another script?")
    ) {
      return;
    }

    fileRequestRef.current?.abort();
    fileRequestRef.current = null;
    selectedFileRenderGenerationRef.current += 1;
    const renderGeneration = selectedFileRenderGenerationRef.current;
    setFileError("");
    setRenderError("");
    setTransposeError("");
    setTransposeMessage("");
    setSaveEditsError("");
    setSaveEditsMessage("");
    setIsRenderingSelectedFile(false);

    try {
      let content: string;
      if (isMusicXml) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/musicxml-to-jps", {
          method: "POST",
          body: formData,
        });
        const data = await response.json() as { script?: unknown; error?: unknown };
        if (!response.ok) {
          throw new Error(
            typeof data.error === "string" ? data.error : `Request failed: ${response.status}`,
          );
        }
        if (typeof data.script !== "string") {
          throw new Error("MusicXML converter returned an invalid script.");
        }
        content = data.script;
      } else {
        content = await file.text();
      }
      if (renderGeneration !== selectedFileRenderGenerationRef.current) {
        return;
      }
      setSelectedFile(null);
      setLastSavedText(null);
      setText(content);
      setSemitoneShift("0");
      setPreview(false);
      setMode("script");
      setRenderRevision((current) => current + 1);
    } catch (error) {
      if (renderGeneration !== selectedFileRenderGenerationRef.current) {
        return;
      }
      console.error("Failed to import script:", error);
      setFileError(error instanceof Error ? error.message : `Could not import ${file.name}.`);
    }
  }

  async function handleSaveEdits() {
    if (!selectedFile || !canSaveEdits) {
      setSaveEditsError("Select a song file and open the viewer locally to save edits.");
      return;
    }
    if (!hasUnsavedEdits || isRenderingSelectedFile || isSavingEdits) {
      return;
    }

    if (!window.confirm(`Save edits to ${selectedFile}? This will overwrite the existing file.`)) {
      return;
    }

    const filePath = selectedFile;
    const renderGeneration = selectedFileRenderGenerationRef.current;
    setIsSavingEdits(true);
    setSaveEditsError("");
    setSaveEditsMessage("");

    try {
      const response = await fetch("/api/songs/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: filePath, content: text }),
      });

      const data = await response.json() as { saved?: unknown; error?: unknown };
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : `Request failed: ${response.status}`,
        );
      }
      if (data.saved !== true) {
        throw new Error("Save endpoint returned an invalid response.");
      }
      if (renderGeneration !== selectedFileRenderGenerationRef.current) {
        return;
      }

      setLastSavedText(text);
      setSaveEditsMessage(`Saved edits to ${filePath}.`);
    } catch (error) {
      if (renderGeneration !== selectedFileRenderGenerationRef.current) {
        return;
      }
      console.error("Save edits failed:", error);
      setSaveEditsError(error instanceof Error ? error.message : "Could not save edits.");
    } finally {
      setIsSavingEdits(false);
    }
  }

  function handleScriptEditorScroll() {
    const editor = scriptEditorRef.current;
    const highlight = scriptHighlightRef.current;
    if (editor && highlight) {
      highlight.scrollTop = editor.scrollTop;
      highlight.scrollLeft = editor.scrollLeft;
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

  const buttonClass = (active: boolean) =>
    `min-h-11 rounded px-3 py-2 md:min-h-0 md:py-1 ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-black hover:bg-gray-300"
    }`;
  const normalizedFilter = fileFilter.trim().toLocaleLowerCase();
  const visibleFolders = filterFolders(folders, normalizedFilter);
  const visibleFileCount = countFiles(visibleFolders);
  const canDownloadSvg =
    text.trim().length > 0 && renderedText === text && !isRenderingSelectedFile;
  const isValidSemitoneShift =
    semitoneShift.trim() !== "" && Number.isInteger(Number(semitoneShift));

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div className="relative flex min-h-0 flex-1">
        {!createPage && (isSidebarVisible || isMobileSidebarOpen) && (
          <>
            {isMobileSidebarOpen && (
              <button
                type="button"
                aria-label="Close file list"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
              />
            )}
            <aside
              id="viewer-file-panel"
              ref={sidebarRef}
              aria-label="JPS files"
              className={`flex w-[min(85vw,20rem)] max-w-[85vw] shrink-0 flex-col bg-gray-50 md:static md:max-w-none md:shadow-none ${
                isMobileSidebarOpen
                  ? "fixed inset-y-0 left-0 z-50 shadow-xl md:z-auto"
                  : "hidden md:flex"
              } ${isSidebarVisible ? "md:flex" : "md:hidden"} md:w-44 lg:w-64`}
              style={sidebarWidth === null ? undefined : { width: sidebarWidth }}
            >
              <div className="border-b border-gray-300 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">JPS files</h2>
                  <span className="text-xs text-gray-500">{visibleFileCount}</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="min-h-11 rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-200 md:hidden"
                  >
                    Close
                  </button>
                </div>
                <input
                  type="search"
                  value={fileFilter}
                  onChange={(event) => handleFileFilterChange(event.target.value)}
                  placeholder="Filter files"
                  aria-label="Filter song files"
                  className="min-h-11 w-full border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-600"
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
                  onSelectFile={(file) => {
                    setIsMobileSidebarOpen(false);
                    void handleSelectFile(file);
                  }}
                />
              </div>
            </aside>

            {isSidebarVisible && (
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
                className="hidden w-1 shrink-0 cursor-col-resize touch-none border-x border-gray-300 bg-gray-100 outline-none hover:bg-blue-400 focus:bg-blue-500 md:block"
              />
            )}
          </>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-2 sm:p-3 md:p-4">
          <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <Link
                href={createPage ? "/" : "/create"}
                className={`${buttonClass(false)} whitespace-nowrap`}
              >
                {createPage ? "View" : "Create"}
              </Link>
              <Link
                href="/help"
                className={`${buttonClass(false)} whitespace-nowrap`}
              >
                Help
              </Link>
              {createPage && (
                <>
                  <input
                    ref={importFileRef}
                    type="file"
                    accept=".jps,.txt,.musicxml,.xml,.mxl"
                    onChange={(event) => void handleImportFileChange(event)}
                    className="hidden"
                    aria-label="Import script or MusicXML file"
                  />
                  <button
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className={`${buttonClass(false)} whitespace-nowrap`}
                  >
                    Import
                  </button>
                </>
              )}
              {!createPage && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(true)}
                    aria-expanded={isMobileSidebarOpen}
                    aria-controls="viewer-file-panel"
                    className={`${buttonClass(isMobileSidebarOpen)} whitespace-nowrap md:hidden`}
                  >
                    Files
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSidebarVisible((visible) => !visible)}
                    aria-expanded={isSidebarVisible}
                    aria-controls="viewer-file-panel"
                    className={`${buttonClass(isSidebarVisible)} hidden whitespace-nowrap md:inline-flex`}
                  >
                    Files
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={mode === "preview" ? handleScript : handlePreview}
                aria-label={mode === "preview" ? "Switch to script" : "Switch to preview"}
                className={`${buttonClass(false)} whitespace-nowrap`}
              >
                {mode === "preview" ? "Script" : "Preview"}
              </button>
              {!preview && (
                <>
                  <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-gray-700">
                    <span>Semitone shift</span>
                    <input
                      type="number"
                      value={semitoneShift}
                      aria-label="Semitone shift"
                      onChange={(event) => {
                        setSemitoneShift(event.target.value);
                        setTransposeError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && isValidSemitoneShift && !isTransposing) {
                          void handleTranspose();
                        }
                      }}
                      className="min-h-11 w-20 rounded border border-gray-300 px-2 py-1 md:min-h-0"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleTranspose()}
                    disabled={!isValidSemitoneShift || isTransposing || isSavingEdits}
                    className="min-h-11 shrink-0 whitespace-nowrap rounded bg-gray-200 px-3 py-2 text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-0 md:py-1">
                    {isTransposing ? "Transposing..." : "Transpose"}
                  </button>
                  {canSaveEdits && (
                    <button
                      type="button"
                      onClick={() => void handleSaveEdits()}
                      disabled={!selectedFile || !hasUnsavedEdits || isRenderingSelectedFile || isSavingEdits}
                      className="min-h-11 shrink-0 whitespace-nowrap rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-0 md:py-1">
                      {isSavingEdits ? "Saving..." : "Save edits"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleExportMusicXML()}
                    disabled={text.trim().length === 0 || isExportingMusicXML}
                    className={`${buttonClass(false)} whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isExportingMusicXML ? "Exporting..." : "Export MusicXML"}
                  </button>
                </>
              )}
            </div>
            {preview && (
              <button
                type="button"
                onClick={handleSave}
                disabled={!canDownloadSvg}
                className="min-h-11 shrink-0 whitespace-nowrap rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-0 md:py-1"
              >
                Download SVG
              </button>
            )}
          </div>
          {createPage && fileError && (
            <p className="mb-2 text-sm text-red-700" role="alert">{fileError}</p>
          )}
          {musicXMLExportError && (
            <p className="mb-2 text-sm text-red-700" role="alert">{musicXMLExportError}</p>
          )}
          {transposeError && (
            <p className="mb-2 text-sm text-red-700" role="alert">{transposeError}</p>
          )}
          {transposeMessage && !preview && (
            <p className="mb-2 text-sm text-green-700" role="status">{transposeMessage}</p>
          )}
          {saveEditsError && !preview && (
            <p className="mb-2 text-sm text-red-700" role="alert">{saveEditsError}</p>
          )}
          {saveEditsMessage && !preview && (
            <p className="mb-2 text-sm text-green-700" role="status">{saveEditsMessage}</p>
          )}
          {text && !preview && (
            <p className="mb-2 text-sm text-amber-800" role="status">
              {ruleCheckIssues.length === 0
                ? "No rule issues found."
                : summarizeRuleIssues(ruleCheckIssues)}
            </p>
          )}
          {preview ? (
            <div className="flex min-h-0 flex-1 flex-col gap-2">
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
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <div>
                {selectedFile && (
                  <p className="text-sm text-gray-600">Editing {selectedFile}</p>
                )}
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden rounded border border-gray-700 bg-black focus-within:border-blue-500">
                <pre
                  ref={scriptHighlightRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre p-4 pb-16 font-mono text-base leading-6 text-white"
                >
                  {renderHighlightedScript(text, ruleCheckIssues ?? [])}
                </pre>
                <textarea
                  ref={scriptEditorRef}
                  value={text}
                  disabled={isTransposing || isSavingEdits}
                  onChange={(event) => {
                    setText(event.target.value);
                    setMusicXMLExportError("");
                    setTransposeMessage("");
                    setTransposeError("");
                    setSaveEditsError("");
                    setSaveEditsMessage("");
                  }}
                  onScroll={handleScriptEditorScroll}
                  wrap="off"
                  aria-label="JPS script"
                  className="absolute inset-0 h-full w-full resize-none overflow-auto rounded bg-transparent p-4 font-mono text-base leading-6 text-transparent caret-white outline-none placeholder:text-gray-500 selection:bg-blue-500/50 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
