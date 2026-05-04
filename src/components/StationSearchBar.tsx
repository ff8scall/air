"use client";
import { useState } from "react";
import type { UserStation } from "@/hooks/useUserStation";
import { IconMapPin } from "@/components/icons";

interface Props {
  currentRegionName: string;
  onStation: (s: UserStation) => void;
  onClear: () => void;
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconLocate({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function StationSearchBar({ currentRegionName, onStation, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function search(umdName: string) {
    if (!umdName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resolve-station?umdName=${encodeURIComponent(umdName.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "검색 실패");
        return;
      }
      onStation({
        stationName: data.stationName,
        regionName: data.regionName,
        updatedAt: Date.now(),
      });
      setOpen(false);
      setQuery("");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGps() {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }
    setGpsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `/api/resolve-station?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();
          if (!res.ok) {
            setError(data.error ?? "위치 기반 측정소를 찾지 못했습니다.");
            return;
          }
          onStation({
            stationName: data.stationName,
            regionName: data.regionName,
            updatedAt: Date.now(),
          });
          setOpen(false);
        } catch {
          setError("위치 정보 처리 중 오류가 발생했습니다.");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) setError("위치 권한이 거부되었습니다. 직접 검색해주세요.");
        else setError("위치를 가져올 수 없습니다.");
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="relative">
      {/* 현재 지역 표시 버튼 */}
      <button
        onClick={() => { setOpen((v) => !v); setError(null); }}
        className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium"
      >
        <IconMapPin className="w-3.5 h-3.5" />
        <span className="max-w-[120px] truncate">{currentRegionName}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {/* 드롭다운 패널 */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-[2000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">지역 변경</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* 검색창 */}
          <form
            onSubmit={(e) => { e.preventDefault(); search(query); }}
            className="flex gap-2 mb-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="동 이름 입력 (예: 오금동)"
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-xl px-3 py-2 transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
              ) : (
                <IconSearch className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* GPS 버튼 */}
          <button
            onClick={handleGps}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-700 py-2 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {gpsLoading ? (
              <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <IconLocate className="w-4 h-4" />
            )}
            현재 위치 사용
          </button>

          {/* 에러 */}
          {error && (
            <p className="mt-2 text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          {/* 초기화 */}
          <button
            onClick={() => { onClear(); setOpen(false); }}
            className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 py-1"
          >
            기본 지역으로 초기화
          </button>
        </div>
      )}
    </div>
  );
}
