import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentWeather } from "@/lib/weather";

export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat, lng 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    const weather = await fetchCurrentWeather(lat, lng);
    return NextResponse.json({ data: weather });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
