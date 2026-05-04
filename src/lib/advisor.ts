import type { MapMarkerData } from "@/types/station";

export interface VentilationAdvice {
  action: "open" | "brief" | "wait" | "close";
  headline: string;
  subtext: string;
  minutes?: number;
  color: string;
  bgGradient: string;
}

export interface NeighborhoodInsight {
  stationName: string;
  sidoName: string;
  pm10: string;
  pm25: string;
  grade: string;
  label: string;
  color: string;
  dist?: number;
}

export interface NeighborhoodResult {
  current: NeighborhoodInsight | null;
  nearby: NeighborhoodInsight[];
  bestDirection: string | null;
  summary: string;
}

const GRADE_COLOR: Record<string, string> = {
  "1": "#0EA5E9",
  "2": "#22C55E",
  "3": "#F97316",
  "4": "#EF4444",
};
const GRADE_LABEL: Record<string, string> = {
  "1": "좋음", "2": "보통", "3": "나쁨", "4": "매우나쁨", "0": "점검중",
};

export function getVentilationAdvice(pm10: number, pm25: number): VentilationAdvice {
  if (pm10 <= 0 && pm25 <= 0) {
    return {
      action: "wait",
      headline: "데이터 확인 중입니다",
      subtext: "잠시 후 다시 확인해주세요.",
      color: "text-gray-500",
      bgGradient: "from-gray-400 to-slate-500",
    };
  }
  if (pm10 <= 30 && pm25 <= 15) {
    return {
      action: "open",
      headline: "지금 환기하기 좋아요",
      subtext: "창문을 열고 20분 충분히 환기하세요.",
      minutes: 20,
      color: "text-sky-600",
      bgGradient: "from-sky-400 to-blue-500",
    };
  }
  if (pm10 <= 50 && pm25 <= 25) {
    return {
      action: "open",
      headline: "짧게 환기하세요",
      subtext: "10분 정도 창문을 열어두는 걸 추천해요.",
      minutes: 10,
      color: "text-emerald-600",
      bgGradient: "from-emerald-400 to-green-500",
    };
  }
  if (pm10 <= 80 && pm25 <= 35) {
    return {
      action: "brief",
      headline: "짧게만 환기하세요",
      subtext: "5분 이내로만 창문을 여세요.",
      minutes: 5,
      color: "text-yellow-600",
      bgGradient: "from-yellow-400 to-amber-500",
    };
  }
  if (pm10 <= 150 && pm25 <= 75) {
    return {
      action: "wait",
      headline: "환기는 잠시 미루세요",
      subtext: "미세먼지가 높아요. 30분 뒤 다시 확인하세요.",
      color: "text-orange-600",
      bgGradient: "from-orange-400 to-amber-500",
    };
  }
  return {
    action: "close",
    headline: "창문을 닫아두세요",
    subtext: "미세먼지가 매우 나쁩니다. 외출 시 마스크를 착용하세요.",
    color: "text-red-600",
    bgGradient: "from-red-500 to-rose-600",
  };
}

export function getLaundryAdvice(pm10: number, pm25: number): string {
  if (pm10 <= 30 && pm25 <= 15) return "야외 빨래 건조에 완벽한 날이에요.";
  if (pm10 <= 80 && pm25 <= 35) return "빨래 건조 괜찮아요. 오래 두지는 마세요.";
  if (pm10 <= 150 && pm25 <= 75) return "빨래는 실내에서 건조하세요.";
  return "빨래는 반드시 실내에서 건조하세요.";
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNeighborhoodInsight(
  currentStation: string,
  centerLat: number,
  centerLng: number,
  markers: MapMarkerData[],
  radiusKm = 10,
  maxCount = 5,
): NeighborhoodResult {
  const currentMarker = markers.find((m) => m.stationName === currentStation);

  function toInsight(m: MapMarkerData, dist?: number): NeighborhoodInsight {
    const grade = m.khaiGrade ?? "0";
    return {
      stationName: m.stationName,
      sidoName: m.sidoName,
      pm10: m.pm10Value ?? "-",
      pm25: m.pm25Value ?? "-",
      grade,
      label: GRADE_LABEL[grade] ?? "알 수 없음",
      color: GRADE_COLOR[grade] ?? "#6B7280",
      dist,
    };
  }

  const current = currentMarker ? toInsight(currentMarker) : null;

  const nearby = markers
    .filter((m) => m.stationName !== currentStation && m.lat && m.lng)
    .map((m) => ({ m, dist: haversineKm(centerLat, centerLng, m.lat!, m.lng!) }))
    .filter(({ dist }) => dist <= radiusKm)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, maxCount)
    .map(({ m, dist }) => toInsight(m, Math.round(dist * 10) / 10));

  const bestNearby = [...nearby].sort((a, b) => {
    const ga = parseInt(a.grade || "9");
    const gb = parseInt(b.grade || "9");
    return ga - gb || parseFloat(a.pm25) - parseFloat(b.pm25);
  })[0];

  const currentGradeNum = parseInt(current?.grade ?? "9");
  const bestGradeNum = parseInt(bestNearby?.grade ?? "9");

  let summary = "";
  if (!bestNearby) {
    summary = "주변 측정소 데이터를 불러오는 중입니다.";
  } else if (bestGradeNum < currentGradeNum) {
    summary = `${bestNearby.stationName} 방향이 더 맑아요.`;
  } else if (bestGradeNum === currentGradeNum) {
    summary = "주변 동네도 비슷한 공기질이에요.";
  } else {
    summary = "우리 동네 공기가 주변보다 좋아요.";
  }

  return {
    current,
    nearby,
    bestDirection: bestNearby?.stationName ?? null,
    summary,
  };
}
