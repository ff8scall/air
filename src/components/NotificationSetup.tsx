"use client";
import { useEffect, useState } from "react";
import { IconBell } from "@/components/icons";

interface Props {
  station: string;
}

export default function NotificationSetup({ station }: Props) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (permission !== "granted" || !supported) return;
    const run = () => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: "CHECK_AIR_QUALITY", station });
      });
    };
    run();
    const id = setInterval(run, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [permission, station, supported]);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (!supported || permission === "granted") return null;

  return (
    <button
      onClick={requestPermission}
      className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
    >
      <IconBell className="w-4 h-4" />
      <span className="hidden sm:inline">알림 받기</span>
    </button>
  );
}
