import { useEffect, useState } from "react";

export function HealthGauge({
  score,
  size = 200,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(score), 120);
    return () => clearTimeout(t);
  }, [score]);

  const r = 78;
  const cx = 100;
  const cy = 100;
  const start = -215;
  const sweep = 250;
  const toXY = (angle: number) => {
    const a = (angle * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const arc = (from: number, to: number) => {
    const [x1, y1] = toXY(from);
    const [x2, y2] = toXY(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const color = shown >= 75 ? "var(--leaf)" : shown >= 50 ? "var(--sun)" : "var(--risk)";

  return (
    <div className="relative" style={{ width: size, height: size * 0.82 }}>
      <svg viewBox="0 0 200 165" className="h-full w-full" role="img" aria-label={`Health score ${score} out of 100`}>
        <path d={arc(start, start + sweep)} fill="none" stroke="var(--muted)" strokeWidth={16} strokeLinecap="round" />
        <path
          d={arc(start, start + (sweep * shown) / 100)}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          style={{ transition: "d 1s ease" }}
        />
      </svg>
      <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 text-center">
        <div className="font-display text-4xl font-extrabold tabular-nums">
          {score}
          <span className="text-lg font-semibold text-muted-foreground"> / 100</span>
        </div>
        {label && (
          <div className="mt-2 inline-flex rounded-full bg-sun/15 px-3 py-1 text-xs font-semibold text-[#8a5f00]">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
