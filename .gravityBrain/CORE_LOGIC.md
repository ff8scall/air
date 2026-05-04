# CORE LOGIC — 환기 미세먼지 대시보드

> 마지막 갱신: 2026-05-04 (4차)

## 1. API 캐싱 전략

- **방식**: Next.js `fetch()` 옵션 `next: { revalidate: 1800 }` (ISR)
- **적용 범위**: `airkorea.ts::fetchJson()`, `page.tsx (export const revalidate = 1800)`, `api/air-quality/route.ts`, `api/sido/route.ts`
- **이유**: 에어코리아 데이터는 1시간 단위 업데이트, 30분 캐시로 API 호출 최소화
- **주의**: `cache: no-store`와 `revalidate`를 동시에 쓰면 충돌 → revalidate 단독 사용

## 2. 측정소 ↔ 좌표 매핑 (station-mapping.ts)

- **우선순위**: `STATION_COORDS_API` (672개, 에어코리아 getMsrstnList dmX/dmY) → `STATION_COORDS` (수동) → null 필터
- `SIDO_CENTERS` fallback **폐기** — 제주·강원 측정소가 바다에 찍히는 문제 근본 해결
- `station-coords-api.ts`: PowerShell로 전국 17개 시도 순회 수집 → 중복 제거 → 정적 TS 파일로 저장

## 3. 등급 판정 (scoring.ts::getGradeInfo)

| grade 값 | 라벨 | markerColor | textColor |
|---------|------|-------------|-----------|
| "1" | 좋음 | #0EA5E9 | text-sky-500 |
| "2" | 보통 | #22C55E | text-green-500 |
| "3" | 나쁨 | #F97316 | text-orange-500 |
| "4" | 매우나쁨 | #EF4444 | text-red-500 |
| "0"/기타 | 알 수 없음 | #6B7280 | text-gray-400 |

## 4. 환기/빨래 점수 계산 (scoring.ts)

```
calcVentilationScore(pm10, pm25):
  pm10 점수 = 100 - clamp(pm10 / 150 * 100, 0, 100)
  pm25 점수 = 100 - clamp(pm25 / 75 * 100, 0, 100)
  최종 = 평균값 반올림
  label: ≥75→"환기 최적", ≥50→"환기 가능", ≥25→"환기 주의", else "환기 금지"

calcLaundryScore(pm10, pm25): 동일 공식
  label: ≥75→"건조 최적", ≥50→"건조 가능", ≥25→"건조 주의", else "실내 건조"
```

## 5. 지도 마커 렌더링 (AirQualityMap.tsx)

- Leaflet `divIcon` + `makeLabelMarkerHtml()` 으로 말풍선형 라벨 마커 생성
- 마커 구성: `gradeMarkerSvg(등급)` SVG 얼굴 아이콘 + 등급 텍스트 + `PM10/PM2.5` 수치
- 클릭 시 `bindPopup`으로 상세 카드 팝업 (PM10/PM2.5 카드 + 등급 뱃지)
- 지도 기본값: `center=[37.502, 127.124]` (오금동), `zoom=11`
- `DynamicMap` wrapper에서 `center`/`zoom` props를 받아 전달

## 6. SVG 아이콘 시스템 (icons.tsx)

- 이모지 대신 전용 SVG로 OS/브라우저 무관 일관된 렌더링
- React 컴포넌트: `IconWind`, `IconSun`, `IconCloudSun`, `IconHome`, `IconMask`, `IconBan`, `IconLaundry`, `IconBell`, `IconMapPin`, `IconClock`, `IconRefresh`
- HTML 인젝션용 문자열 함수: `gradeMarkerSvg(grade)` — Leaflet divIcon 내부에 사용

## 7. PWA 구성

- `next-pwa` / `@ducanh2912/next-pwa` 제거 (Turbopack 충돌)
- 수동 방식: `public/manifest.webmanifest` + `public/sw-custom.js`
- 알림: `NotificationSetup.tsx`에서 `Notification.requestPermission()` + SW 메시지

## 8b. HeroStatusCard 역할 정리 (2026-05-04 변경)

- `ventilation` / `laundry` props **제거** — 하단 ScoreCards와 중복이었음
- 아이콘: `khaiGrade` 기준 `GradeIcon` 컴포넌트로 통일
  - grade 1 → `IconWind` / grade 2 → `IconWind opacity-75` / grade 3 → `IconMask` / grade 4 → `IconBan`
- 부제 문구: `GRADE_DESC` 상수로 grade별 고정 텍스트 관리
- Props: `{ data, stationName, regionName }` 3개로 축소

## 8c. NeighborhoodCompareCard UI 개선

- 현재 측정소: 한 줄 인라인 (`송파구 | PM10 30 / PM2.5 19 ㎍/㎥ | 보통 칩`)
- 주변 측정소: `text-base font-bold` + `PM10 / PM2.5` 레이블 + 거리(km) 표시
- 카드 순서: Hero → ActionAdviceCard → ScoreCards → NeighborhoodCompareCard → 등급기준표

## 9. advisor.ts — 행동 추천 로직

### getVentilationAdvice(pm10, pm25)

| 조건 | action | headline |
|---|---|---|
| pm10 ≤ 30 and pm25 ≤ 15 | open | 지금 환기하기 좋아요 (20분) |
| pm10 ≤ 50 and pm25 ≤ 25 | open | 짧게 환기하세요 (10분) |
| pm10 ≤ 80 and pm25 ≤ 35 | brief | 짧게만 환기하세요 (5분) |
| pm10 ≤ 150 and pm25 ≤ 75 | wait | 환기는 잠시 미루세요 |
| 그 외 | close | 창문을 닫아두세요 |

### getNeighborhoodInsight(station, lat, lng, markers, radius=10km, max=5)

