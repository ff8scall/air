export interface StationItem {
  stationName: string;
  addr: string;
  stationCode?: string;
  dmX?: string;
  dmY?: string;
  tm?: string;
}

export interface TmCoordItem {
  sidoName: string;
  sggName: string;
  umdName: string;
  tmX: string;
  tmY: string;
}

export interface NearbyStation {
  stationName: string;
  addr: string;
  tm: string;
}

export interface MapMarkerData {
  stationName: string;
  lat: number;
  lng: number;
  pm10Value: string;
  pm25Value: string;
  khaiGrade: string;
  sidoName: string;
}
