import {
  convertJpsToMusicXML,
  JpsToMusicXMLConversionError,
} from "@/lib/jps-to-musicxml";

export async function POST(request: Request) {
  const script = await request.text();

  try {
    return Response.json(convertJpsToMusicXML(script));
  } catch (error) {
    if (error instanceof JpsToMusicXMLConversionError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
