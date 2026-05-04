# MEMORY — 다음 세션을 위한 맥락

> 마지막 갱신: 2026-05-04 (4차)

## 현재 상태 요약

- **앱**: 환기 미세먼지 대시보드 (Next.js 16.2.4 + TypeScript + Tailwind v4 + Leaflet)
- **경로**: `c:\AI\Antigravity\Air\`
- **기본 관심 지역**: 송파구 오금동 → 실제 측정소: `송파구`
- **빌드 상태**: ✅ 정상 (`tsc --noEmit` + `npm run build` 통과)
- **GitHub**: main 브랜치, 최신 커밋 push 완료

## 누적 완료 작업

### 세션 1 — 기초 UI
- HeroStatusCard, ScoreCards, ActionAdviceCard, NeighborhoodCompareCard
- SVG 아이콘 시스템, advisor.ts, 2열 레이아웃

### 세션 2 — 관심 지역 + 다크모드 + 지도 개선 (이번)
1. **관심 지역 변경** — `/api/resolve-station`, `useUserStation`, `DashboardShell`, `StationSearchBar`
2. **다크모드** — `ThemeProvider`(class 기반) + `ThemeToggle` + 전 컴포넌트 `dark:` 클래스
3. **지도 좌표 정확화** — `station-coords-api.ts` (에어코리아 API 전국 672개), `SIDO_CENTERS` fallback 폐기
4. **검색 UX 개선** — 드롭다운 → Hero 카드 하단 항상 노출 인라인 검색바

### 세션 3 — Phase 1A + Phase 2 (이번)
1. **지도 center 연동** — `getStationCoords()` + `DashboardShell` center/neighborhood 연동 완료
2. **추천 근거 칩** — `VentilationAdvice.factors[]` + `ActionAdviceCard` 칩 표시
3. **KHai/PM 혼선 안내** — KHai > PM 단독등급일 때 HeroStatusCard 인라인 안내
4. **검색 성공 피드백** — StationSearchBar 검색/GPS 성공 시 3초 토스트
5. **날씨 접목 (Phase 2)** — Open-Meteo API + `lib/weather.ts` + `/api/weather` + `WeatherAdviceCard`
6. **HeroStatusCard 날씨 pill** — 기온/날씨이모지/습도 우측 인라인 표시
7. **fetchAllSidoRealtime** — `sidoName=전국` 500개 한계 → 17개 시도 병렬 호출로 경기도 마커 복원
8. **SeoJsonLd hydration 오류 수정** — 컴포넌트 제거, `layout.tsx` 직접 인라인

## 알려진 한계 / 잠재적 TODO

- 마커 줌 아웃 시 겹침 → `leaflet.markercluster` 도입 고려
- SW 푸시 알림: 권한 요청까지만 구현, 서버 푸시 미구현
- 동 이름 중복 시 첫 번째 결과 사용 (재검색 UX 미구현)
- `fetchAllSidoRealtime` — 17개 시도 × API 호출, 빌드 시 부하 고려

## 환경 변수 (.env.local)

```
AIRKOREA_SERVICE_KEY=f095a73a6d8ff681e2c7ab78b7488d895a91b64860bf8af230f64cd223257e45
NEXT_PUBLIC_DEFAULT_STATION=송파구
NEXT_PUBLIC_DEFAULT_REGION=송파구 오금동
```

## 다음 세션 진입점

1. **마커 클러스터링**: `leaflet.markercluster` 설치 후 `AirQualityMap.tsx` 수정
2. **알림 프리셋**: 환기/빨래/산책 조건별 목적 알림 선택 UI
3. **날씨 Phase 3**: 내일 예보 추가 (Open-Meteo hourly/daily)
