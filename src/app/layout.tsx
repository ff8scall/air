import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "환기 미세먼지 대시보드";
const APP_URL = "https://air.lego-sia.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} | 전국 실시간 미세먼지`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "전국 실시간 미세먼지(PM10, PM2.5) 현황 지도와 환기 지수, 빨래 건조 지수를 제공하는 공기질 모니터링 PWA 앱. 에어코리아 공공데이터 기반.",
  keywords: ["미세먼지", "PM10", "PM2.5", "공기질", "환기지수", "빨래건조지수", "에어코리아", "실시간대기오염"],
  authors: [{ name: "Antigravity" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: APP_URL,
    title: `${APP_NAME} | 전국 실시간 미세먼지`,
    description: "전국 실시간 미세먼지 지도, 환기 지수, 빨래 건조 지수 — 에어코리아 공공데이터 기반",
    siteName: APP_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | 전국 실시간 미세먼지`,
    description: "전국 실시간 미세먼지 지도, 환기 지수, 빨래 건조 지수",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: { telephone: false },
  verification: {
    other: {
      "naver-site-verification": "8cf0af0a2279235d80283e172598be7d448f5b6b",
      "msvalidate.01": "048AB450B6B91E03CAF13FDE8415F954",
    },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: APP_NAME,
              description: "전국 실시간 미세먼지(PM10, PM2.5) 현황 지도와 환기 지수, 빨래 건조 지수를 제공하는 대기질 모니터링 앱",
              applicationCategory: "HealthApplication",
              operatingSystem: "All",
              url: APP_URL,
              author: {
                "@type": "Organization",
                name: "Antigravity",
                url: "https://lego-sia.com"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Dataset",
              name: "전국 실시간 대기오염물질 측정 정보",
              description: "한국환경공단(에어코리아)에서 제공하는 전국 측정소별 실시간 대기오염도(PM10, PM2.5, KHAI) 데이터셋",
              url: APP_URL,
              license: "https://www.data.go.kr/dataset/15000581/fileData.do",
              isAccessibleForFree: true,
              creator: {
                "@type": "Organization",
                name: "한국환경공단"
              }
            }
          ]) }}
        />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${notoSansKr.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
