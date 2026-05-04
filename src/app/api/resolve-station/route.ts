import { NextRequest, NextResponse } from "next/server";
import { fetchTmCoord, fetchNearbyStations } from "@/lib/airkorea";

/** WGS84 위경도 → Korea TM (EPSG:5181) 근사 변환 */
function wgs84ToTm(lat: number, lng: number): { tmX: string; tmY: string } {
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const e2 = 2 * f - f * f;
  const k0 = 1.0;
  const lon0 = (127.0 * Math.PI) / 180;
  const lat0 = (38.0 * Math.PI) / 180;
  const falseE = 200000;
  const falseN = 500000;

  const latR = (lat * Math.PI) / 180;
  const lngR = (lng * Math.PI) / 180;

  const e = Math.sqrt(e2);
  const N = a / Math.sqrt(1 - e2 * Math.sin(latR) ** 2);
  const T = Math.tan(latR) ** 2;
  const C = (e2 / (1 - e2)) * Math.cos(latR) ** 2;
  const A = Math.cos(latR) * (lngR - lon0);

  function M(phi: number) {
    return (
      a *
      ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi -
        ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi) +
        ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi) -
        ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi))
    );
  }

  const x =
    falseE +
    k0 *
      N *
      (A +
        ((1 - T + C) * A ** 3) / 6 +
        ((5 - 18 * T + T ** 2 + 72 * C - 58 * (e2 / (1 - e2))) * A ** 5) / 120);

  const y =
    falseN +
    k0 *
      (M(latR) -
        M(lat0) +
        N *
          Math.tan(latR) *
          (A ** 2 / 2 +
            ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
            ((61 - 58 * T + T ** 2 + 600 * C - 330 * (e2 / (1 - e2))) * A ** 6) / 720));

  return { tmX: x.toFixed(2), tmY: y.toFixed(2) };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const umdName = searchParams.get("umdName")?.trim();
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  try {
    let tmX: string, tmY: string, regionName: string;

    if (latStr && lngStr) {
      // GPS 경로
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json({ error: "잘못된 좌표입니다." }, { status: 400 });
      }
      const tm = wgs84ToTm(lat, lng);
      tmX = tm.tmX;
      tmY = tm.tmY;
      regionName = "현재 위치";
    } else if (umdName) {
      // 동 이름 검색 경로
      const tmItems = await fetchTmCoord(umdName);
      if (!tmItems || tmItems.length === 0) {
        return NextResponse.json({ error: `'${umdName}'에 해당하는 지역을 찾을 수 없습니다.` }, { status: 404 });
      }
      const item = tmItems[0];
      tmX = item.tmX;
      tmY = item.tmY;
      regionName = `${item.sggName} ${item.umdName}`;
    } else {
      return NextResponse.json({ error: "umdName 또는 lat/lng 파라미터가 필요합니다." }, { status: 400 });
    }

    const nearby = await fetchNearbyStations(tmX, tmY);
    if (!nearby || nearby.length === 0) {
      return NextResponse.json({ error: "인근 측정소를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      stationName: nearby[0].stationName,
      addr: nearby[0].addr,
      regionName,
      tmX,
      tmY,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
