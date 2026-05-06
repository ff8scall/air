# SYSTEM MAP — 환기 미세먼지 대시보드

> 마지막 갱신: 2026-05-04 (4차)

## 프로젝트 루트
```
c:\AI\Antigravity\Air\
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Server Component (revalidate 1800) → DashboardShell에 초기 데이터 전달
│   │   ├── [region]/
│   │   │   └── page.tsx              # [NEW] 지역별 동적 페이지 (SSG: generateStaticParams)
│   │   ├── layout.tsx                # 루트 레이아웃 + ThemeProvider + PWA/SEO 메타 (Naver/Bing 인증)
│   │   ├── globals.css               # Tailwind + @variant dark + Leaflet z-index 보정
│   │   ├── robots.ts                 # [NEW] 동적 robots.txt 생성
│   │   ├── sitemap.ts                # [NEW] 지역별 URL 포함 동적 sitemap.xml 생성
│   │   └── api/
│   │       ├── air-quality/route.ts
│   │       ├── sido/route.ts
│   │       ├── nearby/route.ts
│   │       ├── resolve-station/route.ts
│   │       └── weather/route.ts
│   ├── components/
│   │   ├── DashboardShell.tsx        # [Client] 지역 상태 관리 + 전체 레이아웃 렌더링 (initialStation 지원)
│   │   ├── HeroStatusCard.tsx        # 등급별 그라데이션 Hero
│   │   ├── StationSearchBar.tsx      # [Client] 인라인 검색바
│   │   ├── RegionalLinks.tsx         # [NEW] 하단 지역별 바로가기 링크 (Silo 구조)
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ActionAdviceCard.tsx
│   │   ├── NeighborhoodCompareCard.tsx
│   │   ├── ScoreCards.tsx
│   │   ├── AirQualityMap.tsx
│   │   ├── DynamicMap.tsx
│   │   ├── DynamicNotification.tsx
│   │   ├── NotificationSetup.tsx
│   │   ├── WeatherAdviceCard.tsx
│   │   └── icons.tsx
│   ├── hooks/
│   │   └── useUserStation.ts
│   ├── lib/
│   │   ├── airkorea.ts
│   │   ├── scoring.ts
│   │   ├── advisor.ts
│   │   ├── weather.ts
│   │   ├── regions.ts                # [NEW] 지역명-슬러그-측정소 매핑 데이터
│   │   ├── station-mapping.ts
│   │   └── station-coords-api.ts
│   └── types/
│       ├── air-quality.ts
│       └── station.ts
├── public/
│   ├── manifest.webmanifest
│   └── sw-custom.js
├── .env.local
└── next.config.ts
```

## 레이아웃 구조 (DashboardShell)

```
Header (sticky, z-50)
  └─ 로고 | 30분마다 갱신 | ThemeToggle | DynamicNotification

Main (max-w-6xl, grid lg:2열)
  ├─ 좌측 패널 (420px fixed)
  │   ├─ HeroStatusCard (날씨 pill: 기온/이모지/습도 우측)
  │   │   └─ [하단] StationSearchBar (검색창 + GPS + 초기화 + 성공 토스트)
  │   ├─ ActionAdviceCard (환기추천 + 근거칩 + 빨래조언)
  │   ├─ ScoreCards
  │   ├─ WeatherAdviceCard (날씨 요약 + 환기/빨래/외출 보정)
  │   ├─ NeighborhoodCompareCard
  │   └─ 등급 기준표
  └─ 우측 패널 (sticky top-[56px])
      └─ DynamicMap (center=선택지역, zoom=13)

Footer
```

## 데이터 흐름

```
[서버 초기 렌더]
  page.tsx (Server Component)
    ├─ fetchStationRealtime(DEFAULT_STATION) → initialLatest
    └─ fetchAllSidoRealtime() (17개 시도 병렬) + buildMapMarkers() → initialMarkers
          ↓ props
  DashboardShell (Client Component)

[클라이언트 지역 변경]
  StationSearchBar
    ├─ 동 이름 입력 → GET /api/resolve-station?umdName=
    └─ GPS 클릭   → GET /api/resolve-station?lat=&lng=
          ↓ { stationName, regionName }
  useUserStation → localStorage 저장
          ↓ station 변경 감지
  DashboardShell → GET /api/air-quality?station= → 리렌더
          ↓ mapCenter 변경 감지
  DashboardShell → GET /api/weather?lat=&lng= → weather state → WeatherAdviceCard

[좌표 조회 우선순위]
  station-mapping.ts::buildMapMarkers()
    1. STATION_COORDS_API[stationName]  ← 전국 672개 (에어코리아 API 기반)
    2. STATION_COORDS[stationName]      ← 기존 수동 테이블
    3. null → 필터 제거 (SIDO_CENTERS fallback 폐기)
```
