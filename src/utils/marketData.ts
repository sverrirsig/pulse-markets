interface Quote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

interface CompanyProfile {
  name: string;
  ticker: string;
  country?: string;
  currency?: string;
  exchange?: string;
  finnhubIndustry?: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: {
    labels: string[];
    values: number[];
  };
}

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const fetchQuote = async (symbol: string): Promise<Quote> => {
  const response = await fetch(
    `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
  return response.json();
};

const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  const response = await fetch(
    `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch company profile for ${symbol}`);
  }
  return response.json();
};

export const getTopMovers = async (market: string): Promise<StockData[]> => {
  if (!FINNHUB_API_KEY) {
    console.error("Finnhub API key not found");
    return [];
  }

  try {
    const symbols = getMarketSymbols(market);
    const promises = symbols.map(async (symbol) => {
      try {
        const [quoteData, profileData] = await Promise.all([
          fetchQuote(symbol),
          fetchCompanyProfile(symbol),
        ]);

        return {
          symbol,
          name: profileData.name || symbol,
          price: quoteData.c,
          change: quoteData.d,
          changePercent: quoteData.dp,
          chartData: {
            labels: generateTimeLabels(),
            values: generatePricePoints(quoteData.c, quoteData.d),
          },
        };
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter((r): r is StockData => r !== null);

    // Sort by absolute percentage change
    return validResults.sort(
      (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)
    );
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
};

const getMarketSymbols = (market: string): string[] => {
  // Map market names to their major symbols
  const marketSymbols: { [key: string]: string[] } = {
    "US Stock Market (NYSE)": [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "META",
      "NVDA",
      "TSLA",
      "JPM",
      "V",
      "WMT",
    ],
    "European Market (LSE)": ["BP.L", "HSBA.L", "GSK.L", "ULVR.L", "RIO.L"],
    "Asian Market (TSE)": ["7203.T", "6758.T", "7974.T", "6861.T", "6501.T"],
    "Hong Kong Exchange": [
      "0700.HK",
      "0941.HK",
      "3690.HK",
      "9988.HK",
      "0005.HK",
    ],
    "Frankfurt Stock Exchange": [
      "DBK.DE",
      "VOW3.DE",
      "SAP.DE",
      "SIE.DE",
      "ALV.DE",
    ],
  };

  return marketSymbols[market] || [];
};

const generateTimeLabels = (): string[] => {
  const now = new Date();
  const labels = [];
  for (let i = 0; i < 8; i++) {
    const time = new Date(now.getTime() - i * 30 * 60000); // 30-minute intervals
    labels.unshift(
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
  return labels;
};

const generatePricePoints = (
  currentPrice: number,
  totalChange: number
): number[] => {
  const points = [];
  const volatility = Math.abs(totalChange) / 8;

  for (let i = 0; i < 8; i++) {
    const randomChange = (Math.random() - 0.5) * volatility;
    const point =
      currentPrice - totalChange + (totalChange * i) / 7 + randomChange;
    points.push(Number(point.toFixed(2)));
  }

  return points;
};
