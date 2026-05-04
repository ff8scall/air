# SYSTEM MAP — 환기 미세먼지 대시보드

> 마지막 갱신: 2026-05-04

## 프로젝트 루트
```
c:\AI\Antigravity\Air\
├── src/
│   ├── app/
│   │   ├── page.tsx                  # 메인 페이지 (Server Component, revalidate 1800)
│   │   ├── layout.tsx                # 루트 레이아웃 + PWA 메타
│   │   ├── globals.css               # Tailwind 기본 + Leaflet z-index 보정
│   │   └── api/
│   │       ├── air-quality/route.ts  # GET /api/air-quality?station=&dataTerm=
│   │       ├── sido/route.ts         # GET /api/sido?sido=
│   │       └── nearby/route.ts       # GET /api/nearby
│   ├── components/
│   │   ├── HeroStatusCard.tsx        # [NEW] 등급별 그라데이션 Hero 카드
│   │   ├── AirQualityMap.tsx         # Leaflet 지도 + 말풍선형 SVG 마커
│   │   ├── ScoreCards.tsx            # 환기/빨래 지수 링 카드
│   │   ├── InterestRegionCard.tsx    # (보조) 상세 수치 카드
│   │   ├── GradeBadge.tsx            # 등급 뱃지
│   │   ├── DynamicMap.tsx            # AirQualityMap ssr:false wrapper (center/zoom 전달)
│   │   ├── DynamicNotification.tsx   # NotificationSetup ssr:false wrapper
│   │   ├── NotificationSetup.tsx     # 알림 권한 요청 버튼 (헤더 내 compact)
│   │   ├── icons.tsx                 # 전용 SVG 아이콘 + gradeMarkerSvg()
│   │   ├── ActionAdviceCard.tsx      # [NEW] 창문 환기 타이밍 행동 추천 카드
│   │   └── NeighborhoodCompareCard.tsx # [NEW] 주변 측정소 비교 카드
│   ├── lib/
│   │   ├── airkorea.ts               # 에어코리아 API 클라이언트 (revalidate 1800)
│   │   ├── scoring.ts                # 환기/빨래 점수 계산 + getGradeInfo()
│   │   ├── station-mapping.ts        # stationName → [lat, lng] 매핑 테이블 (170+)
│   │   └── advisor.ts                # [NEW] 행동 추천 로직 (VentilationAdvice, NeighborhoodInsight)
│   └── types/
│       ├── air-quality.ts
│       └── station.ts
├── public/
│   ├── manifest.webmanifest          # PWA 매니페스트
│   └── sw-custom.js                  # 수동 Service Worker
├── .env.local                        # AIRKOREA_SERVICE_KEY, DEFAULT_STATION=송파구, DEFAULT_REGION=송파구 오금동
└── next.config.ts                    # allowedDevOrigins: [127.0.0.1, localhost]
```

## 레이아웃 구조 (page.tsx)

```
Header (sticky, z-50)
  └─ 로고 | 30분마다 갱신 | DynamicNotification (알림 버튼)

Main (max-w-6xl, grid lg:2열)
  ├─ 좌측 패널 (420px fixed)
  │   ├─ HeroStatusCard          ← 등급 그라데이션 + PM 수치 + 환기/빨래 미니 뱃지
  │   ├─ ActionAdviceCard        ← [NEW] 창문 열 타이밍 행동 추천 + 빨래 조언
  │   ├─ NeighborhoodCompareCard ← [NEW] 주변 측정소 비교 (10km 반경)
  │   ├─ ScoreCards              ← 환기 / 빨래 건조 링 카드
  │   └─ 등급 기준표 (inline list)
  └─ 우측 패널 (sticky top-[56px], h-[calc(100vh-56px)])
      └─ DynamicMap           ← Leaflet 지도 (center=오금동, zoom=13)

Footer
```

## 데이터 흐름

```
에어코리아 API
  ↓ (fetch, revalidate: 1800s)
airkorea.ts
  ├─ fetchStationRealtime(송파구) → latest (AirQualityItem)
  └─ fetchSidoRealtime(전국)      → sidoItems[]
        ↓
  station-mapping.ts::buildMapMarkers() → MapMarkerData[]
        ↓
  page.tsx (Server Component)
  ├─ HeroStatusCard            ← latest (ventilation/laundry props 제거됨)
  ├─ ActionAdviceCard          ← advice (VentilationAdvice) + laundryAdvice
  ├─ NeighborhoodCompareCard   ← neighborhood (NeighborhoodResult)
  ├─ ScoreCards                ← ventilation + laundry
  └─ DynamicMap                ← markers[], center, zoom
```
