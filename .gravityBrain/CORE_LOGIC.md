# CORE LOGIC — 환기 미세먼지 대시보드

> 마지막 갱신: 2026-05-04

## 1. API 캐싱 전략

- **방식**: Next.js `fetch()` 옵션 `next: { revalidate: 1800 }` (ISR)
- **적용 범위**: `airkorea.ts::fetchJson()`, `page.tsx (export const revalidate = 1800)`, `api/air-quality/route.ts`, `api/sido/route.ts`
- **이유**: 에어코리아 데이터는 1시간 단위 업데이트, 30분 캐시로 API 호출 최소화
- **주의**: `cache: no-store`와 `revalidate`를 동시에 쓰면 충돌 → revalidate 단독 사용

## 2. 측정소 ↔ 좌표 매핑 (station-mapping.ts)

- 에어코리아 API는 좌표를 제공하지 않음 → `STATION_COORDS` 수동 테이블로 관리
- 매핑 우선순위: `STATION_COORDS[stationName]` → `SIDO_CENTERS[sidoName]` → null (제외)
- 좌표 없는 측정소는 `buildMapMarkers()`에서 필터링됨
- 현재 약 170+ 측정소 좌표 등록 (서울 전체 + 수도권 주요 동/도로명 포함)
- `SIDO_CENTERS` fallback 시 `Math.random() * 0.8` 오프셋으로 겹침 방지

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
