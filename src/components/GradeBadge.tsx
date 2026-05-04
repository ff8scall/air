"use client";
import { getGradeInfo } from "@/lib/scoring";

interface Props {
  grade: string | number;
  size?: "sm" | "md" | "lg";
}

export default function GradeBadge({ grade, size = "md" }: Props) {
  const info = getGradeInfo(grade);
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-lg px-4 py-1.5 font-bold" : "text-sm px-3 py-1";
  return (
    <span className={`inline-block rounded-full font-semibold ${info.bgColor} ${info.textColor} ${sizeClass}`}>
      {info.label}
    </span>
  );
}
