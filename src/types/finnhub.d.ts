declare module "finnhub" {
  interface ApiClientConfig {
    apiKey: string;
  }

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
    country: string;
    currency: string;
    exchange: string;
    ipo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
    logo: string;
    finnhubIndustry: string;
  }

  class DefaultApi {
    quote(
      symbol: string,
      callback: (error: Error | null, data: Quote | null) => void
    ): void;
    companyProfile2(
      params: { symbol: string },
      callback: (error: Error | null, data: CompanyProfile | null) => void
    ): void;
  }

  class ApiClient {
    constructor(config: ApiClientConfig);
    defaultApi: DefaultApi;
  }

  export = {
    ApiClient: ApiClient,
  };
}
