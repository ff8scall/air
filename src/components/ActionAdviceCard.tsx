"use client";
import type { VentilationAdvice } from "@/lib/advisor";
import { IconWind, IconBan, IconMask } from "@/components/icons";

interface Props {
  advice: VentilationAdvice;
  laundryAdvice: string;
}

function ActionIcon({ action, className }: { action: VentilationAdvice["action"]; className: string }) {
  if (action === "open") return <IconWind className={className} />;
  if (action === "brief") return <IconWind className={`${className} opacity-60`} />;
  if (action === "wait") return <IconMask className={className} />;
  return <IconBan className={className} />;
}

const ACTION_BG: Record<string, string> = {
  open: "from-sky-50 to-blue-50 border-sky-100",
  brief: "from-emerald-50 to-green-50 border-emerald-100",
  wait: "from-amber-50 to-yellow-50 border-amber-100",
  close: "from-red-50 to-rose-50 border-red-100",
};

const ACTION_ICON_COLOR: Record<string, string> = {
  open: "text-sky-500",
  brief: "text-emerald-500",
  wait: "text-amber-500",
  close: "text-red-500",
};

const ACTION_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: "환기 가능", bg: "bg-sky-100", text: "text-sky-700" },
  brief: { label: "짧게 환기", bg: "bg-emerald-100", text: "text-emerald-700" },
  wait: { label: "환기 대기", bg: "bg-amber-100", text: "text-amber-700" },
  close: { label: "환기 금지", bg: "bg-red-100", text: "text-red-700" },
};

export default function ActionAdviceCard({ advice, laundryAdvice }: Props) {
  const bg = ACTION_BG[advice.action] ?? ACTION_BG.wait;
  const iconColor = ACTION_ICON_COLOR[advice.action] ?? "text-gray-400";
  const badge = ACTION_BADGE[advice.action];

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${bg} p-5`}>
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-0.5">
          <ActionIcon action={advice.action} className={`w-8 h-8 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
          <h2 className="text-lg font-black text-gray-800 leading-tight">{advice.headline}</h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{advice.subtext}</p>
        </div>
      </div>

      {/* 환기 시간 표시 */}
      {advice.minutes && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-white/70 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">권장 환기 시간</span>
            <span className={`text-2xl font-black ${iconColor}`}>
              {advice.minutes}<span className="text-sm font-semibold ml-0.5">분</span>
            </span>
          </div>
        </div>
      )}

      {/* 빨래 조언 */}
      <div className="mt-3 bg-white/60 rounded-2xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-sm text-gray-400">🧺</span>
        <p className="text-xs text-gray-600 font-medium">{laundryAdvice}</p>
      </div>
    </div>
  );
}
