import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye, FileText, Share2, ShieldAlert, Sprout, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { Panel } from "@/components/soilguard/panels";
import { reportHistory, reports } from "@/data/soilguard";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Soil, Field & Disease Risk PDFs | SoilGuard" },
      { name: "description", content: "View, download and share soil health, field analysis and disease risk reports." },
      { property: "og:title", content: "Reports — SoilGuard" },
      { property: "og:description", content: "Professional soil and field reports, ready to download or share." },
    ],
  }),
  component: ReportsPage,
});

const icons = { Soil: Sprout, Field: FileText, Risk: ShieldAlert, Monthly: CalendarDays } as const;

function ReportsPage() {
  return (
    <AppShell>
      <PageHeader title="Reports" subtitle="Everything about your fields, ready to share" icon={FileText} />

      <div className="grid gap-4 lg:grid-cols-2">
        {reports.map((r) => {
          const Icon = icons[r.type as keyof typeof icons];
          return (
            <Panel key={r.name} className="card-hover">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint text-forest">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold">{r.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    Generated {r.date} • PDF • {r.size}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toast(`Opening ${r.name}`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-forest px-3.5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  <Eye className="h-4 w-4" /> View
                </button>
                <button
                  type="button"
                  onClick={() => toast.success(`${r.name} downloaded`)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-bold text-forest hover:bg-mint"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => toast("Share link copied")}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-bold text-forest hover:bg-mint"
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="Report History" className="mt-4">
        <ul className="divide-y divide-border">
          {reportHistory.map((h) => (
            <li key={h.name + h.date} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{h.name}</p>
                <p className="truncate text-xs text-muted-foreground">{h.date}</p>
              </div>
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-forest">{h.status}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}
