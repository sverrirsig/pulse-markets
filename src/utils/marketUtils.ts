type MarketStatus = "pre-market" | "open" | "post-market" | "closed";

interface MarketTiming {
  status: MarketStatus;
  nextEvent?: string;
}

export const getUSMarketStatus = (): MarketTiming => {
  const now = new Date();
  const nyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();
  const dayOfWeek = nyTime.getDay();

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      status: "closed",
      nextEvent: `Opens Monday at 9:30 AM ET`,
    };
  }

  // Convert current time to minutes since midnight for easier comparison
  const currentTimeInMinutes = hours * 60 + minutes;

  // Market hours in minutes since midnight
  const preMarketStart = 4 * 60; // 4:00 AM ET
  const marketOpen = 9 * 60 + 30; // 9:30 AM ET
  const marketClose = 16 * 60; // 4:00 PM ET
  const postMarketClose = 20 * 60; // 8:00 PM ET

  // Calculate time until next event in minutes
  const getTimeUntil = (targetMinutes: number): string => {
    let minutesUntil = targetMinutes - currentTimeInMinutes;
    if (minutesUntil < 0) minutesUntil += 24 * 60;
    const hours = Math.floor(minutesUntil / 60);
    const minutes = minutesUntil % 60;
    return `${hours}h ${minutes}m`;
  };

  // Pre-market (4:00 AM - 9:30 AM ET)
  if (
    currentTimeInMinutes >= preMarketStart &&
    currentTimeInMinutes < marketOpen
  ) {
    return {
      status: "pre-market",
      nextEvent: `Market opens in ${getTimeUntil(marketOpen)}`,
    };
  }

  // Regular market hours (9:30 AM - 4:00 PM ET)
  if (
    currentTimeInMinutes >= marketOpen &&
    currentTimeInMinutes < marketClose
  ) {
    return {
      status: "open",
      nextEvent: `Closes in ${getTimeUntil(marketClose)}`,
    };
  }

  // Post-market (4:00 PM - 8:00 PM ET)
  if (
    currentTimeInMinutes >= marketClose &&
    currentTimeInMinutes < postMarketClose
  ) {
    return {
      status: "post-market",
      nextEvent: `Post-market ends in ${getTimeUntil(postMarketClose)}`,
    };
  }

  // Closed
  return {
    status: "closed",
    nextEvent: `Pre-market starts in ${getTimeUntil(preMarketStart)}`,
  };
};
