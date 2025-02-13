import { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { StockData, getTopMovers } from "@/utils/marketData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketMoversProps {
  market: string;
  onClose: () => void;
}

const MarketMovers: FC<MarketMoversProps> = ({ market, onClose }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTopMovers(market);
      setStocks(data);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [market]);

  return (
    <div className="bg-[var(--card)] rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[var(--card-hover)]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{market} Top Movers</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--secondary)]">
            <p>No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 rounded-lg bg-[var(--background)] hover:bg-[var(--card)] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{stock.symbol}</h3>
                    <p className="text-sm text-[var(--secondary)]">
                      {stock.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${stock.price.toFixed(2)}</p>
                    <p
                      className={`text-sm ${
                        stock.change >= 0
                          ? "text-[var(--success)]"
                          : "text-[var(--danger)]"
                      }`}
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)} (
                      {stock.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
                <div className="h-16">
                  <Line
                    data={{
                      labels: stock.chartData.labels,
                      datasets: [
                        {
                          data: stock.chartData.values,
                          borderColor:
                            stock.change >= 0
                              ? "var(--success)"
                              : "var(--danger)",
                          borderWidth: 1.5,
                          tension: 0.4,
                          pointRadius: 0,
                          fill: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketMovers;
