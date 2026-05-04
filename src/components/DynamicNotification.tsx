"use client";
import dynamic from "next/dynamic";

const NotificationSetup = dynamic(() => import("@/components/NotificationSetup"), { ssr: false });

export default function DynamicNotification({ station }: { station: string }) {
  return <NotificationSetup station={station} />;
}
