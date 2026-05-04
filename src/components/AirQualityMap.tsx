"use client";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { MapMarkerData } from "@/types/station";
import { getGradeInfo } from "@/lib/scoring";
import { gradeMarkerSvg } from "@/components/icons";

interface Props {
  markers: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
}

function makeLabelMarkerHtml(info: ReturnType<typeof getGradeInfo>, m: MapMarkerData) {
  const pm10 = m.pm10Value && m.pm10Value !== "-" ? m.pm10Value : "?";
  const pm25 = m.pm25Value && m.pm25Value !== "-" ? m.pm25Value : "?";
  const faceSvg = gradeMarkerSvg(info.label);

  return `
    <div style="
      position:relative;
      display:inline-flex;align-items:center;gap:5px;
      background:${info.markerColor};
      color:white;
      border-radius:20px;
      padding:4px 9px 4px 5px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      font-size:11px;font-weight:700;
      box-shadow:0 2px 10px rgba(0,0,0,0.22);
      white-space:nowrap;
      cursor:pointer;
      border:1.5px solid rgba(255,255,255,0.35);
    ">
      <span style="display:flex;align-items:center;line-height:1">${faceSvg}</span>
      <span>${info.label}</span>
      <span style="opacity:0.8;font-weight:500;font-size:10px">${pm10}/${pm25}</span>
      <div style="
        position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:5px solid transparent;
        border-right:5px solid transparent;
        border-top:6px solid ${info.markerColor};
      "></div>
    </div>
  `;
}

export default function AirQualityMap({ markers, center = [36.5, 127.8], zoom = 7 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = mapRef.current;
    if (!container) return;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(container as HTMLElement, {
        zoomControl: false,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      map.setView(center, zoom);

      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;
        const grade = m.khaiGrade || "0";
        const info = getGradeInfo(grade);

        const labelIcon = L.divIcon({
          className: "",
          html: makeLabelMarkerHtml(info, m),
          iconAnchor: [0, 32],
        });

        const marker = L.marker([m.lat, m.lng], { icon: labelIcon });
        marker.bindPopup(`
          <div style="min-width:160px;font-family:'Noto Sans KR',sans-serif;padding:2px">
            <p style="font-weight:700;font-size:14px;margin:0 0 2px">${m.stationName}</p>
            <p style="color:#6b7280;font-size:11px;margin:0 0 8px">${m.sidoName}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
              <div style="background:#f8fafc;border-radius:8px;padding:6px 8px">
                <p style="color:#94a3b8;font-size:10px;margin:0">PM10</p>
                <p style="font-weight:700;font-size:18px;margin:0">${m.pm10Value || "—"}</p>
                <p style="color:#94a3b8;font-size:9px;margin:0">㎍/㎥</p>
              </div>
              <div style="background:#f8fafc;border-radius:8px;padding:6px 8px">
                <p style="color:#94a3b8;font-size:10px;margin:0">PM2.5</p>
                <p style="font-weight:700;font-size:18px;margin:0">${m.pm25Value || "—"}</p>
                <p style="color:#94a3b8;font-size:9px;margin:0">㎍/㎥</p>
              </div>
            </div>
            <div style="text-align:center">
              <span style="
                background:${info.markerColor};color:white;
                padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700
              ">${info.label}</span>
            </div>
          </div>
        `, { maxWidth: 200 });
        marker.addTo(map);
      });
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, center, zoom]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-md text-xs flex items-center gap-3 z-[1000]">
        <span className="text-gray-400 font-semibold mr-1">범례</span>
        {[1, 2, 3, 4].map((g) => {
          const info = getGradeInfo(g);
          return (
            <span key={g} className="flex items-center gap-1.5">
              <span style={{ background: info.markerColor }} className="inline-block w-2.5 h-2.5 rounded-full" />
              <span className="text-gray-600 font-medium">{info.label}</span>
            </span>
          );
        })}
      </div>
      {/* 지도 설명 */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow text-xs text-gray-500 z-[1000]">
        숫자: PM10 / PM2.5 (㎍/㎥)
      </div>
    </div>
  );
}
