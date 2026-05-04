import { NextRequest, NextResponse } from "next/server";
import { fetchTmCoord, fetchNearbyStations } from "@/lib/airkorea";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const umdName = searchParams.get("umdName");
  const tmX = searchParams.get("tmX");
  const tmY = searchParams.get("tmY");

  try {
    if (tmX && tmY) {
      const nearby = await fetchNearbyStations(tmX, tmY);
      return NextResponse.json({ ok: true, data: nearby });
    }

    if (umdName) {
      const coords = await fetchTmCoord(umdName);
      if (!coords || coords.length === 0) {
        return NextResponse.json({ ok: false, error: "읍면동을 찾을 수 없습니다." }, { status: 404 });
      }
      const { tmX: x, tmY: y } = coords[0];
      const nearby = await fetchNearbyStations(x, y);
      return NextResponse.json({ ok: true, data: nearby, coord: coords[0] });
    }

    return NextResponse.json({ ok: false, error: "umdName 또는 tmX/tmY 파라미터가 필요합니다." }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
