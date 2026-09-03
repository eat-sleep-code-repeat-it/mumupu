"use client";

import { useEffect, useRef, useState } from "react";

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

export default function Home() {
  const [text, setText] = useState("");
  const [svg, setSvg] = useState("");
  const [folders, setFolders] = useState<JpsFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
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

  async function handleSelectFile(file: JpsFile) {
    fileRequestRef.current?.abort();
    const controller = new AbortController();
    fileRequestRef.current = controller;
    setFileError("");

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
      setPreview(false);
      setMode("script");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error("Failed to load song:", error);
      setFileError(`Could not load ${file.name}.`);
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