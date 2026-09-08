import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CloudSun,
  Droplets,
  FileText,
  HeartPulse,
  Leaf,
  Sprout,
  Wind,
} from "lucide-react";
import { AppShell } from "@/components/soilguard/AppShell";
import { FieldWorkspace, QuickActions } from "@/components/soilguard/FieldWorkspace";
import { Panel, SoilPropertiesPanel, WeatherPanel } from "@/components/soilguard/panels";
import { brand, summary, user, weatherNow } from "@/data/soilguard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SoilGuard — AI Soil Health & Field Monitoring for Farmers" },
      {
        name: "description",
        content:
          "Monitor field health, analyse soil, track disease risk from satellite data and get AI action plans. Healthy Soil • Higher Yields.",
      },
      { property: "og:title", content: "SoilGuard — AI Soil Health Monitoring" },
      {
        property: "og:description",
        content: "Select your field, analyse the soil, understand the risk and get an AI action plan.",
      },
    ],
  }),
  component: Overview,
});

const cards = [
  { label: "Total Fields", value: summary.totalFields, icon: Sprout, tone: "bg-leaf/12 text-leaf" },
  { label: "Healthy Fields", value: summary.healthyFields, icon: Leaf, tone: "bg-lime/20 text-forest" },
  { label: "At Risk", value: summary.atRisk, icon: AlertTriangle, tone: "bg-sun/20 text-[#8a5f00]" },
  { label: "High Risk", value: summary.highRisk, icon: HeartPulse, tone: "bg-risk/12 text-risk" },
];

function Overview() {
  return (
    <AppShell>
      <section className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:items-center">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-3xl font-extrabold sm:text-4xl">
              Good morning, {user.name.split(" ")[0]}!
              <span aria-hidden>☀️</span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              Healthy soil today. A more productive tomorrow.
            </p>
          </div>
          <blockquote className="rounded-2xl border border-lime/40 bg-mint px-4 py-3 text-sm font-semibold text-forest italic">
            “{brand.quote}” <Leaf className="ml-1 inline h-4 w-4" />
          </blockquote>
        </div>

        <div className="card-surface grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <CloudSun className="h-4 w-4 text-sun" /> {weatherNow.place}
            </p>
            <p className="mt-2 text-3xl font-extrabold">{weatherNow.temp}</p>
            <p className="text-xs text-muted-foreground">{weatherNow.condition}</p>
          </div>
          <dl className="space-y-1.5 border-l border-border pl-4 text-xs">
            <p className="text-right text-[11px] font-semibold text-muted-foreground">{weatherNow.date}</p>
            {[
              ["Humidity", weatherNow.humidity, Droplets],
              ["Rainfall (24h)", weatherNow.rainfall24h, Droplets],
              ["Wind", weatherNow.wind, Wind],
            ].map(([label, value]) => (
              <div key={label as string} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <dt className="truncate text-muted-foreground">{label as string}</dt>
                <dd className="font-bold">{value as string}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <Link
            key={label}
            to="/risk-intelligence"
            className="card-surface card-hover grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4"
          >
            <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tone)}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-2xl font-extrabold">{value}</span>
              <span className="block truncate text-xs font-semibold text-muted-foreground">{label}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
        <Link
          to="/analyze-soil"
          className="card-hover grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[1.25rem] bg-brand-gradient p-4 text-white shadow-lg"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
            <FileText className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold">Get AI Insights</span>
            <span className="block truncate text-xs text-white/80">Understand your soil better</span>
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <FieldWorkspace />

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <WeatherPanel />
        <SoilPropertiesPanel />
        <QuickActions />
      </div>

      <Panel className="mt-4 border-dashed">
        <p className="text-center text-sm font-semibold text-muted-foreground">
          Select my field → Analyze my soil → Understand the risk → Get an action plan
        </p>
      </Panel>
    </AppShell>
  );
}
