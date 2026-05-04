export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windspeed: number;
  weathercode: number;
  precipitation: number;
}

const WMO_LABEL: Record<number, string> = {
  0: "맑음", 1: "대체로 맑음", 2: "부분 흐림", 3: "흐림",
  45: "안개", 48: "안개",
  51: "이슬비", 53: "이슬비", 55: "이슬비",
  61: "비", 63: "비", 65: "강한 비",
  71: "눈", 73: "눈", 75: "강한 눈",
  80: "소나기", 81: "소나기", 82: "강한 소나기",
  95: "뇌우", 96: "뇌우", 99: "뇌우",
};

const WMO_ICON: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

export function getWeatherLabel(code: number): string {
  return WMO_LABEL[code] ?? "알 수 없음";
}

export function getWeatherIcon(code: number): string {
  return WMO_ICON[code] ?? "🌡️";
}

export function isRaining(code: number): boolean {
  return [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
}

export function isSnowing(code: number): boolean {
  return [71, 73, 75].includes(code);
}

export async function fetchCurrentWeather(lat: number, lng: number): Promise<CurrentWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation` +
    `&timezone=Asia%2FSeoul&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Open-Meteo 요청 실패: ${res.status}`);

  const json = await res.json();
  const c = json?.current;
  if (!c) throw new Error("Open-Meteo 응답 형식 오류");

  return {
    temperature: Math.round(c.temperature_2m ?? 0),
    humidity: Math.round(c.relative_humidity_2m ?? 0),
    windspeed: Math.round(c.wind_speed_10m ?? 0),
    weathercode: c.weather_code ?? 0,
    precipitation: c.precipitation ?? 0,
  };
}
