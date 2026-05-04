"use client";
import { useState, useEffect } from "react";

export interface UserStation {
  stationName: string;
  regionName: string;
  lat?: number;
  lng?: number;
  updatedAt: number;
}

const STORAGE_KEY = "air_user_station";

const DEFAULT_STATION: UserStation = {
  stationName: process.env.NEXT_PUBLIC_DEFAULT_STATION ?? "송파구",
  regionName: process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "송파구 오금동",
  updatedAt: 0,
};

export function useUserStation() {
  const [station, setStationState] = useState<UserStation>(DEFAULT_STATION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserStation;
        if (parsed.stationName) setStationState(parsed);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function setStation(s: UserStation) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      // ignore
    }
    setStationState(s);
  }

  function clearStation() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStationState(DEFAULT_STATION);
  }

  return { station, setStation, clearStation, loaded };
}
