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
  const [success, setSuccess] = useState<string | null>(null);

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  }

  async function search(umdName: string) {
    if (!umdName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resolve-station?umdName=${encodeURIComponent(umdName.trim())}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "검색 실패"); return; }
      onStation({ stationName: data.stationName, regionName: data.regionName, updatedAt: Date.now() });
      setQuery("");
      showSuccess(`${data.regionName} · ${data.stationName} 측정소로 변경됐어요`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGps() {
    if (!navigator.geolocation) { setError("위치 서비스를 지원하지 않는 브라우저입니다."); return; }
    setGpsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`/api/resolve-station?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          if (!res.ok) { setError(data.error ?? "위치 기반 측정소를 찾지 못했습니다."); return; }
          onStation({ stationName: data.stationName, regionName: data.regionName, updatedAt: Date.now() });
          showSuccess(`현재 위치 · ${data.stationName} 측정소로 변경됐어요`);
        } catch {
          setError("위치 정보 처리 중 오류가 발생했습니다.");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) setError("위치 권한이 거부되었습니다.");
        else setError("위치를 가져올 수 없습니다.");
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="w-full">
      {/* 현재 지역 표시 */}
      <div className="flex items-center gap-1.5 mb-2">
        <IconMapPin className="w-3.5 h-3.5 text-white/60 shrink-0" />
        <span className="text-white/80 text-sm font-medium truncate">{currentRegionName}</span>
      </div>

      {/* 인라인 검색바 */}
      <form
        onSubmit={(e) => { e.preventDefault(); search(query); }}
        className="flex items-center gap-1.5"
      >
        <div className="flex-1 flex items-center gap-2 bg-white/20 hover:bg-white/25 focus-within:bg-white/30 rounded-xl px-3 py-2 transition-colors">
          <IconSearch className="w-3.5 h-3.5 text-white/50 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="동 이름으로 검색"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none min-w-0"
          />
          {loading && (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
          )}
        </div>

        {/* GPS 버튼 */}
        <button
          type="button"
          onClick={handleGps}
          disabled={gpsLoading}
          title="현재 위치 사용"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
        >
          {gpsLoading
            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <IconLocate className="w-4 h-4 text-white/80" />
          }
        </button>

        {/* 초기화 버튼 */}
        <button
          type="button"
          onClick={onClear}
          title="기본 지역으로 초기화"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
        >
          <IconX className="w-3.5 h-3.5 text-white/70" />
        </button>
      </form>

      {/* 에러 */}
      {error && (
        <p className="mt-2 text-xs text-white/90 bg-black/20 rounded-lg px-3 py-1.5">{error}</p>
      )}

      {/* 성공 */}
      {success && (
        <p className="mt-2 text-xs text-white/90 bg-white/20 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <span>✓</span>{success}
        </p>
      )}
    </div>
  );
}
