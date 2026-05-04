import { NextRequest, NextResponse } from "next/server";
import { fetchStationRealtime } from "@/lib/airkorea";

export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const station = searchParams.get("station") || process.env.NEXT_PUBLIC_DEFAULT_STATION || "오금동";
  const dataTerm = (searchParams.get("dataTerm") as "DAILY" | "MONTH" | "3MONTH") || "DAILY";

  try {
    const items = await fetchStationRealtime(station, dataTerm);
    const latest = Array.isArray(items) ? items[0] : null;
    return NextResponse.json({ ok: true, data: latest, station });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    console.error("[air-quality API]", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
