import { useCallback, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, Layers, Leaf, Search } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_CENTER, polygonArea, polygonCenter, type FieldMapProps, type Point } from "./FieldMap";
import { cn } from "@/lib/utils";

const handleIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#fff;border:3px solid #075B45;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickCatcher({ enabled, onPoint }: { enabled: boolean; onPoint: (p: Point) => void }) {
  useMapEvents({
    click(e) {
      if (enabled) onPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapRefBridge({ onReady }: { onReady: (m: L.Map) => void }) {
  const map = useMap();
  onReady(map);
  return null;
}

export function LeafletFieldMap({ points, onChange, mode, onModeChange }: FieldMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [layer, setLayer] = useState<"satellite" | "map">("satellite");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const area = useMemo(() => polygonArea(points), [points]);
  const center = useMemo(() => polygonCenter(points), [points]);
  const complete = points.length >= 3;

  const addPoint = useCallback(
    (p: Point) => {
      const next = points.length >= 4 ? [p] : [...points, p];
      onChange(next);
      if (next.length === 4) {
        onModeChange("select");
        toast.success("Field marked", { description: `${polygonArea(next).toFixed(2)} ha boundary created` });
      }
    },
    [points, onChange, onModeChange],
  );

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      );
      const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      const hit = data[0];
      if (!hit) {
        toast.error("No place found", { description: `Nothing matched “${q}”` });
        return;
      }
      mapRef.current?.flyTo([Number(hit.lat), Number(hit.lon)], 16);
      toast.success("Map centred", { description: hit.display_name });
    } catch {
      toast.error("Location search unavailable right now");
    } finally {
      setSearching(false);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not available in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16);
        toast.success("Centred on your current location");
      },
      () => toast.error("Could not get your location"),
    );
  };

  return (
    <div
      className={cn(
        "relative h-[420px] min-h-[320px] w-full overflow-hidden rounded-2xl border border-border sm:h-[460px]",
        mode === "draw" && "[&_.leaflet-container]:cursor-crosshair",
      )}
    >
      <MapContainer
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={16}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
      >
        <MapRefBridge onReady={(m) => (mapRef.current = m)} />
        <ClickCatcher enabled={mode === "draw"} onPoint={addPoint} />
        {layer === "satellite" ? (
          <TileLayer
            key="sat"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            key="osm"
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />
        )}

        {complete && (
          <Polygon
            positions={points.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{ color: "#8BD12B", weight: 3, fillColor: "#45B649", fillOpacity: 0.35 }}
          />
        )}

        {points.map((p, i) => (
          <Marker
            key={i}
            position={[p.lat, p.lng]}
            icon={handleIcon}
            draggable
            alt={`Field corner ${i + 1}`}
            eventHandlers={{
              drag: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onChange(points.map((pt, idx) => (idx === i ? { lat: ll.lat, lng: ll.lng } : pt)));
              },
            }}
          />
        ))}
      </MapContainer>

      {/* Field label */}
      {complete && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/95 px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-leaf" />
            <div className="leading-tight">
              <p className="text-xs font-semibold">Selected Field</p>
              <p className="text-xs text-muted-foreground">{area.toFixed(2)} ha</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="absolute inset-x-3 top-3 z-[600] flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md sm:max-w-sm">
        <Search className={cn("h-4 w-4 shrink-0 text-muted-foreground", searching && "animate-pulse")} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void search();
          }}
          aria-label="Search location"
          placeholder="Search location (village, district, or coordinates...)"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Zoom + locate */}
      <div className="absolute top-16 left-3 z-[600] flex flex-col gap-1.5">
        {[
          { label: "Zoom in", text: "+", fn: () => mapRef.current?.zoomIn() },
          { label: "Zoom out", text: "−", fn: () => mapRef.current?.zoomOut() },
        ].map(({ label, text, fn }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={fn}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/95 text-lg leading-none font-bold text-forest shadow-md transition-colors hover:bg-mint"
          >
            {text}
          </button>
        ))}
        <button
          type="button"
          aria-label="Current location"
          onClick={locate}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/95 text-forest shadow-md transition-colors hover:bg-mint"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>

      {/* Layer toggle */}
      <div className="absolute top-16 right-3 z-[600] overflow-hidden rounded-lg bg-white/95 shadow-md">
        {(["satellite", "map"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLayer(l)}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold capitalize transition-colors",
              layer === l ? "bg-leaf text-white" : "text-forest hover:bg-mint",
            )}
          >
            <Layers className="h-3.5 w-3.5" /> {l}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-3 z-[600] hidden flex-wrap sm:flex items-center gap-3 rounded-lg bg-white/95 px-3 py-2 text-[11px] font-medium shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-leaf" /> Field Boundary
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-forest bg-white" /> Drag points to edit
        </span>
      </div>

      {mode === "draw" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[600] text-center">
          <span className="rounded-full bg-forest/90 px-4 py-1.5 text-xs font-semibold text-white">
            Click {Math.max(0, 4 - points.length)} more point{4 - points.length === 1 ? "" : "s"} to mark your field
          </span>
        </div>
      )}

      <span className="sr-only">
        Field centre {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
      </span>
    </div>
  );
}
