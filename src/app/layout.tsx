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
const APP_URL = "https://air.antigravity.kr";

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | 전국 실시간 미세먼지`,
    description: "전국 실시간 미세먼지 지도, 환기 지수, 빨래 건조 지수",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: { telephone: false },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "환기 미세먼지 대시보드",
            description: "전국 실시간 미세먼지(PM10, PM2.5) 현황 지도와 환기 지수, 빨래 건조 지수를 제공하는 대기질 모니터링 앱",
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            url: APP_URL,
          }) }}
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
