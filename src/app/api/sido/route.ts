import { NextRequest, NextResponse } from "next/server";
import { fetchSidoRealtime } from "@/lib/airkorea";

export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sido = searchParams.get("sido") || "전국";

  try {
    const items = await fetchSidoRealtime(sido);
    return NextResponse.json({ ok: true, data: items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
