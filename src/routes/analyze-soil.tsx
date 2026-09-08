import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { HealthGauge } from "@/components/soilguard/HealthGauge";
import { LevelPill, Panel } from "@/components/soilguard/panels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze-soil")({
  head: () => ({
    meta: [
      { title: "Analyze Soil — pH, NPK & Organic Carbon | SoilGuard" },
      {
        name: "description",
        content: "Enter or upload soil test values and get an instant soil health score, nutrient status and AI advice.",
      },
      { property: "og:title", content: "Analyze Soil — SoilGuard" },
      { property: "og:description", content: "Instant soil health score and nutrient guidance from your soil test." },
    ],
  }),
  component: AnalyzeSoilPage,
});

const FIELDS = [
  { key: "ph", label: "Soil pH", unit: "", def: 6.8, min: 3, max: 10, ideal: [6, 7.5] },
  { key: "n", label: "Nitrogen (N)", unit: "kg/ha", def: 240, min: 0, max: 600, ideal: [280, 450] },
  { key: "p", label: "Phosphorus (P)", unit: "kg/ha", def: 22, min: 0, max: 120, ideal: [25, 60] },
  { key: "k", label: "Potassium (K)", unit: "kg/ha", def: 180, min: 0, max: 500, ideal: [150, 350] },
  { key: "oc", label: "Organic Carbon", unit: "%", def: 0.5, min: 0, max: 3, ideal: [0.75, 1.5] },
  { key: "moisture", label: "Moisture", unit: "%", def: 34, min: 0, max: 100, ideal: [20, 32] },
  { key: "temp", label: "Soil Temperature", unit: "°C", def: 27.8, min: 0, max: 60, ideal: [18, 30] },
] as const;

type Key = (typeof FIELDS)[number]["key"];

function statusOf(v: number, ideal: readonly [number, number] | number[]) {
  const [lo, hi] = ideal as number[];
  if (v < lo! * 0.75 || v > hi! * 1.3) return "Low" as const;
  if (v < lo! || v > hi!) return "Medium" as const;
  return "Good" as const;
}

function AnalyzeSoilPage() {
  const [values, setValues] = useState<Record<Key, number>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.def])) as Record<Key, number>,
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const scored = useMemo(
    () =>
      FIELDS.map((f) => {
        const v = values[f.key];
        const s = statusOf(v, f.ideal);
        return { ...f, value: v, status: s, score: s === "Good" ? 92 : s === "Medium" ? 62 : 34 };
      }),
    [values],
  );

  const score = Math.round(scored.reduce((s, f) => s + f.score, 0) / scored.length);
  const classification = score >= 75 ? "Fertile / Class A" : score >= 55 ? "Moderately Fertile / Class B" : "Poor / Class C";

  const analyze = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(score);
      toast.success("Soil analysed", { description: `Soil health score ${score}/100 — ${classification}` });
    }, 1600);
  };

  return (
    <AppShell>
      <PageHeader title="Analyze Soil" subtitle="Enter your soil test values or upload a lab report" icon={FlaskConical} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Panel
          title="Soil Test Inputs"
          right={
            <button
              type="button"
              onClick={() => toast("Upload a lab report (PDF/CSV) — demo mode")}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-bold text-forest hover:bg-mint"
            >
              <Upload className="h-3.5 w-3.5" /> Upload report
            </button>
          }
        >
          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <label htmlFor={f.key} className="truncate text-sm font-semibold">
                    {f.label} {f.unit && <span className="text-muted-foreground">({f.unit})</span>}
                  </label>
                  <input
                    id={f.key}
                    type="number"
                    step="0.1"
                    value={values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
                    className="w-24 rounded-lg border border-border bg-background px-2.5 py-1.5 text-right text-sm font-bold outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <input
                  type="range"
                  aria-label={`${f.label} slider`}
                  min={f.min}
                  max={f.max}
                  step={f.max > 10 ? 1 : 0.1}
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
                  className="mt-2 w-full accent-[#168A4A]"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={analyze}
              disabled={analyzing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {analyzing ? "Analysing soil…" : "Analyze Soil"}
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Soil Health Score">
            <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <div className="mx-auto">
                <HealthGauge score={result ?? score} label={classification} />
              </div>
              <div className="h-[200px] min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={scored.map((s) => ({ subject: s.label.split(" ")[0], A: s.score }))}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Radar dataKey="A" stroke="#168A4A" fill="#45B649" fillOpacity={0.45} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>

          <Panel title="Nutrient Status">
            <ul className="space-y-2.5">
              {scored.map((s) => (
                <li key={s.key} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
                  <span className="truncate text-sm font-semibold">{s.label}</span>
                  <span className="text-sm font-bold tabular-nums">
                    {s.value}
                    {s.unit && <span className="ml-1 text-xs font-medium text-muted-foreground">{s.unit}</span>}
                  </span>
                  <LevelPill level={s.status} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Nutrient Balance">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scored.map((s) => ({ name: s.label.split(" ")[0], score: s.score }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#168A4A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="AI Recommendations" className={cn(result !== null && "border-leaf/40 bg-mint/40")}>
            <ol className="grid gap-2 sm:grid-cols-2">
              {[
                "Apply well-decomposed farmyard manure to lift organic carbon above 0.75%.",
                "Split-apply nitrogen instead of a single dose to reduce leaching.",
                "Moisture is above ideal — pause irrigation for 3–4 days.",
                "Add a phosphorus-rich basal dose before the next sowing window.",
                "Retest soil after 30 days to confirm improvement.",
              ].map((r, i) => (
                <li key={r} className="flex items-start gap-2.5 rounded-xl bg-card px-3 py-2.5 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf/15 text-[11px] font-bold text-leaf">
                    {i + 1}
                  </span>
                  <span className="min-w-0">{r}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
