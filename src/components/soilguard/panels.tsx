import type { ReactNode } from "react";
import { ArrowRight, Cloud, CloudRain, Droplets, Sparkles, Thermometer, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { diseases, satelliteIndicators, lastSatelliteImage, soilProperties, weatherSeason } from "@/data/soilguard";

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-surface p-4 sm:p-5", className)}>
      {(title || right) && (
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-lg font-bold">
                {title}
                {subtitle && (
                  <span className="ml-2 text-sm font-medium text-muted-foreground">({subtitle})</span>
                )}
              </h2>
            )}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

const levelStyles: Record<string, string> = {
  High: "bg-risk/12 text-risk",
  Medium: "bg-sun/18 text-[#8a5f00]",
  Moderate: "bg-sun/18 text-[#8a5f00]",
  Low: "bg-leaf/12 text-leaf",
  Good: "bg-leaf/12 text-leaf",
};

export function LevelPill({ level, className }: { level: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
        levelStyles[level] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {level}
    </span>
  );
}

export function DiseasePanel({ right }: { right?: ReactNode }) {
  return (
    <Panel title="Disease Probability" subtitle="AI Model" right={right}>
      <ul className="space-y-3.5">
        {diseases.map((d) => (
          <li key={d.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto_auto]">
            <span className="truncate text-sm font-semibold">{d.name}</span>
            <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-muted sm:col-span-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${d.probability}%`,
                  backgroundColor:
                    d.level === "High" ? "var(--risk)" : d.level === "Medium" ? "var(--sun)" : "var(--leaf)",
                }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums">{d.probability}%</span>
            <LevelPill level={d.level} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SatelliteIndicators() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold">
        <Sparkles className="h-4 w-4 text-leaf" /> Satellite Indicators
        <span className="text-xs font-medium text-muted-foreground">(Demo)</span>
      </p>
      <ul className="space-y-2.5">
        {satelliteIndicators.map((i) => (
          <li key={i.label} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
            <span className="truncate text-sm text-muted-foreground">{i.label}</span>
            <span className="text-sm font-bold tabular-nums">{i.value !== "—" ? i.value : ""}</span>
            <LevelPill level={i.level} />
          </li>
        ))}
        <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border pt-2.5">
          <span className="truncate text-sm text-muted-foreground">Last Satellite Image</span>
          <span className="text-sm font-bold">{lastSatelliteImage}</span>
        </li>
      </ul>
    </div>
  );
}

const soilIcons: Record<string, string> = {
  pH: "bg-water/12 text-water",
  "Organic Carbon": "bg-soil/12 text-soil",
  Clay: "bg-soil/12 text-soil",
  Sand: "bg-sun/18 text-[#8a5f00]",
  Silt: "bg-leaf/12 text-leaf",
};

export function SoilPropertiesPanel() {
  return (
    <Panel title="Soil Properties" subtitle="SoilGrids">
      <div className="grid grid-cols-3 gap-3">
        {soilProperties.map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-3 text-center">
            <span
              className={cn(
                "mx-auto mb-2 grid h-8 w-8 place-items-center rounded-lg text-xs font-bold",
                soilIcons[s.label],
              )}
            >
              {s.label.slice(0, 2)}
            </span>
            <p className="text-xs leading-tight text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 text-lg font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const weatherIcons = { temp: Thermometer, rain: CloudRain, humidity: Droplets, wind: Wind } as const;
const weatherTones = {
  temp: "bg-risk/10 text-risk",
  rain: "bg-water/12 text-water",
  humidity: "bg-water/12 text-water",
  wind: "bg-leaf/12 text-leaf",
} as const;

export function WeatherPanel() {
  return (
    <Panel title="Weather" subtitle="NASA POWER">
      <div className="grid grid-cols-2 gap-3">
        {weatherSeason.map((w) => {
          const Icon = weatherIcons[w.key];
          return (
            <div key={w.label} className="rounded-xl border border-border p-3 text-center">
              <span className={cn("mx-auto mb-2 grid h-9 w-9 place-items-center rounded-lg", weatherTones[w.key])}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <p className="text-lg font-extrabold">{w.value}</p>
              <p className="text-xs leading-tight text-muted-foreground">{w.label}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function ViewDetailsLink({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-semibold text-leaf transition-colors hover:text-forest"
    >
      View Details <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export { Cloud };
