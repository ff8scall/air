import type { AirQualityItem, SidoAirItem } from "@/types/air-quality";
import type { StationItem, TmCoordItem, NearbyStation } from "@/types/station";

const BASE = "https://apis.data.go.kr/B552584";
const KEY = process.env.AIRKOREA_SERVICE_KEY!;

async function fetchJson<T>(url: string): Promise<T> {
  if (!KEY || KEY === "undefined") {
    throw new Error("AIRKOREA_SERVICE_KEY 환경 변수가 설정되지 않았습니다.");
  }
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`API 요청 실패: ${res.status}`);
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`JSON 파싱 실패: ${text.slice(0, 200)}`);
  }
  const d = data as { response: { header: { resultCode: string; resultMsg: string }; body: { items: T } } };
  const code = d?.response?.header?.resultCode;
  if (code !== "00") {
    throw new Error(`에어코리아 오류 ${code}: ${d?.response?.header?.resultMsg}`);
  }
  const items = d.response.body.items;
  return items as T;
}

export async function fetchStationRealtime(
  stationName: string,
  dataTerm: "DAILY" | "MONTH" | "3MONTH" = "DAILY"
): Promise<AirQualityItem[]> {
  const url =
    `${BASE}/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty` +
    `?serviceKey=${encodeURIComponent(KEY)}` +
    `&stationName=${encodeURIComponent(stationName)}` +
    `&dataTerm=${dataTerm}` +
    `&returnType=json&numOfRows=1&pageNo=1&ver=1.3`;
  return fetchJson<AirQualityItem[]>(url);
}

export async function fetchSidoRealtime(sidoName = "전국"): Promise<SidoAirItem[]> {
  const url =
    `${BASE}/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty` +
    `?serviceKey=${encodeURIComponent(KEY)}` +
    `&sidoName=${encodeURIComponent(sidoName)}` +
    `&returnType=json&numOfRows=500&pageNo=1&ver=1.0`;
  return fetchJson<SidoAirItem[]>(url);
}

const ALL_SIDO = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export async function fetchAllSidoRealtime(): Promise<SidoAirItem[]> {
  const results = await Promise.allSettled(
    ALL_SIDO.map((sido) => fetchSidoRealtime(sido))
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

export async function fetchTmCoord(umdName: string): Promise<TmCoordItem[]> {
  const url =
    `${BASE}/MsrstnInfoInqireSvc/getTMStdrCrdnt` +
    `?serviceKey=${encodeURIComponent(KEY)}` +
    `&umdName=${encodeURIComponent(umdName)}` +
    `&returnType=json&numOfRows=1&pageNo=1`;
  return fetchJson<TmCoordItem[]>(url);
}

export async function fetchNearbyStations(
  tmX: string,
  tmY: string
): Promise<NearbyStation[]> {
  const url =
    `${BASE}/MsrstnInfoInqireSvc/getNearbyMsrstnList` +
    `?serviceKey=${encodeURIComponent(KEY)}` +
    `&tmX=${tmX}&tmY=${tmY}` +
    `&returnType=json&numOfRows=3&pageNo=1`;
  return fetchJson<NearbyStation[]>(url);
}

export async function fetchStationList(addr: string): Promise<StationItem[]> {
  const url =
    `${BASE}/MsrstnInfoInqireSvc/getMsrstnList` +
    `?serviceKey=${encodeURIComponent(KEY)}` +
    `&addr=${encodeURIComponent(addr)}` +
    `&returnType=json&numOfRows=100&pageNo=1&ver=1.1`;
  return fetchJson<StationItem[]>(url);
}
