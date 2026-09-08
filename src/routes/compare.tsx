import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Sprout } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { LevelPill, Panel } from "@/components/soilguard/panels";
import { fields } from "@/data/soilguard";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Fields — Health Scores Side by Side | SoilGuard" },
      { name: "description", content: "Compare health score, crop, area and risk status across all your fields." },
      { property: "og:title", content: "Compare Fields — SoilGuard" },
      { property: "og:description", content: "See which of your fields is healthiest and which needs attention." },
    ],
  }),
  component: ComparePage,
});

const colorFor = (s: number) => (s >= 78 ? "#168A4A" : s >= 60 ? "#F9B51B" : "#E53935");

function ComparePage() {
  return (
    <AppShell>
      <PageHeader title="Field Comparison" subtitle="See which field needs your attention first" icon={BarChart3} />

      <div className="grid gap-4 lg:grid-cols-3">
        {fields.map((f) => (
          <Panel key={f.id} className="card-hover">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-forest">
                <Sprout className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold">{f.name}</h3>
                <p className="truncate text-xs text-muted-foreground">
                  {f.crop} • {f.area} ha
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-4xl font-extrabold" style={{ color: colorFor(f.score) }}>
                {f.score}
                <span className="text-base font-semibold text-muted-foreground"> / 100</span>
              </p>
              <LevelPill level={f.score >= 78 ? "Good" : f.score >= 60 ? "Moderate" : "High"} />
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${f.score}%`, backgroundColor: colorFor(f.score) }} />
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Health Score Comparison" className="mt-4">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fields.map((f) => ({ name: `Field ${f.id}`, score: f.score }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                {fields.map((f) => (
                  <Cell key={f.id} fill={colorFor(f.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </AppShell>
  );
}
