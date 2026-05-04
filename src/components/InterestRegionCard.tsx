"use client";
import type { AirQualityItem } from "@/types/air-quality";
import { getGradeInfo, parseValue } from "@/lib/scoring";
import GradeBadge from "./GradeBadge";

interface Props {
  data: AirQualityItem | null;
  stationName: string;
  loading?: boolean;
}

function StatBox({ label, value, unit, grade }: { label: string; value: string; unit: string; grade?: string }) {
  const info = grade ? getGradeInfo(grade) : null;
  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3 min-w-[80px]">
      <span className="text-xs text-gray-400 mb-1">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value === "-" || !value ? "-" : value}</span>
      <span className="text-xs text-gray-400">{unit}</span>
      {info && <span className={`mt-1 text-xs font-medium ${info.textColor}`}>{info.label}</span>}
    </div>
  );
}

export default function InterestRegionCard({ data, stationName, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-xl flex-1" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-400">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const khaiInfo = getGradeInfo(data.khaiGrade);

  return (
    <article className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{stationName} 측정소</h2>
          <p className="text-xs text-gray-400 mt-0.5">{data.dataTime} 기준</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <GradeBadge grade={data.khaiGrade} size="lg" />
          <span className="text-xs text-gray-400">통합대기환경지수 {data.khaiValue !== "-" ? data.khaiValue : "?"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="PM10" value={data.pm10Value} unit="㎍/㎥" grade={data.pm10Grade1h || data.pm10Grade} />
        <StatBox label="PM2.5" value={data.pm25Value} unit="㎍/㎥" grade={data.pm25Grade1h || data.pm25Grade} />
        <StatBox label="오존" value={data.o3Value} unit="ppm" grade={data.o3Grade} />
        <StatBox label="이산화질소" value={data.no2Value} unit="ppm" grade={data.no2Grade} />
      </div>

      {(data.pm10Flag || data.pm25Flag) && (
        <p className="mt-3 text-xs text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
          ⚠️ 측정 상태: {[data.pm10Flag && `PM10 ${data.pm10Flag}`, data.pm25Flag && `PM2.5 ${data.pm25Flag}`].filter(Boolean).join(" / ")}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-300 text-right">출처: 환경부 / 한국환경공단 에어코리아</p>
    </article>
  );
}
