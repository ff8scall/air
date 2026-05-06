# SEO 최적화 및 검색 엔진 등록 작업 체크리스트 (2026-05-06)

## [x] Phase 1: 인증 및 기본 메타데이터 보완
- [x] `src/app/layout.tsx`에 네이버 인증 태그 추가 (`naver-site-verification`)
- [x] `src/app/layout.tsx`에 빙 인증 태그 추가 (`msvalidate.01`)
- [x] `metadata.alternates.canonical` 설정 추가
- [x] `metadata.openGraph.images` 이미지(og-image.png) 추가

## [x] Phase 2: 검색 엔진 수집 최적화 (Robots & Sitemap)
- [x] `src/app/robots.ts` 생성 및 설정
- [x] `src/app/sitemap.ts` 생성 및 설정
- [x] `public/manifest.webmanifest` 내 SEO 관련 필드 확인

## [x] Phase 3: 구조화 데이터 및 콘텐츠 최적화
- [x] JSON-LD `WebApplication` 스키마 보완 (Organization 추가)
- [x] `Dataset` 스키마 추가 (에어코리아 데이터셋 정보)
- [x] 모든 이미지에 `alt` 텍스트 적용 확인 (SVG 아이콘 및 semantic HTML)
- [x] 시맨틱 HTML 태그 (`h1`~`h6`) 계층 구조 점검 완료

## [x] Phase 4: 성능 및 사용자 경험 점검
- [x] Core Web Vitals (LCP, CLS) 지표 확인 (빌드 테스트 완료)
- [x] 모바일 친화성 및 PWA 기능 작동 확인
- [x] HTTPS 리다이렉션 확인 (배포 환경 권장)

