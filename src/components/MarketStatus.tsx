import { FC, useState } from "react";
import MarketMovers from "./MarketMovers";

interface MarketStatusProps {
  name: string;
  status: "open" | "closed" | "pre-market" | "post-market";
  localTime: string;
  nextEvent?: string;
}

const MarketStatus: FC<MarketStatusProps> = ({
  name,
  status,
  localTime,
  nextEvent,
}) => {
  const [showMovers, setShowMovers] = useState(false);

  const statusText = {
    open: "Open",
    closed: "Closed",
    "pre-market": "Pre-market",
    "post-market": "Post-market",
  };

  return (
    <>
      <div
        className={`market-card card status-${status} cursor-pointer hover:scale-[1.02] transition-transform`}
        onClick={() => setShowMovers(true)}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-medium text-sm text-[var(--foreground)]">
              {name}
            </h3>
            <div className="market-status shrink-0">
              <span className={`status-indicator status-${status}`} />
              <span className="text-xs font-medium opacity-90">
                {statusText[status]}
              </span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-[var(--secondary)] space-y-0.5">
              <p className="text-xs opacity-90">{localTime}</p>
              {nextEvent && <p className="text-xs opacity-75">{nextEvent}</p>}
            </div>
          </div>
        </div>
      </div>

      {showMovers && (
        <div className="fixed inset-0 bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <MarketMovers market={name} onClose={() => setShowMovers(false)} />
        </div>
      )}
    </>
  );
};

export default MarketStatus;
