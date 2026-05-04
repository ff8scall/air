import { fetchStationRealtime, fetchSidoRealtime } from "@/lib/airkorea";
import { calcVentilationScore, calcLaundryScore, parseValue } from "@/lib/scoring";
import { buildMapMarkers } from "@/lib/station-mapping";
import { getVentilationAdvice, getLaundryAdvice, getNeighborhoodInsight } from "@/lib/advisor";
import HeroStatusCard from "@/components/HeroStatusCard";
import ActionAdviceCard from "@/components/ActionAdviceCard";
import NeighborhoodCompareCard from "@/components/NeighborhoodCompareCard";
import ScoreCards from "@/components/ScoreCards";
import DynamicMap from "@/components/DynamicMap";
import DynamicNotification from "@/components/DynamicNotification";
import { IconWind } from "@/components/icons";

const DEFAULT_STATION = process.env.NEXT_PUBLIC_DEFAULT_STATION ?? "송파구";
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "송파구 오금동";

export const revalidate = 1800;

async function getDashboardData() {
  try {
    const [stationItems, sidoItems] = await Promise.all([
      fetchStationRealtime(DEFAULT_STATION, "DAILY"),
      fetchSidoRealtime("전국"),
    ]);
    const latest = Array.isArray(stationItems) ? stationItems[0] : null;
    const markers = buildMapMarkers(Array.isArray(sidoItems) ? sidoItems : []);
    return { latest, markers, error: null };
  } catch (e) {
    return { latest: null, markers: [], error: e instanceof Error ? e.message : "오류 발생" };
  }
}

const GRADE_ITEMS = [
  { grade: "좋음",     pm10: "0–30",   pm25: "0–15",  dot: "#0EA5E9" },
  { grade: "보통",     pm10: "31–80",  pm25: "16–35", dot: "#22C55E" },
  { grade: "나쁨",     pm10: "81–150", pm25: "36–75", dot: "#F97316" },
  { grade: "매우나쁨", pm10: "151+",   pm25: "76+",   dot: "#EF4444" },
];

export default async function HomePage() {
  const { latest, markers, error } = await getDashboardData();

  const pm10 = parseValue(latest?.pm10Value);
  const pm25 = parseValue(latest?.pm25Value);
  const pm10Safe = pm10 < 0 ? 50 : pm10;
  const pm25Safe = pm25 < 0 ? 25 : pm25;
  const ventilation = calcVentilationScore(pm10Safe, pm25Safe);
  const laundry = calcLaundryScore(pm10Safe, pm25Safe);
  const advice = getVentilationAdvice(pm10Safe, pm25Safe);
  const laundryAdvice = getLaundryAdvice(pm10Safe, pm25Safe);
  const neighborhood = getNeighborhoodInsight(DEFAULT_STATION, 37.502, 127.124, markers);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconWind className="w-5 h-5 text-blue-500" />
            <span className="font-black text-base text-gray-800 tracking-tight">환기 미세먼지</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">30분마다 갱신</span>
            <DynamicNotification station={DEFAULT_STATION} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {error && (
          <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* PC: 2열 그리드 (Hero 좌 + 지도 우), 모바일: 단열 */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 items-start">

          {/* 좌측 패널 */}
          <div className="flex flex-col gap-5">
            {/* Hero 상태 카드 */}
            <section aria-label="현재 공기질 상태">
              <HeroStatusCard
                data={latest ?? null}
                stationName={DEFAULT_STATION}
                regionName={DEFAULT_REGION}
              />
            </section>

            {/* 행동 추천 카드 */}
            <section aria-label="환기 행동 추천">
              <ActionAdviceCard advice={advice} laundryAdvice={laundryAdvice} />
            </section>

            {/* 지수 카드 (환기 최적 / 건조 최적) */}
            <section aria-label="환기 및 건조 지수">
              <ScoreCards ventilation={ventilation} laundry={laundry} />
            </section>

            {/* 주변 동네 비교 */}
            <section aria-label="주변 동네 공기질 비교">
              <NeighborhoodCompareCard result={neighborhood} />
            </section>

            {/* 등급 기준표 */}
            <section aria-labelledby="guide-title" className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 id="guide-title" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                미세먼지 등급 기준
              </h2>
              <div className="space-y-2">
                {GRADE_ITEMS.map((item) => (
                  <div key={item.grade} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.dot }} />
                      <span className="font-semibold text-gray-700">{item.grade}</span>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <span>PM10 {item.pm10}</span>
                      <span className="mx-1.5 text-gray-200">|</span>
                      <span>PM2.5 {item.pm25} ㎍/㎥</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 우측: 지도 — PC에서 화면 전체 높이 */}
          <section
            aria-label="전국 미세먼지 현황 지도"
            className="lg:sticky lg:top-[56px] lg:h-[calc(100vh-56px)]"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                전국 미세먼지 현황
              </h2>
              <span className="text-xs text-gray-300">마커 클릭 시 상세 정보</span>
            </div>
            <div className="h-[400px] lg:h-[calc(100vh-84px)]">
              <DynamicMap markers={markers} center={[37.502, 127.124]} zoom={13} />
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-8 border-t border-gray-100 py-5 text-center text-xs text-gray-300">
        <p>데이터: 환경부 / 한국환경공단 에어코리아 · 측정소 기준 인근 대표값 · 30분 캐시</p>
        <p className="mt-1">© {new Date().getFullYear()} Antigravity. 참고용 자료로만 활용하세요.</p>
      </footer>
    </div>
  );
}
