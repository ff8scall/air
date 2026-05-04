"use client";
import type { NeighborhoodResult } from "@/lib/advisor";
import { IconMapPin } from "@/components/icons";

interface Props {
  result: NeighborhoodResult;
}

const GRADE_LABEL: Record<string, string> = {
  "1": "좋음", "2": "보통", "3": "나쁨", "4": "매우나쁨", "0": "점검중",
};

function GradeChip({ grade, label, color }: { grade: string; label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs font-bold"
      style={{ background: color }}
    >
      {label || GRADE_LABEL[grade] || "?"}
    </span>
  );
}

export default function NeighborhoodCompareCard({ result }: Props) {
  const { current, nearby, summary } = result;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">주변 동네 비교</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{summary}</p>
      </div>

      {/* 현재 위치 */}
      {current && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <IconMapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{current.stationName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">관심 지역</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 flex-1 justify-center">
            <span className="text-xs text-gray-400 dark:text-gray-500">PM10</span>
            <span className="text-lg font-black text-gray-800 dark:text-gray-100 tabular-nums">{current.pm10}</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">PM2.5</span>
            <span className="text-lg font-black text-gray-800 dark:text-gray-100 tabular-nums">{current.pm25}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">㎍/㎥</span>
          </div>
          <GradeChip grade={current.grade} label={current.label} color={current.color} />
        </div>
      )}

      {/* 주변 측정소 */}
      {nearby.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">주변 측정소 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-1">
          {nearby.map((n) => (
            <div
              key={n.stationName}
              className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="shrink-0 w-2.5 h-2.5 rounded-full"
                  style={{ background: n.color }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{n.stationName}</p>
                  {n.dist !== undefined && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">{n.dist} km</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">PM10 / PM2.5</p>
                  <p className="text-base font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                    {n.pm10} <span className="text-gray-300 dark:text-gray-600">/</span> {n.pm25}
                  </p>
                </div>
                <GradeChip grade={n.grade} label={n.label} color={n.color} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
