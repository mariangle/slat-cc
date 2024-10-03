import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing 'url' query parameter",
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: res.text(),
        },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("Content-Type") || "audio/mpeg";

    const audioBuffer = await res.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
