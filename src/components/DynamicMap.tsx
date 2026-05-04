"use client";
import dynamic from "next/dynamic";
import type { MapMarkerData } from "@/types/station";

const AirQualityMap = dynamic(() => import("@/components/AirQualityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
      지도 불러오는 중...
    </div>
  ),
});

interface Props {
  markers: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
}

export default function DynamicMap({ markers, center, zoom }: Props) {
  return <AirQualityMap markers={markers} center={center} zoom={zoom} />;
}
