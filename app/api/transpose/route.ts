import { transposeScriptByAdjustment } from "@/lib/transpose-core.mjs";

type TransposeRequest = {
  script?: string;
  adjustment?: number | string;
};

export async function POST(request: Request) {
  let payload: TransposeRequest;

  try {
    payload = (await request.json()) as TransposeRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const script = payload.script;
  const adjustment = Number(payload.adjustment);

  if (typeof script !== "string") {
    return Response.json({ error: "script must be a string" }, { status: 400 });
  }

  if (!Number.isInteger(adjustment)) {
    return Response.json({ error: "adjustment must be an integer" }, { status: 400 });
  }

  try {
    const transposed = transposeScriptByAdjustment(script, adjustment);
    return Response.json({ script: transposed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transpose failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
