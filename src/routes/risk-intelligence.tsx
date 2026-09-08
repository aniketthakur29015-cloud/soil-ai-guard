import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { HealthGauge } from "@/components/soilguard/HealthGauge";
import { DiseasePanel, Panel, SatelliteIndicators } from "@/components/soilguard/panels";
import { fieldHealth, riskBreakdown, riskTrends, trendRanges, type TrendRange } from "@/data/soilguard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk-intelligence")({
  head: () => ({
    meta: [
      { title: "Risk Intelligence — Disease & Soil Risk Trends | SoilGuard" },
      {
        name: "description",
        content: "Track overall risk score, disease probability, moisture, nutrient and weather risk over time.",
      },
      { property: "og:title", content: "Risk Intelligence — SoilGuard" },
      { property: "og:description", content: "Historical risk trends and AI disease probability for your fields." },
    ],
  }),
  component: RiskPage,
});

const toneColor = { good: "var(--leaf)", warn: "var(--sun)", bad: "var(--risk)" };

function RiskPage() {
  const [range, setRange] = useState<TrendRange>("30 Days");
  const data = riskTrends[range];

  return (
    <AppShell>
      <PageHeader
        title="Risk Intelligence"
        subtitle="How risk is building across your field, and why"
        icon={ShieldAlert}
        action={
          <div className="flex flex-wrap gap-1.5 rounded-full border border-border bg-card p-1">
            {trendRanges.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                  range === r ? "bg-leaf text-white" : "text-muted-foreground hover:bg-mint hover:text-forest",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Panel title="Overall Risk Score">
          <div className="flex flex-col items-center">
            <HealthGauge score={fieldHealth.score} label={fieldHealth.status} />
            <p className="mt-3 max-w-[260px] text-center text-xs text-muted-foreground">{fieldHealth.description}</p>
          </div>
          <div className="mt-4">
            <SatelliteIndicators />
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Historical Risk Trend" subtitle={range}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...data]}>
                  <defs>
                    <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#45B649" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#45B649" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="risk" name="Overall risk" stroke="#168A4A" strokeWidth={2.5} fill="url(#riskFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Moisture vs Disease Pressure" subtitle={range}>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...data]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="moisture" name="Soil moisture risk" stroke="#1299D4" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="disease" name="Disease pressure" stroke="#E53935" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Risk Breakdown">
          <ul className="space-y-4">
            {riskBreakdown.map((r) => (
              <li key={r.label}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <span className="truncate text-sm font-semibold">{r.label}</span>
                  <span className="text-sm font-bold tabular-nums">{r.value}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${r.value}%`, backgroundColor: toneColor[r.tone] }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{r.note}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <DiseasePanel />
      </div>
    </AppShell>
  );
}
