export type GradeLevel = 1 | 2 | 3 | 4;

export interface AirQualityItem {
  dataTime: string;
  stationName: string;
  pm10Value: string;
  pm25Value: string;
  pm10Grade: string;
  pm25Grade: string;
  pm10Grade1h: string;
  pm25Grade1h: string;
  khaiValue: string;
  khaiGrade: string;
  so2Value: string;
  so2Grade: string;
  coValue: string;
  coGrade: string;
  o3Value: string;
  o3Grade: string;
  no2Value: string;
  no2Grade: string;
  pm10Flag: string | null;
  pm25Flag: string | null;
}

export interface SidoAirItem {
  stationName: string;
  sidoName: string;
  pm10Value: string;
  pm25Value: string;
  pm10Grade: string;
  pm25Grade: string;
  khaiGrade: string;
  khaiValue: string;
  dataTime: string;
}

export interface GradeInfo {
  label: "좋음" | "보통" | "나쁨" | "매우나쁨" | "알 수 없음";
  color: string;
  bgColor: string;
  textColor: string;
  markerColor: string;
}

export interface VentilationScore {
  score: number;
  label: string;
  description: string;
  color: string;
}

export interface LaundryScore {
  score: number;
  label: string;
  description: string;
  color: string;
}
