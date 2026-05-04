"use client";
import React from "react";
import type { VentilationScore, LaundryScore } from "@/types/air-quality";
import { IconWind, IconLaundry } from "@/components/icons";

interface Props {
  ventilation: VentilationScore;
  laundry: LaundryScore;
}

function scoreColor(score: number) {
  if (score >= 75) return { hex: "#0EA5E9", bg: "bg-sky-50", ring: "bg-sky-500" };
  if (score >= 50) return { hex: "#22C55E", bg: "bg-green-50", ring: "bg-green-500" };
  if (score >= 25) return { hex: "#F97316", bg: "bg-orange-50", ring: "bg-orange-500" };
  return { hex: "#EF4444", bg: "bg-red-50", ring: "bg-red-500" };
}

function ScoreRing({ score }: { score: number }) {
  const { hex } = scoreColor(score);
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="80" height="80" className="rotate-[-90deg]">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke={hex} strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

function ScoreCard({
  icon, title, score, label, description,
}: {
  icon: React.ReactNode; title: string; score: number; label: string; description: string;
}) {
  const { bg } = scoreColor(score);
  return (
    <article className={`${bg} rounded-3xl p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div>
          <span>{icon}</span>
          <h3 className="text-xs font-semibold text-gray-500 mt-0.5">{title}</h3>
        </div>
        <div className="relative flex items-center justify-center">
          <ScoreRing score={score} />
          <span className="absolute text-lg font-black text-gray-800">{score}</span>
        </div>
      </div>
      <div>
        <p className="font-bold text-base text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </article>
  );
}

export default function ScoreCards({ ventilation, laundry }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ScoreCard
        icon={<IconWind className="w-5 h-5 text-gray-400" />}
        title="환기 지수"
        score={ventilation.score}
        label={ventilation.label}
        description={ventilation.description}
      />
      <ScoreCard
        icon={<IconLaundry className="w-5 h-5 text-gray-400" />}
        title="빨래 건조 지수"
        score={laundry.score}
        label={laundry.label}
        description={laundry.description}
      />
    </div>
  );
}
