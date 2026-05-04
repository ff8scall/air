export default function SeoJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "환기 미세먼지 대시보드",
    description:
      "전국 실시간 미세먼지(PM10, PM2.5) 현황 지도와 환기 지수, 빨래 건조 지수를 제공하는 대기질 모니터링 앱",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    url: "https://air.antigravity.kr",
    author: {
      "@type": "Organization",
      name: "Antigravity",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    featureList: [
      "실시간 미세먼지 PM10/PM2.5 조회",
      "전국 미세먼지 현황 지도",
      "환기 지수 계산",
      "빨래 건조 지수 계산",
      "PWA 모바일 앱 설치",
      "브라우저 푸시 알림",
    ],
    dataset: {
      "@type": "Dataset",
      name: "한국환경공단 에어코리아 실시간 대기오염 정보",
      description: "환경부 / 한국환경공단 에어코리아 제공 공공데이터",
      url: "https://www.airkorea.or.kr",
      license: "https://www.data.go.kr/ugs/selectPublicDataDetailView.do",
      creator: {
        "@type": "Organization",
        name: "한국환경공단",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
