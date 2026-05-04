import type { VentilationScore, LaundryScore, GradeInfo } from "@/types/air-quality";

export function getGradeInfo(grade: string | number): GradeInfo {
  const g = Number(grade);
  switch (g) {
    case 1:
      return { label: "좋음", color: "#3B82F6", bgColor: "bg-blue-100", textColor: "text-blue-700", markerColor: "#3B82F6" };
    case 2:
      return { label: "보통", color: "#22C55E", bgColor: "bg-green-100", textColor: "text-green-700", markerColor: "#22C55E" };
    case 3:
      return { label: "나쁨", color: "#F97316", bgColor: "bg-orange-100", textColor: "text-orange-700", markerColor: "#F97316" };
    case 4:
      return { label: "매우나쁨", color: "#EF4444", bgColor: "bg-red-100", textColor: "text-red-700", markerColor: "#EF4444" };
    default:
      return { label: "알 수 없음", color: "#9CA3AF", bgColor: "bg-gray-100", textColor: "text-gray-500", markerColor: "#9CA3AF" };
  }
}

export function calcVentilationScore(
  pm10: number,
  pm25: number,
  humidity?: number,
  windSpeed?: number
): VentilationScore {
  let score = 100;

  if (pm10 > 150 || pm25 > 75) {
    score -= 70;
  } else if (pm10 > 80 || pm25 > 35) {
    score -= 40;
  } else if (pm10 > 30 || pm25 > 15) {
    score -= 15;
  }

  if (humidity !== undefined) {
    if (humidity > 85) score -= 15;
    else if (humidity > 70) score -= 5;
    else if (humidity >= 40 && humidity <= 60) score += 5;
  }

  if (windSpeed !== undefined) {
    if (windSpeed >= 1 && windSpeed <= 4) score += 5;
    else if (windSpeed > 9) score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 75)
    return { score, label: "환기 최적", description: "지금 바로 창문을 여세요!", color: "text-blue-600" };
  if (score >= 50)
    return { score, label: "환기 가능", description: "짧은 환기는 괜찮아요.", color: "text-green-600" };
  if (score >= 25)
    return { score, label: "환기 주의", description: "환기를 자제하세요.", color: "text-orange-500" };
  return { score, label: "환기 금지", description: "창문을 닫고 공기청정기를 켜세요.", color: "text-red-600" };
}

export function calcLaundryScore(
  pm10: number,
  pm25: number,
  humidity?: number,
  windSpeed?: number,
  temp?: number
): LaundryScore {
  let score = 100;

  if (pm10 > 150 || pm25 > 75) {
    score -= 80;
  } else if (pm10 > 80 || pm25 > 35) {
    score -= 50;
  } else if (pm10 > 30 || pm25 > 15) {
    score -= 20;
  }

  if (humidity !== undefined) {
    if (humidity > 80) score -= 30;
    else if (humidity > 65) score -= 15;
    else if (humidity < 40) score += 10;
  }

  if (windSpeed !== undefined) {
    if (windSpeed >= 2 && windSpeed <= 5) score += 10;
    else if (windSpeed > 10) score -= 5;
  }

  if (temp !== undefined) {
    if (temp >= 20 && temp <= 30) score += 5;
    else if (temp < 5) score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 75)
    return { score, label: "건조 최적", description: "야외 빨래 건조에 완벽해요!", color: "text-blue-600" };
  if (score >= 50)
    return { score, label: "건조 가능", description: "야외 건조 가능하지만 주의하세요.", color: "text-green-600" };
  if (score >= 25)
    return { score, label: "건조 주의", description: "실내 건조를 권장합니다.", color: "text-orange-500" };
  return { score, label: "실내 건조", description: "반드시 실내에서 건조하세요.", color: "text-red-600" };
}

export function parseValue(val: string | undefined | null): number {
  if (!val || val === "-") return -1;
  return parseFloat(val) || -1;
}
