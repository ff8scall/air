export function IconWind({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}

export function IconSun({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function IconCloudSun({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41" />
      <path d="M13 16a5 5 0 1 0-4.9-4H8a3 3 0 0 0 0 6h5" />
      <circle cx="16" cy="8" r="2" />
    </svg>
  );
}

export function IconHome({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function IconMask({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11c0-1 .6-2 1.5-2.5L12 5l7.5 3.5C20.4 9 21 10 21 11v2c0 3.3-4 6-9 6s-9-2.7-9-6v-2z" />
      <path d="M9 11s1 1 3 1 3-1 3-1" />
      <path d="M3 11s0 3 0 3" />
      <path d="M21 11s0 3 0 3" />
    </svg>
  );
}

export function IconBan({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

export function IconLaundry({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M6 7h.01" />
      <path d="M9 7h.01" />
    </svg>
  );
}

export function IconBell({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function IconRefresh({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

/** 지도 마커용: 등급별 얼굴 SVG 문자열 반환 (HTML 인젝션용) */
export function gradeMarkerSvg(grade: string): string {
  const faces: Record<string, string> = {

    // 😊 좋음 — 초승달 웃음, 반짝이는 눈, 핑크 볼터치
    "좋음": `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19" fill="white" fill-opacity="0.22"/>
      <!-- 볼터치 -->
      <ellipse cx="11" cy="25" rx="4" ry="2.5" fill="white" fill-opacity="0.25"/>
      <ellipse cx="29" cy="25" rx="4" ry="2.5" fill="white" fill-opacity="0.25"/>
      <!-- 눈 (반짝 하이라이트 포함) -->
      <circle cx="14" cy="17" r="3.2" fill="white"/>
      <circle cx="26" cy="17" r="3.2" fill="white"/>
      <circle cx="14.9" cy="15.9" r="1.1" fill="rgba(0,0,0,0.12)"/>
      <circle cx="26.9" cy="15.9" r="1.1" fill="rgba(0,0,0,0.12)"/>
      <circle cx="13.3" cy="15.5" r="0.7" fill="white"/>
      <circle cx="25.3" cy="15.5" r="0.7" fill="white"/>
      <!-- 웃음 -->
      <path d="M12 24 Q20 31 28 24" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </svg>`,

    // 😐 보통 — 동그란 눈, 평평한 입
    "보통": `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19" fill="white" fill-opacity="0.22"/>
      <!-- 눈 -->
      <circle cx="14" cy="17" r="3" fill="white"/>
      <circle cx="26" cy="17" r="3" fill="white"/>
      <circle cx="14.8" cy="16.2" r="1.1" fill="rgba(0,0,0,0.12)"/>
      <circle cx="26.8" cy="16.2" r="1.1" fill="rgba(0,0,0,0.12)"/>
      <circle cx="13.4" cy="15.8" r="0.7" fill="white"/>
      <circle cx="25.4" cy="15.8" r="0.7" fill="white"/>
      <!-- 일자 입 -->
      <line x1="13" y1="26" x2="27" y2="26" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

    // 😟 나쁨 — 찡그린 눈썹, 뒤집힌 입
    "나쁨": `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19" fill="white" fill-opacity="0.22"/>
      <!-- 찡그린 눈썹 -->
      <path d="M11 13 Q14 11 17 13" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <path d="M23 13 Q26 11 29 13" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <!-- 눈 -->
      <circle cx="14" cy="17" r="2.8" fill="white"/>
      <circle cx="26" cy="17" r="2.8" fill="white"/>
      <circle cx="14.7" cy="16.3" r="1" fill="rgba(0,0,0,0.12)"/>
      <circle cx="26.7" cy="16.3" r="1" fill="rgba(0,0,0,0.12)"/>
      <!-- 뒤집힌 입 -->
      <path d="M13 28 Q20 22 27 28" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </svg>`,

    // 😷 매우나쁨 — X눈, 마스크
    "매우나쁨": `<svg viewBox="0 0 40 40" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19" fill="white" fill-opacity="0.22"/>
      <!-- X 눈 -->
      <line x1="11" y1="13" x2="16" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="16" y1="13" x2="11" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="24" y1="13" x2="29" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="29" y1="13" x2="24" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <!-- 마스크 -->
      <rect x="10" y="22" width="20" height="10" rx="4" fill="white" fill-opacity="0.35"/>
      <line x1="10" y1="27" x2="30" y2="27" stroke="white" stroke-width="1" stroke-opacity="0.5"/>
    </svg>`,
  };
  return faces[grade] ?? faces["보통"];
}
