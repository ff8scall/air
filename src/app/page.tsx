import { fetchStationRealtime, fetchAllSidoRealtime } from "@/lib/airkorea";
import { buildMapMarkers } from "@/lib/station-mapping";
import DashboardShell from "@/components/DashboardShell";

const DEFAULT_STATION = process.env.NEXT_PUBLIC_DEFAULT_STATION ?? "송파구";

export const revalidate = 1800;

export default async function HomePage() {
  let latest = null;
  let markers: ReturnType<typeof buildMapMarkers> = [];
  let error: string | null = null;

  try {
    const [stationItems, sidoItems] = await Promise.all([
      fetchStationRealtime(DEFAULT_STATION, "DAILY"),
      fetchAllSidoRealtime(),
    ]);
    latest = Array.isArray(stationItems) ? stationItems[0] ?? null : null;
    markers = buildMapMarkers(Array.isArray(sidoItems) ? sidoItems : []);
  } catch (e) {
    error = e instanceof Error ? e.message : "오류 발생";
  }

  return (
    <DashboardShell
      initialLatest={latest}
      initialMarkers={markers}
      initialError={error}
      initialStationName={DEFAULT_STATION}
      initialRegionName={process.env.NEXT_PUBLIC_DEFAULT_REGION ?? "송파구 오금동"}
    />
  );
}
