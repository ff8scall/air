"use client";
import type { WeatherAdvice } from "@/lib/advisor";

interface Props {
  advice: WeatherAdvice;
}

interface NoteRowProps {
  icon: string;
  label: string;
  text: string;
}

function NoteRow({ icon, label, text }: NoteRowProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-base shrink-0 mt-0.5">{icon}</span>
      <div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1.5">{label}</span>
        <span className="text-xs text-gray-600 dark:text-gray-300">{text}</span>
      </div>
    </div>
  );
}

export default function WeatherAdviceCard({ advice }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          오늘의 날씨
        </h2>
      </div>

      {/* 날씨 요약 바 */}
      <div className="flex items-center gap-4 mb-4 bg-slate-50 dark:bg-gray-800 rounded-2xl px-4 py-3">
        <span className="text-4xl leading-none">{advice.weatherIcon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-gray-800 dark:text-gray-100 truncate">
            {advice.weatherLabel}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{advice.summary}</p>
        </div>
      </div>

      {/* 수치 칩 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1 text-xs font-semibold bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-full px-3 py-1">
          🌡️ {advice.temperature}°C
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full px-3 py-1">
          💧 습도 {advice.humidity}%
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-full px-3 py-1">
          💨 {advice.windspeed}km/h
        </span>
      </div>

      {/* 날씨 보정 추천 노트 */}
      {(advice.ventilationNote || advice.laundryNote || advice.outdoorNote) && (
        <div className="space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-4">
          {advice.ventilationNote && (
            <NoteRow icon="🪟" label="환기" text={advice.ventilationNote} />
          )}
          {advice.laundryNote && (
            <NoteRow icon="🧺" label="빨래" text={advice.laundryNote} />
          )}
          {advice.outdoorNote && (
            <NoteRow icon="🚶" label="외출" text={advice.outdoorNote} />
          )}
        </div>
      )}
    </div>
  );
}
