declare module "@ducanh2912/next-pwa" {
  import type { NextConfig } from "next";
  interface PWAOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    cacheOnFrontEndNav?: boolean;
    aggressiveFrontEndNavCaching?: boolean;
    reloadOnOnline?: boolean;
    sw?: string;
    scope?: string;
  }
  function withPWAInit(options: PWAOptions): (config: NextConfig) => NextConfig;
  export default withPWAInit;
}
