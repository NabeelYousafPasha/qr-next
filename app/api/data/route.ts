import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    // Mock API response, replace with real DB/API call
    const data = {
        code,
        name: "Example Item",
        description: "This data was fetched using the QR code.",
        date: new Date().toISOString(),
    };

    return NextResponse.json(data);
}
