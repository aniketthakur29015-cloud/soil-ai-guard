import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { Panel } from "@/components/soilguard/panels";
import { Switch } from "@/components/ui/switch";
import { user } from "@/data/soilguard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Profile, Farm & Preferences | SoilGuard" },
      { name: "description", content: "Update your profile, farm information, notifications, language and units." },
      { property: "og:title", content: "Settings — SoilGuard" },
      { property: "og:description", content: "Manage your SoilGuard profile, farm details and preferences." },
    ],
  }),
  component: SettingsPage,
});

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SettingsPage() {
  const [notif, setNotif] = useState({ disease: true, weather: true, satellite: false, reports: true });
  const [lang, setLang] = useState("English");
  const [units, setUnits] = useState("Metric (ha, °C, mm)");

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Your profile, farm and preferences"
        icon={SettingsIcon}
        action={
          <button
            type="button"
            onClick={() => toast.success("Settings saved")}
            className="rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-bold text-white"
          >
            Save changes
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Profile">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest text-lg font-bold text-white">
              {user.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" defaultValue={user.name} />
            <Field label="Phone" defaultValue="+91 98220 41122" />
            <Field label="Email" defaultValue="ramesh.kumar@soilguard.in" />
            <Field label="Farmer category" defaultValue={user.role} />
          </div>
        </Panel>

        <Panel title="Farm Information">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Farm name" defaultValue="Kumar Krishi Farms" />
            <Field label="Total area" defaultValue="11.8 hectares" />
            <Field label="State" defaultValue="Maharashtra" />
            <Field label="District" defaultValue="Pune" />
            <Field label="Main crop" defaultValue="Sugarcane" />
            <Field label="Irrigation" defaultValue="Drip + Canal" />
          </div>
        </Panel>

        <Panel title="Notification Settings">
          <ul className="space-y-3">
            {(
              [
                { key: "disease", label: "Disease risk alerts" },
                { key: "weather", label: "Weather warnings" },
                { key: "satellite", label: "New satellite image" },
                { key: "reports", label: "Monthly report ready" },
              ] as const
            ).map(({ key, label }) => (
              <li key={key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="truncate text-sm font-semibold">{label}</span>
                <Switch
                  checked={notif[key as keyof typeof notif]}
                  onCheckedChange={(v) => {
                    setNotif((n) => ({ ...n, [key]: v }));
                    toast(`${label} ${v ? "on" : "off"}`);
                  }}
                  aria-label={label}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Language, Units & Data">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold">Language</p>
              <div className="flex flex-wrap gap-2">
                {["English", "मराठी", "हिन्दी"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={cn(
                      "rounded-xl border border-border px-3.5 py-2 text-sm font-semibold transition-colors",
                      lang === l ? "bg-leaf text-white" : "hover:bg-mint",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Units</p>
              <div className="flex flex-wrap gap-2">
                {["Metric (ha, °C, mm)", "Acres & °F"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnits(u)}
                    className={cn(
                      "rounded-xl border border-border px-3.5 py-2 text-sm font-semibold transition-colors",
                      units === u ? "bg-leaf text-white" : "hover:bg-mint",
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Data Preferences</p>
              <div className="flex flex-wrap gap-2">
                {["Share anonymised soil data", "Auto-sync satellite passes", "Offline field cache"].map((d) => (
                  <span key={d} className="rounded-xl bg-mint px-3.5 py-2 text-xs font-semibold text-forest">
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast("Signed out (demo)")}
              className="inline-flex items-center gap-2 rounded-xl border border-risk/40 px-4 py-2.5 text-sm font-bold text-risk transition-colors hover:bg-risk/8"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
