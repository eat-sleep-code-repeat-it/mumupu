"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ParseResponse = {
  script?: string;
  outputPath?: string;
  confidence?: number;
  warnings?: string[];
  error?: string;
};

const MAX_PNG_BYTES = 10 * 1024 * 1024;

export default function PngToJpsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageSelection(file: File | undefined) {
    setError(null);
    setScript(null);
    setOutputPath(null);
    setConfidence(null);
    setWarnings([]);

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".png") || (file.type && file.type !== "image/png")) {
      setImage(null);
      setPreviewUrl(null);
      setError("Choose a PNG image.");
      return;
    }

    if (file.size > MAX_PNG_BYTES) {
      setImage(null);
      setPreviewUrl(null);
      setError("PNG images must be 10 MB or smaller.");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleParse() {
    if (!image) {
      setError("Choose a PNG image first.");
      return;
    }

    setError(null);
    setScript(null);
    setOutputPath(null);
    setConfidence(null);
    setWarnings([]);
    setIsParsing(true);

    const formData = new FormData();
    formData.set("image", image);

    try {
      const response = await fetch("/api/png-to-jps", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as ParseResponse;

      if (!response.ok) {
        throw new Error(result.error ?? "Could not parse this PNG.");
      }

      setScript(result.script ?? "");
      setOutputPath(result.outputPath ?? null);
      setConfidence(typeof result.confidence === "number" ? result.confidence : null);
      setWarnings(result.warnings ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not parse this PNG.");
    } finally {
      setIsParsing(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link className="text-sm text-blue-700 underline" href="/">
          Back to Mumu pu
        </Link>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">PNG to JPS</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Choose a Jianpu score image, preview it, then parse the visible notes into a JPS draft.
          Images are processed by local OCR and are not sent to an OCR service.
        </p>

        <section className="mt-8 rounded-xl border border-gray-300 bg-white p-5 shadow-sm sm:p-7">
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept="image/png,.png"
            aria-label="Choose a PNG image"
            onChange={(event) => {
              handleImageSelection(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
              className="rounded-lg border border-gray-400 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Open PNG
            </button>
            <button
              type="button"
              onClick={handleParse}
              disabled={!image || isParsing}
              className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isParsing ? "Parsing PNG..." : "Parse PNG"}
            </button>
            {image && <span className="text-sm text-gray-600">{image.name}</span>}
          </div>

          {previewUrl && (
            <div className="mt-6 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Preview of ${image?.name ?? "selected PNG"}`}
                className="mx-auto max-h-[70vh] max-w-full object-contain"
              />
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}

          {isParsing && (
            <p className="mt-5 text-sm text-gray-600" role="status">
              Running local OCR. The first run may take longer while the OCR language data loads.
            </p>
          )}

          {script !== null && (
            <section className="mt-8 border-t border-gray-200 pt-6" aria-live="polite">
              <h2 className="text-xl font-semibold">Parsed JPS</h2>
              {outputPath && (
                <p className="mt-2 text-sm text-gray-600">
                  Saved to <code>{outputPath}</code>
                </p>
              )}
              {confidence !== null && (
                <p className="mt-2 text-sm text-gray-600">OCR confidence: {confidence}%</p>
              )}
              {warnings.map((warning) => (
                <p key={warning} className="mt-3 text-sm text-amber-800">
                  {warning}
                </p>
              ))}
              <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg bg-gray-950 p-4 text-sm leading-6 text-gray-100">
                <code>{script}</code>
              </pre>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
