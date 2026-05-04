import type { MapMarkerData } from "@/types/station";
import type { CurrentWeather } from "@/lib/weather";
import { isRaining, isSnowing, getWeatherLabel, getWeatherIcon } from "@/lib/weather";

export interface VentilationAdvice {
  action: "open" | "brief" | "wait" | "close";
  headline: string;
  subtext: string;
  minutes?: number;
  color: string;
  bgGradient: string;
  factors: string[];
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
      factors: [],
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
      factors: [`PM10 ${pm10}㎍/㎥ 좋음`, `PM2.5 ${pm25}㎍/㎥ 좋음`],
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
      factors: [`PM10 ${pm10}㎍/㎥ 보통`, `PM2.5 ${pm25}㎍/㎥ 보통`],
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
      factors: [
        `PM10 ${pm10}㎍/㎥ ${pm10 > 50 ? "나쁨" : "보통"}`,
        `PM2.5 ${pm25}㎍/㎥ ${pm25 > 25 ? "나쁨" : "보통"}`,
      ],
    };
  }
  if (pm10 <= 150 && pm25 <= 75) {
    return {
      action: "wait",
      headline: "환기는 잠시 미루세요",
      subtext: "미세먼지가 높아요. 30분 뒤 다시 확인하세요.",
      color: "text-orange-600",
      bgGradient: "from-orange-400 to-amber-500",
      factors: [
        `PM10 ${pm10}㎍/㎥ 나쁨`,
        `PM2.5 ${pm25}㎍/㎥ 나쁨`,
      ],
    };
  }
  return {
    action: "close",
    headline: "창문을 닫아두세요",
    subtext: "미세먼지가 매우 나쁩니다. 외출 시 마스크를 착용하세요.",
    color: "text-red-600",
    bgGradient: "from-red-500 to-rose-600",
    factors: [
      `PM10 ${pm10}㎍/㎥ 매우나쁨`,
      `PM2.5 ${pm25}㎍/㎥ 매우나쁨`,
    ],
  };
}

export function getLaundryAdvice(pm10: number, pm25: number): string {
  if (pm10 <= 30 && pm25 <= 15) return "야외 빨래 건조에 완벽한 날이에요.";
  if (pm10 <= 80 && pm25 <= 35) return "빨래 건조 괜찮아요. 오래 두지는 마세요.";
  if (pm10 <= 150 && pm25 <= 75) return "빨래는 실내에서 건조하세요.";
  return "빨래는 반드시 실내에서 건조하세요.";
}

export interface WeatherAdvice {
  weatherLabel: string;
  weatherIcon: string;
  temperature: number;
  humidity: number;
  windspeed: number;
  ventilationNote: string | null;
  laundryNote: string | null;
  outdoorNote: string | null;
  summary: string;
}

export function getWeatherAdvice(pm10: number, pm25: number, w: CurrentWeather): WeatherAdvice {
  const raining = isRaining(w.weathercode);
  const snowing = isSnowing(w.weathercode);
  const strongWind = w.windspeed >= 30;
  const highHumidity = w.humidity >= 80;
  const hotDay = w.temperature >= 33;
  const coldDay = w.temperature <= 0;

  let ventilationNote: string | null = null;
  let laundryNote: string | null = null;
  let outdoorNote: string | null = null;

  if (raining || snowing) {
    ventilationNote = raining ? "비가 내려 창문을 닫는 것이 좋아요." : "눈이 내려요. 창문을 닫아두세요.";
    laundryNote = "야외 건조 불가 — 실내에서 말리세요.";
    outdoorNote = raining ? "우산을 챙기세요." : "미끄럼에 주의하세요.";
  } else if (strongWind) {
    ventilationNote = `바람이 강해요(${w.windspeed}km/h). 짧은 환기를 추천해요.`;
    laundryNote = "바람에 빨래가 날릴 수 있어요. 고정해두세요.";
    outdoorNote = "강풍 주의 — 모자를 날릴 수 있어요.";
  } else if (hotDay) {
    ventilationNote = `기온이 ${w.temperature}°C로 높아요. 이른 아침에 환기하세요.`;
    laundryNote = "뜨거운 햇볕에 빨래가 빠르게 말라요.";
    outdoorNote = "자외선 차단제를 꼭 바르세요.";
  } else if (coldDay) {
    ventilationNote = `기온이 ${w.temperature}°C로 낮아요. 5분 이내 짧게 환기하세요.`;
    laundryNote = highHumidity ? "습도가 높아 야외 건조가 느려요." : "야외 건조 가능하지만 오래 걸릴 수 있어요.";
    outdoorNote = "방한 용품을 챙기세요.";
  } else if (highHumidity) {
    laundryNote = `습도 ${w.humidity}% — 야외 건조보다 실내 건조를 추천해요.`;
  }

  const pmBad = pm10 > 80 || pm25 > 35;
  const pmGood = pm10 <= 30 && pm25 <= 15;

  let summary = "";
  if (pmBad && (raining || snowing)) {
    summary = "미세먼지도 나쁘고 날씨도 나쁜 날이에요. 외출 시 마스크를 꼭 챙기세요.";
  } else if (pmGood && !raining && !snowing && !strongWind && !hotDay && !coldDay) {
    summary = "공기도 맑고 날씨도 좋아요! 환기와 야외 활동에 완벽한 날이에요.";
  } else if (pmBad) {
    summary = "미세먼지가 나쁜 날이에요. 환기를 줄이고 외출 시 마스크를 착용하세요.";
  } else if (raining) {
    summary = "비 오는 날이에요. 창문을 닫고 실내 활동을 권장해요.";
  } else {
    summary = `기온 ${w.temperature}°C, ${getWeatherLabel(w.weathercode)} — 평범한 하루예요.`;
  }

  return {
    weatherLabel: getWeatherLabel(w.weathercode),
    weatherIcon: getWeatherIcon(w.weathercode),
    temperature: w.temperature,
    humidity: w.humidity,
    windspeed: w.windspeed,
    ventilationNote,
    laundryNote,
    outdoorNote,
    summary,
  };
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
