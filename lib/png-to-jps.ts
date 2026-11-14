import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { createWorker, PSM } from "tesseract.js";

import { parseJpsEvents, translate } from "./translate.ts";

export const MAX_PNG_BYTES = 10 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const OCR_CHARACTERS = "0123456789|/-.#=,'()";

export class PngToJpsError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PngToJpsError";
    this.status = status;
  }
}

function getSafeBaseName(fileName: string): string {
  const fileBaseName = path.posix
    .basename(fileName.replaceAll("\\", "/"))
    .replace(/\.png$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/[. ]+$/g, "")
    .trim();

  if (!fileBaseName) {
    throw new PngToJpsError("The PNG filename must have a usable name.", 400);
  }

  return fileBaseName;
}

export function buildJpsFromOcr(fileName: string, ocrText: string): string {
  const baseName = getSafeBaseName(fileName);
  const scoreLines = ocrText
    .split(/\r?\n/)
    .map((line) => line
      .replace(/[89]/g, "")
      .replace(/[^0-9|\/.,#='() -]/g, " ")
      .replace(/\s+/g, " ")
      .trim())
    .filter((line) => line.includes("|") && (line.match(/[1-7]/g)?.length ?? 0) >= 2);

  if (scoreLines.length === 0) {
    throw new PngToJpsError("OCR did not find any note rows with bar lines.", 422);
  }

  const script = [
    "#==================",
    "V: 1.0",
    `B: ${baseName}`,
    ...scoreLines.map((line) => `Q: ${line}`),
    "",
  ].join("\n");
  const noteCount = parseJpsEvents(script).filter((event) => event.type === "note").length;

  if (noteCount === 0) {
    throw new PngToJpsError("OCR output did not contain any readable JPS notes.", 422);
  }

  translate(script);
  return script;
}

export async function parsePngToJps(image: Buffer, fileName: string): Promise<{
  script: string;
  outputPath: string;
  confidence: number;
  warnings: string[];
}> {
  if (!fileName.toLowerCase().endsWith(".png")) {
    throw new PngToJpsError("Choose a PNG image.", 400);
  }

  if (image.length > MAX_PNG_BYTES) {
    throw new PngToJpsError("PNG images must be 10 MB or smaller.", 413);
  }

  if (image.length < PNG_SIGNATURE.length || !image.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new PngToJpsError("The selected file is not a valid PNG image.", 400);
  }

  const require = createRequire(path.join(process.cwd(), "package.json"));
  const worker = await createWorker("eng", 1, {
    cachePath: path.join(process.cwd(), ".next", "cache", "tesseract"),
    workerPath: require.resolve("tesseract.js/src/worker-script/node/index.js"),
    workerBlobURL: false,
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      tessedit_char_whitelist: OCR_CHARACTERS,
    });

    const { data } = await worker.recognize(image);
    const script = buildJpsFromOcr(fileName, data.text);
    const outputDirectory = path.join(
      process.cwd(),
      "public",
      "png-to-script",
      "png-scripts",
    );
    const outputPath = path.join(outputDirectory, `${getSafeBaseName(fileName)}.jps`);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(outputPath, script, "utf8");

    return {
      script,
      outputPath: path.relative(process.cwd(), outputPath),
      confidence: data.confidence,
      warnings: [
        "This is a local OCR draft. Review and correct notes, accidentals, octave marks, and rhythm before using it.",
        ...(data.confidence < 60
          ? ["OCR confidence is low; the transcription may contain missing or incorrect notes."]
          : []),
      ],
    };
  } finally {
    await worker.terminate();
  }
}
