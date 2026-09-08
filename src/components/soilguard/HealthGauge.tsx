import { useEffect, useState } from "react";

export function HealthGauge({
  score,
  size = 210,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  const r = 72;
  const c = 2 * Math.PI * r;
  const portion = 0.72; // three-quarter dial
  const track = c * portion;
  const value = track * Math.min(1, Math.max(0, shown / 100));
  const color = shown >= 75 ? "var(--leaf)" : shown >= 50 ? "var(--sun)" : "var(--risk)";

  return (
    <div className="relative" style={{ width: size, height: size * 0.86 }}>
      <svg
        viewBox="0 0 180 156"
        className="h-full w-full"
        role="img"
        aria-label={`Health score ${score} out of 100`}
      >
        <g transform="rotate(129 90 90)">
          <circle
            cx={90}
            cy={90}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={`${track} ${c}`}
          />
          <circle
            cx={90}
            cy={90}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={`${value} ${c}`}
            style={{ transition: "stroke-dasharray 1s ease, stroke 0.4s ease" }}
          />
        </g>
      </svg>
      <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 text-center">
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
