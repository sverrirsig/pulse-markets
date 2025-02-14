"use client";

import { useEffect, useState } from "react";
import Clock from "@/components/Clock";
import MarketStatus from "@/components/MarketStatus";
import WorldMap from "@/components/WorldMap";
import { getUSMarketStatus } from "@/utils/marketUtils";

export default function Home() {
  const [usMarket, setUsMarket] = useState(getUSMarketStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setUsMarket(getUSMarketStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const marketRegions = [
    {
      name: "US Stock Market (NYSE)",
      status: usMarket.status,
      coordinates: [-74, 40.7] as [number, number], // New York
      localTime: "9:30 AM - 4:00 PM EST",
      nextEvent: usMarket.nextEvent,
    },
    {
      name: "European Market (LSE)",
      status: "closed" as const,
      coordinates: [-0.1, 51.5] as [number, number], // London
      localTime: "8:00 AM - 4:30 PM GMT",
      nextEvent: "Opens tomorrow at 8:00 AM",
    },
    {
      name: "Asian Market (TSE)",
      status: "closed" as const,
      coordinates: [139.7, 35.7] as [number, number], // Tokyo
      localTime: "9:00 AM - 3:00 PM JST",
      nextEvent: "Opens in 30m",
    },
    {
      name: "Hong Kong Exchange",
      status: "closed" as const,
      coordinates: [114.16, 22.27] as [number, number], // Hong Kong
      localTime: "9:30 AM - 4:00 PM HKT",
      nextEvent: "Opens in 2h",
    },
    {
      name: "Frankfurt Stock Exchange",
      status: "closed" as const,
      coordinates: [8.68, 50.11] as [number, number], // Frankfurt
      localTime: "9:00 AM - 5:30 PM CET",
      nextEvent: "Opens in 3h",
    },
  ];

  return (
    <main className="h-screen p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mb-8">
        <div className="header-card flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-transparent bg-clip-text">
            Pulse Markets
          </h1>
          <p className="text-xs text-[var(--secondary)] mt-1">
            Live Exchange Status
          </p>
        </div>
        <Clock />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
        <MarketStatus
          name="US Stock Market (NYSE)"
          status={usMarket.status}
          localTime="9:30 AM - 4:00 PM EST"
          nextEvent={usMarket.nextEvent}
        />
        <MarketStatus
          name="European Market (LSE)"
          status="closed"
          localTime="8:00 AM - 4:30 PM GMT"
          nextEvent="Opens tomorrow at 8:00 AM"
        />
        <MarketStatus
          name="Asian Market (TSE)"
          status="closed"
          localTime="9:00 AM - 3:00 PM JST"
          nextEvent="Opens in 30m"
        />
        <MarketStatus
          name="Hong Kong Exchange"
          status="closed"
          localTime="9:30 AM - 4:00 PM HKT"
          nextEvent="Opens in 2h"
        />
        <MarketStatus
          name="Frankfurt Stock Exchange"
          status="closed"
          localTime="9:00 AM - 5:30 PM CET"
          nextEvent="Opens in 3h"
        />
      </div>

      <div className="flex-1 min-h-0 pb-6">
        <WorldMap markets={marketRegions} />
      </div>
    </main>
  );
}
