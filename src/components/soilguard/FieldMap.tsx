import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Layers, Leaf, Minus, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import satellite from "@/assets/satellite-field.jpg";
import { cn } from "@/lib/utils";

export type Point = { x: number; y: number };

const DEFAULT_POLY: Point[] = [
  { x: 34, y: 22 },
  { x: 72, y: 30 },
  { x: 66, y: 76 },
  { x: 26, y: 64 },
];

/** Approximate hectares from the normalized polygon (scene ≈ 620 m wide). */
export function polygonArea(points: Point[]) {
  let a = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    a += p.x * q.y - q.x * p.y;
  }
  const pctArea = Math.abs(a / 2); // in percent²
  return (pctArea / 10000) * 38.44; // 620m x 620m ≈ 38.44 ha
}

export function polygonCenter(points: Point[]) {
  const x = points.reduce((s, p) => s + p.x, 0) / points.length;
  const y = points.reduce((s, p) => s + p.y, 0) / points.length;
  return { x, y };
}

/** Map normalized scene coords to plausible lat/lon around Pune. */
export function toLatLon(p: Point) {
  const lat = 18.5245 - (p.y / 100) * 0.008;
  const lon = 73.8535 + (p.x / 100) * 0.008;
  return { lat, lon };
}

export function fmtLat(p: Point) {
  return `${toLatLon(p).lat.toFixed(4)}° N`;
}
export function fmtLon(p: Point) {
  return `${toLatLon(p).lon.toFixed(4)}° E`;
}

export function FieldMap({
  points,
  onChange,
  mode,
  onModeChange,
  className,
}: {
  points: Point[];
  onChange: (p: Point[]) => void;
  mode: "draw" | "select";
  onModeChange: (m: "draw" | "select") => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [layer, setLayer] = useState<"satellite" | "map">("satellite");
  const [query, setQuery] = useState("");

  const area = useMemo(() => polygonArea(points), [points]);
  const center = useMemo(() => polygonCenter(points.length ? points : DEFAULT_POLY), [points]);

  const relative = useCallback((clientX: number, clientY: number): Point => {
    const rect = ref.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    };
  }, []);

  useEffect(() => {
    if (dragging === null) return;
    const move = (e: PointerEvent) => {
      const p = relative(e.clientX, e.clientY);
      const next = points.map((pt, i) => (i === dragging ? p : pt));
      onChange(next);
    };
    const up = () => setDragging(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, points, onChange, relative]);

  const handleClick = (e: React.MouseEvent) => {
    if (mode !== "draw") return;
    const p = relative(e.clientX, e.clientY);
    const next = points.length >= 4 ? [p] : [...points, p];
    onChange(next);
    if (next.length === 4) {
      onModeChange("select");
      toast.success("Field marked", { description: `${polygonArea(next).toFixed(2)} ha boundary created` });
    }
  };

  const path = points.map((p) => `${p.x}% ${p.y}%`).join(", ");
  const complete = points.length >= 3;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border select-none sm:aspect-[16/11]",
          mode === "draw" && "cursor-crosshair",
        )}
      >
        <img
          src={satellite}
          alt="Satellite view of farmland near Pune"
          width={1280}
          height={960}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-500",
            layer === "map" && "opacity-25 saturate-0",
          )}
          style={{ transform: `scale(${zoom})` }}
        />
        {layer === "map" && <div className="absolute inset-0 bg-mint/80" />}

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {complete && (
            <polygon
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="rgba(69,182,73,0.42)"
              stroke="#8BD12B"
              strokeWidth={0.6}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {points.map((p, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Field corner ${i + 1}`}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDragging(i);
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest bg-white shadow-md transition-transform hover:scale-125 focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, cursor: "grab" }}
          />
        ))}

        {complete && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur"
            style={{ left: `${center.x}%`, top: `${center.y}%` }}
          >
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
        <div
          className="absolute inset-x-3 top-3 z-20 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md sm:max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) toast(`Centred map on “${query.trim()}”`);
            }}
            aria-label="Search location"
            placeholder="Search location (village, district, or coordinates...)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Zoom + locate */}
        <div className="absolute top-16 left-3 z-20 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
          {[
            { icon: Plus, label: "Zoom in", fn: () => setZoom((z) => Math.min(2.2, +(z * 1.15).toFixed(3))) },
            { icon: Minus, label: "Zoom out", fn: () => setZoom((z) => Math.max(1, +(z / 1.15).toFixed(3))) },
            {
              icon: Crosshair,
              label: "Current location",
              fn: () => {
                setZoom(1);
                toast("Centred on your current location — Pune, Maharashtra");
              },
            },
          ].map(({ icon: Icon, label, fn }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={fn}
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/95 text-forest shadow-md transition-colors hover:bg-mint"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Layer toggle */}
        <div
          className="absolute bottom-14 left-3 z-20 overflow-hidden rounded-lg bg-white/95 shadow-md sm:top-16 sm:bottom-auto sm:left-auto sm:right-3"
          onClick={(e) => e.stopPropagation()}
        >
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
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 rounded-lg bg-white/95 px-3 py-2 text-[11px] font-medium shadow-md">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-leaf" /> Field Boundary
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-forest bg-white" /> Drag points to edit
          </span>
        </div>

        {/* Scale bar */}
        <div className="absolute right-3 bottom-3 z-20 hidden items-end gap-1 text-[10px] font-semibold text-white drop-shadow sm:flex">
          <span>0</span>
          <div className="h-2 w-10 border-x border-b border-white" />
          <span>50</span>
          <div className="h-2 w-10 border-x border-b border-white" />
          <span>100</span>
          <div className="h-2 w-16 border-x border-b border-white" />
          <span>200 m</span>
        </div>

        {mode === "draw" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 text-center sm:bottom-16">
            <span className="rounded-full bg-forest/90 px-4 py-1.5 text-xs font-semibold text-white">
              Click {Math.max(0, 4 - points.length)} more point{4 - points.length === 1 ? "" : "s"} to mark your field
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_POLY };
