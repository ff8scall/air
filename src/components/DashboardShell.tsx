"use client";
import { useState, useEffect, useCallback } from "react";
import { useUserStation } from "@/hooks/useUserStation";
import type { UserStation } from "@/hooks/useUserStation";
import type { AirQualityItem } from "@/types/air-quality";
import type { MapMarkerData } from "@/types/station";
import { calcVentilationScore, calcLaundryScore, parseValue } from "@/lib/scoring";
import { getVentilationAdvice, getLaundryAdvice, getNeighborhoodInsight } from "@/lib/advisor";
import { buildMapMarkers, getStationCoords } from "@/lib/station-mapping";
import HeroStatusCard from "@/components/HeroStatusCard";
import ActionAdviceCard from "@/components/ActionAdviceCard";
import ScoreCards from "@/components/ScoreCards";
import NeighborhoodCompareCard from "@/components/NeighborhoodCompareCard";
import StationSearchBar from "@/components/StationSearchBar";
import DynamicMap from "@/components/DynamicMap";
import DynamicNotification from "@/components/DynamicNotification";
import { IconWind } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";

const GRADE_ITEMS = [
  { grade: "좋음",     pm10: "0–30",   pm25: "0–15",  dot: "#0EA5E9" },
  { grade: "보통",     pm10: "31–80",  pm25: "16–35", dot: "#22C55E" },
  { grade: "나쁨",     pm10: "81–150", pm25: "36–75", dot: "#F97316" },
  { grade: "매우나쁨", pm10: "151+",   pm25: "76+",   dot: "#EF4444" },
];

interface Props {
  initialLatest: AirQualityItem | null;
  initialMarkers: MapMarkerData[];
  initialError: string | null;
}

export default function DashboardShell({ initialLatest, initialMarkers, initialError }: Props) {
  const { station, setStation, clearStation, loaded } = useUserStation();
  const [latest, setLatest] = useState<AirQualityItem | null>(initialLatest);
  const [markers] = useState<MapMarkerData[]>(initialMarkers);
  const [error, setError] = useState<string | null>(initialError);
  const [fetching, setFetching] = useState(false);

  const fetchStation = useCallback(async (s: UserStation) => {
    setFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/air-quality?station=${encodeURIComponent(s.stationName)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "데이터를 불러오지 못했습니다.");
      } else {
        setLatest(data.data ?? null);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (station.stationName !== (process.env.NEXT_PUBLIC_DEFAULT_STATION ?? "송파구")) {
      fetchStation(station);
    }
  }, [loaded, station, fetchStation]);

  const pm10 = parseValue(latest?.pm10Value);
  const pm25 = parseValue(latest?.pm25Value);
  const pm10Safe = pm10 < 0 ? 50 : pm10;
  const pm25Safe = pm25 < 0 ? 25 : pm25;
  const ventilation = calcVentilationScore(pm10Safe, pm25Safe);
  const laundry = calcLaundryScore(pm10Safe, pm25Safe);
  const advice = getVentilationAdvice(pm10Safe, pm25Safe);
  const laundryAdvice = getLaundryAdvice(pm10Safe, pm25Safe);

  const DEFAULT_CENTER: [number, number] = [37.502, 127.124];
  const stationCoords = getStationCoords(station.stationName);
  const mapCenter: [number, number] = stationCoords ?? DEFAULT_CENTER;
  const [centerLat, centerLng] = mapCenter;

  const neighborhood = getNeighborhoodInsight(station.stationName, centerLat, centerLng, markers);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconWind className="w-5 h-5 text-blue-500" />
            <span className="font-black text-base text-gray-800 dark:text-gray-100 tracking-tight">환기 미세먼지</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">30분마다 갱신</span>
            {fetching && (
              <span className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin" />
            )}
            <ThemeToggle />
            <DynamicNotification station={station.stationName} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {error && (
          <div role="alert" className="mb-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 items-start">
          {/* 좌측 패널 */}
          <div className="flex flex-col gap-5">
            {/* Hero */}
            <section aria-label="현재 공기질 상태">
              <HeroStatusCard
                data={latest}
                stationName={station.stationName}
                regionName={station.regionName}
                searchBar={
                  <StationSearchBar
                    currentRegionName={station.regionName}
                    onStation={(s) => setStation(s)}
                    onClear={clearStation}
                  />
                }
              />
            </section>

            {/* 환기 추천 */}
            <section aria-label="환기 행동 추천">
              <ActionAdviceCard advice={advice} laundryAdvice={laundryAdvice} />
            </section>

            {/* 지수 */}
            <section aria-label="환기 및 건조 지수">
              <ScoreCards ventilation={ventilation} laundry={laundry} />
            </section>

            {/* 동네 비교 */}
            <section aria-label="주변 동네 공기질 비교">
              <NeighborhoodCompareCard result={neighborhood} />
            </section>

            {/* 등급 기준표 */}
            <section aria-labelledby="guide-title" className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm">
              <h2 id="guide-title" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                미세먼지 등급 기준
              </h2>
              <div className="space-y-2">
                {GRADE_ITEMS.map((item) => (
                  <div key={item.grade} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.dot }} />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{item.grade}</span>
                    </div>
                    <div className="text-right text-xs text-gray-400 dark:text-gray-500">
                      <span>PM10 {item.pm10}</span>
                      <span className="mx-1.5 text-gray-200 dark:text-gray-700">|</span>
                      <span>PM2.5 {item.pm25} ㎍/㎥</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 우측: 지도 */}
          <section
            aria-label="전국 미세먼지 현황 지도"
            className="lg:sticky lg:top-[56px] lg:h-[calc(100vh-56px)]"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                전국 미세먼지 현황
              </h2>
              <span className="text-xs text-gray-300 dark:text-gray-600">마커 클릭 시 상세 정보</span>
            </div>
            <div className="h-[400px] lg:h-[calc(100vh-84px)]">
              <DynamicMap markers={markers} center={mapCenter} zoom={13} />
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-8 border-t border-gray-100 dark:border-gray-800 py-5 text-center text-xs text-gray-300 dark:text-gray-600">
        <p>데이터: 환경부 / 한국환경공단 에어코리아 · 측정소 기준 인근 대표값 · 30분 캐시</p>
        <p className="mt-1">© {new Date().getFullYear()} Antigravity. 참고용 자료로만 활용하세요.</p>
      </footer>
    </div>
  );
}
