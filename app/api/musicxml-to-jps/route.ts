import {
  convertMusicXMLToJps,
  MAX_MUSICXML_FILE_SIZE,
  MusicXMLConversionError,
} from "@/lib/musicxml-to-jps";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose a MusicXML file to import." }, { status: 400 });
  }
  if (file.size > MAX_MUSICXML_FILE_SIZE) {
    return Response.json({ error: "The MusicXML file is too large to import." }, { status: 413 });
  }

  try {
    const script = convertMusicXMLToJps(
      file.name,
      new Uint8Array(await file.arrayBuffer()),
    );
    return Response.json({ script });
  } catch (error) {
    if (error instanceof MusicXMLConversionError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
