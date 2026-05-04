# SYSTEM MAP — 환기 미세먼지 대시보드

> 마지막 갱신: 2026-05-04 (3차)

## 프로젝트 루트
```
c:\AI\Antigravity\Air\
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Server Component (revalidate 1800) → DashboardShell에 초기 데이터 전달
│   │   ├── layout.tsx                # 루트 레이아웃 + ThemeProvider 래핑 + PWA 메타
│   │   ├── globals.css               # Tailwind + @variant dark + Leaflet z-index 보정
│   │   └── api/
│   │       ├── air-quality/route.ts  # GET /api/air-quality?station=
│   │       ├── sido/route.ts         # GET /api/sido?sido=
│   │       ├── nearby/route.ts       # GET /api/nearby
│   │       └── resolve-station/route.ts # GET ?umdName= 또는 ?lat=&lng= → { stationName, regionName }
│   ├── components/
│   │   ├── DashboardShell.tsx        # [Client] 지역 상태 관리 + 전체 레이아웃 렌더링
│   │   ├── HeroStatusCard.tsx        # 등급별 그라데이션 Hero + 인라인 검색바 하단 배치
│   │   ├── StationSearchBar.tsx      # [Client] 항상 노출 인라인 검색바 (동 이름 + GPS + 초기화)
│   │   ├── ThemeProvider.tsx         # [Client] html.dark 클래스 토글 + localStorage 저장
│   │   ├── ThemeToggle.tsx           # [Client] 헤더 내 달/해 토글 버튼
│   │   ├── ActionAdviceCard.tsx      # 창문 환기 타이밍 행동 추천 카드
│   │   ├── NeighborhoodCompareCard.tsx # 주변 측정소 비교 카드 (10km 반경)
│   │   ├── ScoreCards.tsx            # 환기/빨래 지수 링 카드
│   │   ├── AirQualityMap.tsx         # Leaflet 지도 + 말풍선형 SVG 마커
│   │   ├── DynamicMap.tsx            # AirQualityMap ssr:false wrapper
│   │   ├── DynamicNotification.tsx   # NotificationSetup ssr:false wrapper
│   │   ├── NotificationSetup.tsx     # 알림 권한 요청 버튼
│   │   ├── SeoJsonLd.tsx             # JSON-LD 구조화 데이터
│   │   └── icons.tsx                 # 전용 SVG 아이콘 + gradeMarkerSvg()
│   ├── hooks/
│   │   └── useUserStation.ts         # [Client] localStorage 기반 선택 측정소 관리
│   ├── lib/
│   │   ├── airkorea.ts               # 에어코리아 API 클라이언트 (revalidate 1800)
│   │   ├── scoring.ts                # 환기/빨래 점수 계산 + getGradeInfo()
│   │   ├── advisor.ts                # 행동 추천 로직 (VentilationAdvice, NeighborhoodInsight)
│   │   ├── station-mapping.ts        # buildMapMarkers() — STATION_COORDS_API 1순위
│   │   └── station-coords-api.ts     # [NEW] 에어코리아 getMsrstnList 기반 전국 672개 측정소 좌표
│   └── types/
│       ├── air-quality.ts
│       └── station.ts
├── public/
│   ├── manifest.webmanifest
│   └── sw-custom.js
├── .env.local                        # AIRKOREA_SERVICE_KEY, DEFAULT_STATION, DEFAULT_REGION
└── next.config.ts
```

## 레이아웃 구조 (DashboardShell)

```
Header (sticky, z-50)
  └─ 로고 | 30분마다 갱신 | ThemeToggle | DynamicNotification

Main (max-w-6xl, grid lg:2열)
  ├─ 좌측 패널 (420px fixed)
  │   ├─ HeroStatusCard
  │   │   └─ [하단] StationSearchBar (항상 노출 — 검색창 + GPS + 초기화)
  │   ├─ ActionAdviceCard
  │   ├─ ScoreCards
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
    └─ fetchSidoRealtime + buildMapMarkers() → initialMarkers
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

[좌표 조회 우선순위]
  station-mapping.ts::buildMapMarkers()
    1. STATION_COORDS_API[stationName]  ← 전국 672개 (에어코리아 API 기반)
    2. STATION_COORDS[stationName]      ← 기존 수동 테이블
    3. null → 필터 제거 (SIDO_CENTERS fallback 폐기)
```
