import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    const productId = (await params).productId
    return new Response(`${productId}`, {
        status: 200,
    });
}