- `haversineKm()` 으로 현재 위치 기준 거리 계산
- 반경 10km 내 측정소를 거리순 정렬, 최대 5개
- 등급 비교 → `bestDirection` 및 `summary` 텍스트 생성
- 출력: `{ current, nearby[], bestDirection, summary }`

## 10. 관심 지역 표기 원칙

- **관심 지역**: `송파구 오금동` (사용자 체감 위치)
- **실제 측정소**: `송파구` (에어코리아 구 단위 측정소)
- UI에 항상 "송파구 측정소 기준 · 인근 대표값" 표시로 혼선 방지
- 동 단위 측정소는 에어코리아에 없음 — 구 단위가 최소 단위

## 11. 다크모드 구현 (2026-05-04)

- **방식**: Tailwind v4 `@variant dark (&:where(.dark, .dark *))` — class 기반
- **토글**: `ThemeProvider`가 `html` 태그에 `.dark` 클래스 토글
- **저장**: `localStorage["air_theme"]` → `"light"` | `"dark"` | `"system"`
- **초기값**: `"system"` → `prefers-color-scheme` 미디어 쿼리 자동 감지
- **UI**: 헤더 내 `ThemeToggle` 버튼 (달/해 아이콘 전환)
- **컬러 전략**:
  - HeroStatusCard 그라데이션: 라이트 `sky-500→blue-600`, 다크 `sky-700→blue-900` (등급별)
  - ActionAdviceCard 배경: `from-sky-50 dark:from-sky-950` 계열
  - 카드 배경: `bg-white dark:bg-gray-900`
  - 페이지 배경: `bg-slate-50 dark:bg-gray-950`

## 12. 관심 지역 선택 기능 (2026-05-04)

### API: /api/resolve-station
- `?umdName=오금동` → `fetchTmCoord(umdName)` → TM좌표 → `fetchNearbyStations()` → 1순위 측정소
- `?lat=&lng=` → proj4 WGS84→TM 변환 → `fetchNearbyStations()` → 1순위 측정소
- 반환: `{ stationName, regionName, tmX, tmY }`

### Hook: useUserStation
- `localStorage["air_user_station"]` JSON 저장
- 반환: `{ station, setStation, clearStation, loaded }`
- `loaded` 플래그: hydration 전 기본값 노출 방지

### DashboardShell 클라이언트 흐름
- `loaded && station ≠ DEFAULT` → `/api/air-quality?station=` 재fetch
- `station` 변경 시 `useEffect` 트리거

## 13. StationSearchBar UX (2026-05-04)

- **항상 노출** 인라인 방식 (드롭다운 폐기)
- Hero 카드 하단 `border-t border-white/20` 구분선 아래 배치
- 구성: `[ 🔍 동 이름으로 검색 ··· ] [GPS] [✕]`
  - 검색 입력창: `bg-white/20` 반투명, `focus-within:bg-white/30`
  - GPS 버튼: `w-9 h-9` 아이콘 버튼
  - 초기화(✕): `onClear()` → `useUserStation.clearStation()`
- 에러: Hero 카드 안 `bg-black/20` 반투명 텍스트로 표시
- **성공 토스트**: 3초 `bg-white/20` 응답 카드 (`✓ 송파구 · 송파구 측정소로 변경됩니다`)

## 14. 날씨 접목 로직 (2026-05-04)

### lib/weather.ts
- `fetchCurrentWeather(lat, lng)` → Open-Meteo 무키 API 호출
- 반환: `{ temperature, humidity, windspeed, weathercode, precipitation }`
- WMO 코드 → 한글 라벨(`getWeatherLabel`) / 이모지(`getWeatherIcon`) 맵핑
- 강수(`isRaining`), 눈(`isSnowing`) 빬 픲릭한

### lib/advisor.ts::getWeatherAdvice(pm10, pm25, weather)

| 조건 | ventilationNote | laundryNote | outdoorNote |
|---|---|---|---|
| 비/눈 | 완창한 권고 | 실내 건조 | 우산/미끄러주의 |
| 강풍(≥30km/h) | 짧은 환기 | 빨래 고정 | 강풍 주의 |
| 폭염(≥33°C) | 이른 아침 환기 | 빠른 건조 | 자외선 차단제 |
| 한파(≤0°C) | 5분 이내 권고 | 실내 건조 | 방한 용품 |
| 고습도(≥80%) | null | 실내 건조 권식 | null |

- `summary`: PM + 날씨 교차 조합으로 5가지 종합 문구

### WeatherAdviceCard UI 구성
- 날씨 이모지 + 라벨 + summary 요약 바
- 기온/습도/풍속 칩 3개
- ventilationNote / laundryNote / outdoorNote NoteRow (아이콘 + 라벨 + 텍스트)

## 15. fetchAllSidoRealtime (2026-05-04)

- **문제**: `fetchSidoRealtime("전국")` → 에어코리아 `numOfRows=500` 한계에 곯튀램 경기도 5개만 포함 (126개 누락)
- **해결**: 17개 시도 `Promise.allSettled` 병렬 호출 후 `flatMap` 합산
- **특징**: 일부 시도 호출 실패해도 `allSettled`로 나머지 정상 노출
- **사용 위치**: `page.tsx` 서버 컴포넌트 (ISR revalidate 1800)

## 16. SeoJsonLd hydration 오류 (2026-05-04)

- **원인**: `SeoJsonLd` Server Component이 `<head>` 내 `<script dangerouslySetInnerHTML>`을 돌려줌 → `ThemeProvider` 클라이언트 hydration 시 `type=null` / `__html=""` 불일치
- **해결**: `SeoJsonLd.tsx` 컴포넌트 제거, `layout.tsx`의 `RootLayout` 함수 `<head>` 내 정적 `<script>` 직접 인라인
