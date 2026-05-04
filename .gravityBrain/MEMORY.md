# MEMORY — 다음 세션을 위한 맥락

> 마지막 갱신: 2026-05-04 (2차)

## 현재 상태 요약

- **앱**: 환기 미세먼지 대시보드 (Next.js 16.2.4 + TypeScript + Tailwind + Leaflet)
- **경로**: `c:\AI\Antigravity\Air\`
- **기본 관심 지역**: 송파구 오금동 → 실제 측정소: `송파구`
- **빌드 상태**: ✅ 정상 (`tsc --noEmit` + `npm run build` 통과)
- **dev 서버**: `http://localhost:3000`
- **지도 기본 zoom**: 13 (오금동 중심)

## 누적 완료 작업

### 초기 구조
- HeroStatusCard, ScoreCards, 하이브리드 2열 레이아웃
- SVG 아이콘 시스템 (`icons.tsx`), 이모지 전면 제거
- station-mapping.ts 170+ 측정소 좌표

### 이번 세션 (킥 기능)
1. **`lib/advisor.ts` 신규** — `getVentilationAdvice`, `getLaundryAdvice`, `getNeighborhoodInsight`
2. **`ActionAdviceCard.tsx` 신규** — PM 기준 5단계 환기 타이밍 카드 (20분/10분/5분/대기/금지)
3. **`NeighborhoodCompareCard.tsx` 신규** — 반경 10km 내 최대 5개 측정소 비교
4. **카드 순서 확정**: Hero → 환기추천 → ScoreCards → 동네비교 → 등급기준표
5. **HeroStatusCard 정리**: ventilation/laundry props 제거, GradeIcon + GRADE_DESC로 단순화
6. **NeighborhoodCompareCard UI**: 현재 측정소 한 줄 인라인, 주변 수치 가독성 개선
7. **지도 수정**: `ssr:false` dynamic에 `loading` 콜백 추가 → BailoutToCSR 해결
8. **`next.config.ts`**: `allowedDevOrigins` 추가 → HMR WebSocket 경고 해소

## 알려진 한계 / 잠재적 TODO

- 마커 줌 아웃 시 겹침 → `leaflet.markercluster` 도입 고려
- SW 푸시 알림: 권한 요청까지만 구현, 서버 푸시 미구현
- 관심 지역 변경 기능 미구현 (현재 env 고정)
- 다크모드 미지원

## 환경 변수 (.env.local)

```
AIRKOREA_SERVICE_KEY=f095a73a6d8ff681e2c7ab78b7488d895a91b64860bf8af230f64cd223257e45
NEXT_PUBLIC_DEFAULT_STATION=송파구
NEXT_PUBLIC_DEFAULT_REGION=송파구 오금동
```

## 다음 세션 진입점

1. **마커 클러스터링**: `leaflet.markercluster` 설치 후 `AirQualityMap.tsx` 수정
2. **관심 지역 변경**: 동 이름 검색 → 인근 측정소 자동 선택 (localStorage 저장)
3. **알림 프리셋**: 환기/빨래/산책 조건별 목적 알림 선택 UI
