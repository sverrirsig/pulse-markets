import { FC } from "react";
import { Marker } from "react-simple-maps";

interface MarketMarkerProps {
  coordinates: [number, number];
  name: string;
  status: "open" | "closed" | "pre-market" | "post-market";
  localTime: string;
  nextEvent?: string;
  zoom: number;
  isDragging?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const getStatusColor = (status: string) => {
  const colors = {
    open: "var(--success)",
    closed: "var(--danger)",
    "pre-market": "var(--warning)",
    "post-market": "var(--warning)",
  };
  return colors[status as keyof typeof colors] || colors.closed;
};

const MarketMarker: FC<MarketMarkerProps> = ({
  coordinates,
  name,
  status,
  localTime,
  nextEvent,
  zoom,
  isDragging = false,
  isSelected = false,
  onClick,
}) => {
  const statusColor = getStatusColor(status);
  const statusText = {
    open: "Open",
    closed: "Closed",
    "pre-market": "Pre-market",
    "post-market": "Post-market",
  };

  const dotSize = Math.min(6 * zoom, 12);

  return (
    <Marker coordinates={coordinates}>
      <g onClick={onClick} style={{ cursor: "pointer" }}>
        <circle
          r={dotSize}
          fill={statusColor}
          stroke="var(--card)"
          strokeWidth={1}
          style={{
            transition: "all 0.3s ease",
          }}
        />
        {isSelected && !isDragging && (
          <foreignObject
            x={dotSize + 4}
            y={-16}
            width={120}
            height={50}
            style={{
              overflow: "visible",
              transition: "opacity 0.3s ease",
            }}
          >
            <div
              className="card p-1.5 shadow-lg rounded-lg"
              style={{
                background: `linear-gradient(to bottom right, ${statusColor}15, ${statusColor}08)`,
                borderColor: `${statusColor}30`,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-[9px] text-[var(--foreground)] truncate">
                  {name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-[8px] opacity-90">
                    {statusText[status]}
                  </span>
                </div>
              </div>
              <div className="text-[var(--secondary)] mt-0.5 space-y-0.5">
                <p className="text-[8px] truncate opacity-90">{localTime}</p>
                {nextEvent && (
                  <p className="text-[8px] truncate opacity-75">{nextEvent}</p>
                )}
              </div>
            </div>
          </foreignObject>
        )}
        {!isSelected && <title>{`${name} - ${statusText[status]}`}</title>}
      </g>
    </Marker>
  );
};

export default MarketMarker;
