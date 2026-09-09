import { Suspense, lazy, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Point = { lat: number; lng: number };

/** Demo field near Wagholi, Pune. */
const DEFAULT_POLY: Point[] = [
  { lat: 18.5211, lng: 73.8559 },
  { lat: 18.5213, lng: 73.8574 },
  { lat: 18.5198, lng: 73.8576 },
  { lat: 18.5196, lng: 73.856 },
];

export const DEFAULT_CENTER: Point = { lat: 18.5204, lng: 73.8567 };

const R = 6378137; // earth radius in metres

/** Spherical polygon area in hectares. */
export function polygonArea(points: Point[]) {
  if (points.length < 3) return 0;
  const rad = (d: number) => (d * Math.PI) / 180;
  let total = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i]!;
    const p2 = points[(i + 1) % points.length]!;
    total += (rad(p2.lng) - rad(p1.lng)) * (2 + Math.sin(rad(p1.lat)) + Math.sin(rad(p2.lat)));
  }
  const m2 = Math.abs((total * R * R) / 2);
  return m2 / 10000;
}

export function polygonCenter(points: Point[]): Point {
  if (!points.length) return DEFAULT_CENTER;
  return {
    lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
    lng: points.reduce((s, p) => s + p.lng, 0) / points.length,
  };
}

export function fmtLat(p: Point) {
  return `${Math.abs(p.lat).toFixed(4)}° ${p.lat >= 0 ? "N" : "S"}`;
}
export function fmtLon(p: Point) {
  return `${Math.abs(p.lng).toFixed(4)}° ${p.lng >= 0 ? "E" : "W"}`;
}

export type FieldMapProps = {
  points: Point[];
  onChange: (p: Point[]) => void;
  mode: "draw" | "select";
  onModeChange: (m: "draw" | "select") => void;
  className?: string;
};

const LeafletFieldMap = lazy(() =>
  import("./LeafletFieldMap").then((m) => ({ default: m.LeafletFieldMap })),
);

export function FieldMap(props: FieldMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const placeholder = (
    <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-border bg-mint/50">
      <span className="flex items-center gap-2 text-sm font-semibold text-forest">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading satellite map…
      </span>
    </div>
  );

  return (
    <div className={cn("space-y-3", props.className)}>
      {mounted ? (
        <Suspense fallback={placeholder}>
          <LeafletFieldMap {...props} />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}

export { DEFAULT_POLY };
