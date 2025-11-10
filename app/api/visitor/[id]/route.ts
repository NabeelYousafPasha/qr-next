import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
    const TOKEN = process.env.API_BEARER_TOKEN!;

    try {
        const res = await axios.get(
            `${API_BASE}/Visitors/ValidateQRCode/${encodeURIComponent(id)}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            }
        );

        return NextResponse.json(res.data);
    } catch (error: any) {
        console.error("Visitor fetch error:", error.message);
        return NextResponse.json(
            { error: error.response?.data || "Failed to fetch visitor" },
            { status: error.response?.status || 500 }
        );
    }
}
