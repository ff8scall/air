import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchStationRealtime, fetchAllSidoRealtime } from "@/lib/airkorea";
import { buildMapMarkers } from "@/lib/station-mapping";
import { resolveRegion, ALL_REGIONS } from "@/lib/regions";
import DashboardShell from "@/components/DashboardShell";

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: slug } = await params;
  const region = resolveRegion(slug);
  
  if (!region) return {};

  const title = `${region.fullName} 실시간 미세먼지 현황 및 환기 지수`;
  const description = `${region.fullName}의 현재 미세먼지(PM10), 초미세먼지(PM2.5) 농도와 창문 환기 적정 시간, 빨래 건조 지수를 실시간으로 확인하세요.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${region.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/${region.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return ALL_REGIONS.map((r) => ({
    region: r.slug,
  }));
}

export default async function RegionPage({ params }: Props) {
  const { region: slug } = await params;
  const region = resolveRegion(slug);

  if (!region) {
    notFound();
  }

  let latest = null;
  let markers: ReturnType<typeof buildMapMarkers> = [];
  let error: string | null = null;

  try {
    const [stationItems, sidoItems] = await Promise.all([
      fetchStationRealtime(region.stationName, "DAILY"),
      fetchAllSidoRealtime(),
    ]);
    latest = Array.isArray(stationItems) ? stationItems[0] ?? null : null;
    markers = buildMapMarkers(Array.isArray(sidoItems) ? sidoItems : []);
  } catch (e) {
    error = e instanceof Error ? e.message : "데이터 로드 중 오류가 발생했습니다.";
  }

  return (
    <DashboardShell
      initialLatest={latest}
      initialMarkers={markers}
      initialError={error}
      initialStationName={region.stationName}
      initialRegionName={region.fullName}
    />
  );
}
