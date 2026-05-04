"use client";
import type { AirQualityItem } from "@/types/air-quality";
import type React from "react";
import { getGradeInfo } from "@/lib/scoring";
import { IconWind, IconMask, IconBan, IconMapPin, IconClock } from "@/components/icons";

interface Props {
  data: AirQualityItem | null;
  stationName: string;
  regionName: string;
  searchBar?: React.ReactNode;
}

const GRADE_DESC: Record<string, string> = {
  "1": "지금 바로 창문을 여세요!",
  "2": "짧게 환기하기 좋아요.",
  "3": "환기는 잠시 미루세요.",
  "4": "창문을 닫아두세요.",
};

function GradeIcon({ grade }: { grade: string }) {
  const cls = "w-8 h-8 text-white drop-shadow";
  if (grade === "1") return <IconWind className={cls} />;
  if (grade === "2") return <IconWind className={`${cls} opacity-75`} />;
  if (grade === "3") return <IconMask className={cls} />;
  if (grade === "4") return <IconBan className={cls} />;
  return <IconWind className={`${cls} opacity-40`} />;
}


function GradeBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full bg-black/10 rounded-full h-1.5 mt-1">
      <div
        className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default function HeroStatusCard({ data, stationName, regionName, searchBar }: Props) {
  const khaiInfo = getGradeInfo(data?.khaiGrade ?? "0");
  const pm10Info = getGradeInfo(data?.pm10Grade1h || data?.pm10Grade || "0");
  const pm25Info = getGradeInfo(data?.pm25Grade1h || data?.pm25Grade || "0");

  const pm10Val = data?.pm10Value && data.pm10Value !== "-" ? Number(data.pm10Value) : null;
  const pm25Val = data?.pm25Value && data.pm25Value !== "-" ? Number(data.pm25Value) : null;

  const khaiGradeNum = parseInt(data?.khaiGrade ?? "0");
  const pm10GradeNum = parseInt(data?.pm10Grade1h || data?.pm10Grade || "0");
  const pm25GradeNum = parseInt(data?.pm25Grade1h || data?.pm25Grade || "0");
  const bestPmGrade = Math.min(pm10GradeNum || 9, pm25GradeNum || 9);
  const showKhaiNote =
    khaiGradeNum > 0 &&
    bestPmGrade > 0 &&
    bestPmGrade < khaiGradeNum;

  const bgGradient: Record<string, string> = {
    "좋음":       "from-sky-500 to-blue-600 dark:from-sky-700 dark:to-blue-900",
    "보통":       "from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-green-900",
    "나쁨":       "from-orange-500 to-amber-600 dark:from-orange-700 dark:to-amber-900",
    "매우나쁨":   "from-red-600 to-rose-700 dark:from-red-800 dark:to-rose-950",
    "알 수 없음": "from-gray-500 to-slate-600 dark:from-gray-700 dark:to-slate-900",
  };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br ${bgGradient[khaiInfo.label]} text-white overflow-hidden shadow-xl`}>
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white rounded-full" />
        <div className="absolute -bottom-16 -left-10 w-72 h-72 bg-white rounded-full" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* 상단 위치 & 시간 */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-white/70 text-sm font-medium flex items-center gap-1"><IconMapPin className="w-3.5 h-3.5" /> {regionName}</p>
            <p className="text-white/50 text-xs mt-0.5">{stationName} 측정소 기준 · 인근 대표값</p>
          </div>
          {data?.dataTime && (
            <span className="text-white/60 text-xs bg-white/10 rounded-full px-3 py-1">
              {data.dataTime.slice(5)} 측정
            </span>
          )}
        </div>

        {/* 핵심 상태 문구 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <GradeIcon grade={data?.khaiGrade ?? "0"} />
            <div>
              <p className="text-white/70 text-sm">지금 바깥 공기는</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                {khaiInfo.label !== "알 수 없음" ? khaiInfo.label : "데이터 없음"}
              </h1>
            </div>
          </div>
          <p className="text-white/80 text-base font-medium mt-2 ml-1">{GRADE_DESC[data?.khaiGrade ?? ""] ?? ""}</p>
        </div>

        {/* PM 수치 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* PM10 */}
          <div className="bg-white/15 dark:bg-white/8 backdrop-blur rounded-2xl p-4">
            <p className="text-white/60 dark:text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">PM10 미세먼지</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{pm10Val ?? "—"}</span>
              <span className="text-white/60 text-xs">㎍/㎥</span>
            </div>
            {pm10Val !== null && (
              <>
                <GradeBar value={pm10Val} max={200} color="rgba(255,255,255,0.8)" />
                <p className="text-white/80 text-xs font-semibold mt-1.5">{pm10Info.label}</p>
              </>
            )}
          </div>

          {/* PM2.5 */}
          <div className="bg-white/15 dark:bg-white/8 backdrop-blur rounded-2xl p-4">
            <p className="text-white/60 dark:text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">PM2.5 초미세먼지</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{pm25Val ?? "—"}</span>
              <span className="text-white/60 text-xs">㎍/㎥</span>
            </div>
            {pm25Val !== null && (
              <>
                <GradeBar value={pm25Val} max={100} color="rgba(255,255,255,0.8)" />
                <p className="text-white/80 text-xs font-semibold mt-1.5">{pm25Info.label}</p>
              </>
            )}
          </div>
        </div>

        {/* KHai/PM 혼선 안내 */}
        {showKhaiNote && (
          <div className="mb-3 bg-white/10 rounded-xl px-3 py-2 flex items-start gap-2">
            <span className="text-white/60 text-xs mt-0.5 shrink-0">ℹ️</span>
            <p className="text-white/70 text-xs leading-relaxed">
              통합지수(KHai)는 오존·이산화질소 등을 포함해 산출돼 미세먼지 단독 등급보다 높을 수 있어요.
            </p>
          </div>
        )}

        {/* 데이터 없음 안내 */}
        {!data && (
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 text-sm text-white/70">
            ⚠️ 측정 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        )}

        {/* 지역 검색바 */}
        {searchBar && (
          <div className="mt-4 pt-4 border-t border-white/20">
            {searchBar}
          </div>
        )}
      </div>
    </div>
  );
}
