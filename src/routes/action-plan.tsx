import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, ClipboardList, Flame } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { Panel } from "@/components/soilguard/panels";
import { actionPlan } from "@/data/soilguard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/action-plan")({
  head: () => ({
    meta: [
      { title: "Action Plan — Your Next Farming Steps | SoilGuard" },
      {
        name: "description",
        content: "A day-by-day farming action plan: drainage, irrigation, disease monitoring and follow-up checks.",
      },
      { property: "og:title", content: "Action Plan — SoilGuard" },
      { property: "og:description", content: "Clear farming steps for today, 3 days, 7 days and 30 days." },
    ],
  }),
  component: ActionPlanPage,
});

const tones = {
  done: { icon: Check, cls: "bg-leaf/12 text-leaf", label: "Recommended" },
  warn: { icon: AlertTriangle, cls: "bg-sun/20 text-[#8a5f00]", label: "Watch" },
  urgent: { icon: Flame, cls: "bg-risk/12 text-risk", label: "Urgent" },
};

function ActionPlanPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const total = actionPlan.reduce((s, g) => s + g.items.length, 0);
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <AppShell>
      <PageHeader
        title="Action Plan"
        subtitle="What to do next to protect your soil and yield"
        icon={ClipboardList}
        action={
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-bold text-forest">
            {completed} / {total} completed
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {actionPlan.map((group) => (
          <Panel key={group.window} title={group.window}>
            <ul className="space-y-3">
              {group.items.map((item) => {
                const t = tones[item.tone];
                const Icon = t.icon;
                const key = `${group.window}-${item.text}`;
                const checked = !!done[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      aria-pressed={checked}
                      onClick={() => {
                        setDone((d) => ({ ...d, [key]: !d[key] }));
                        if (!checked) toast.success("Task marked done");
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl border border-border px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                        checked && "bg-mint/60",
                      )}
                    >
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", t.cls)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-sm font-semibold", checked && "line-through opacity-60")}>
                          {item.text}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{t.label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
