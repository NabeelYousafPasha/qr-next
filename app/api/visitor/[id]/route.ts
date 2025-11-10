import axios from "axios";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params; // fix Next.js async params issue
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

    try {
        const res = await axios.get(`${API_BASE}/visitor/${encodeURIComponent(id)}`);
        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error fetching visitor data:", error.message);
        return new Response(JSON.stringify({ error: "Failed to fetch visitor data" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
