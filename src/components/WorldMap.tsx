import { FC, useState, useCallback, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import MarketMarker from "./MarketMarker";
import MarketMovers from "./MarketMovers";

// Using a more reliable topojson source
const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

interface MarketRegion {
  name: string;
  status: "open" | "closed" | "pre-market" | "post-market";
  coordinates: [number, number];
  localTime: string;
  nextEvent?: string;
}

interface WorldMapProps {
  markets: MarketRegion[];
  isFullScreen?: boolean;
}

// Calculate center and zoom to fit all points
const getFitBounds = (points: [number, number][]) => {
  const padding = 10; // reduced padding for closer zoom
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);

  const minLng = Math.min(...lngs) - padding;
  const maxLng = Math.max(...lngs) + padding;
  const minLat = Math.min(...lats) - padding / 2;
  const maxLat = Math.max(...lats) + padding / 2;

  const center: [number, number] = [
    (minLng + maxLng) / 2,
    (minLat + maxLat) / 2,
  ];

  const width = maxLng - minLng;
  const height = maxLat - minLat;
  const zoom = Math.min(360 / width, 180 / height) * 0.8; // increased zoom factor

  return { center, zoom };
};

const WorldMap: FC<WorldMapProps> = ({ markets, isFullScreen = false }) => {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const bounds = getFitBounds(markets.map((m) => m.coordinates));

  const handleMarkerClick = useCallback((name: string) => {
    setSelectedMarket((prev) => (prev === name ? null : name));
  }, []);

  // Handle escape key to close selected marker
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMarket(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="card overflow-hidden map-container h-full shadow-2xl relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: isFullScreen ? 200 : 180,
        }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "var(--background)",
        }}
      >
        <ZoomableGroup
          center={bounds.center}
          zoom={bounds.zoom}
          maxZoom={bounds.zoom}
          minZoom={bounds.zoom}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--card)"
                  fillOpacity={0.15}
                  stroke="var(--card-hover)"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      outline: "none",
                      fillOpacity: 0.25,
                      transition: "all 250ms",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {markets.map((market, index) => (
            <MarketMarker
              key={index}
              coordinates={market.coordinates}
              name={market.name}
              status={market.status}
              localTime={market.localTime}
              nextEvent={market.nextEvent}
              zoom={bounds.zoom}
              isSelected={selectedMarket === market.name}
              onClick={() => handleMarkerClick(market.name)}
            />
          ))}
        </ZoomableGroup>
      </ComposableMap>
      {selectedMarket && (
        <div className="absolute inset-0 bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center p-6">
          <MarketMovers
            market={selectedMarket}
            onClose={() => setSelectedMarket(null)}
          />
        </div>
      )}
    </div>
  );
};

export default WorldMap;
