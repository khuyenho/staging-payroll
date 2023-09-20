import pdfMake from "pdfmake/build/pdfmake";
import { NextRequest, NextResponse } from "next/server";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getFileFromStorage } from "@/lib/gcs";
import { NextApiResponse } from "next";

// Register the PDF fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const POST = async (req: NextRequest, res: NextApiResponse) => {
  try {
    const body = await req.json();
    const { fileUrl } = body;
    const attachmentContent = await getFileFromStorage(fileUrl);

    const base64Content = attachmentContent.toString("base64");

    // Create a JSON response with the file content
    const jsonResponse = {
      fileContent: base64Content,
    };

    // res.send(jsonResponse);
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error downloading file:", error);
    return new Response(null, { status: 500 });
  }
};
