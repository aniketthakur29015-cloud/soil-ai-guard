import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Code2,
  Copy,
  Download,
  Eraser,
  Loader2,
  MapPin,
  MousePointerClick,
  PenLine,
  Ruler,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_POLY, FieldMap, fmtLat, fmtLon, polygonArea, polygonCenter, toLatLon, type Point } from "./FieldMap";
import { HealthGauge } from "./HealthGauge";
import { DiseasePanel, Panel, SatelliteIndicators, ViewDetailsLink } from "./panels";
import { aiInsight, fieldHealth } from "@/data/soilguard";
import { cn } from "@/lib/utils";

export function FieldWorkspace() {
  const [points, setPoints] = useState<Point[]>(DEFAULT_POLY);
  const [mode, setMode] = useState<"draw" | "select">("select");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const [showCorners, setShowCorners] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReady, setAiReady] = useState(false);

  const area = useMemo(() => polygonArea(points), [points]);
  const center = useMemo(() => polygonCenter(points.length ? points : DEFAULT_POLY), [points]);
  const complete = points.length >= 3;

  const runAnalysis = () => {
    if (!complete) {
      toast.error("Mark a field on the map first");
      return;
    }
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      toast.success("Field analysed", { description: "Soil, weather and satellite data updated." });
    }, 1800);
  };

  const generateReport = () => {
    setAiLoading(true);
    setAiReady(false);
    setTimeout(() => {
      setAiLoading(false);
      setAiReady(true);
      toast.success("Detailed AI report generated");
    }, 2000);
  };

  const geojson = JSON.stringify(
    {
      type: "Feature",
      properties: { name: "Selected Field", area_ha: +area.toFixed(2) },
      geometry: {
        type: "Polygon",
        coordinates: [[...points, points[0]].filter(Boolean).map((p) => {
          const { lat, lon } = toLatLon(p as Point);
          return [+lon.toFixed(4), +lat.toFixed(4)];
        })],
      },
    },
    null,
    2,
  );

  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <Panel className="!p-0 overflow-hidden">
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="lg:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="min-w-0">
                <h2 className="text-xl font-bold">Select Your Field</h2>
                <p className="text-sm text-muted-foreground">
                  Click 4 points on the map to mark your field, or use the draw tool.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("draw");
                    setPoints([]);
                    toast("Draw mode on — tap 4 corners of your field");
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                    mode === "draw"
                      ? "bg-brand-gradient text-white shadow-md"
                      : "bg-forest text-white hover:opacity-90",
                  )}
                >
                  <PenLine className="h-4 w-4" /> Draw Field
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("select");
                    setPoints(DEFAULT_POLY);
                    toast.success("Demo field selected — 2.84 ha");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-mint"
                >
                  <MousePointerClick className="h-4 w-4" /> Select Field
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPoints([]);
                    setMode("draw");
                    setAnalyzed(false);
                    toast("Field cleared");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-mint"
                >
                  <Eraser className="h-4 w-4" /> Clear
                </button>
              </div>
            </div>

            <FieldMap points={points} onChange={setPoints} mode={mode} onModeChange={setMode} />

            {/* Field details */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <h3 className="truncate text-lg font-bold">Field Details</h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                    complete ? "bg-leaf/12 text-leaf" : "bg-muted text-muted-foreground",
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {complete ? "Field Selected" : "No Field"}
                </span>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3">
                  <dt className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <Ruler className="h-4 w-4 shrink-0 text-leaf" /> Area
                  </dt>
                  <dd className="text-right">
                    <span className="block font-bold">{area.toFixed(2)} hectares</span>
                    <span className="block text-xs text-muted-foreground">
                      ({Math.round(area * 10000).toLocaleString()} m²)
                    </span>
                  </dd>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3">
                  <dt className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-leaf" /> Center (Lat, Lon)
                  </dt>
                  <dd className="text-right font-bold">
                    <span className="block">{fmtLat(center)}</span>
                    <span className="block">{fmtLon(center)}</span>
                  </dd>
                </div>

                <div className="border-b border-border pb-3">
                  <button
                    type="button"
                    onClick={() => setShowCorners((s) => !s)}
                    aria-expanded={showCorners}
                    className="flex w-full items-center justify-between gap-2 text-muted-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-leaf" /> Corner Coordinates
                    </span>
                    <span className="text-xs font-semibold text-forest">{showCorners ? "Hide" : "Show"}</span>
                  </button>
                  {showCorners && (
                    <ol className="mt-2.5 space-y-1.5">
                      {points.map((p, i) => (
                        <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-xs">
                          <span className="text-muted-foreground">{i + 1}</span>
                          <span className="truncate text-right font-semibold tabular-nums">
                            {fmtLat(p)}, {fmtLon(p)}
                          </span>
                        </li>
                      ))}
                      {!points.length && <li className="text-xs text-muted-foreground">No points yet</li>}
                    </ol>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Code2 className="h-4 w-4 text-leaf" /> GeoJSON
                  </span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toast("Field GeoJSON", { description: geojson.slice(0, 160) + "…" })}
                      className="text-sm font-semibold text-water hover:underline"
                    >
                      View GeoJSON
                    </button>
                    <button
                      type="button"
                      aria-label="Copy GeoJSON"
                      onClick={() => {
                        navigator.clipboard?.writeText(geojson);
                        toast.success("GeoJSON copied to clipboard");
                      }}
                      className="text-muted-foreground transition-colors hover:text-forest"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              </dl>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={analyzing}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing field…
                  </>
                ) : (
                  <>
                    Analyze This Field <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                This will fetch soil, weather and satellite data for analysis
              </p>
            </div>
          </div>
        </Panel>

        {/* Health + satellite */}
        <div className="space-y-4">
          <Panel title="Overall Field Health">
            {analyzing ? (
              <AnalysisSkeleton />
            ) : (
              <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-1">
                <div className="flex flex-col items-center">
                  <HealthGauge score={analyzed ? fieldHealth.score : 0} label={fieldHealth.status} />
                  <p className="mt-3 max-w-[240px] text-center text-xs text-muted-foreground">
                    {fieldHealth.description}
                  </p>
                </div>
                <SatelliteIndicators />
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* AI insight */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <Panel className="border-leaf/30 bg-gradient-to-br from-mint/70 to-card">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-forest">
              <span className={cn("grid h-8 w-8 place-items-center rounded-xl bg-forest text-white", aiLoading && "ai-pulse")}>
                <Sparkles className="h-4 w-4" />
              </span>
              AI Insight
            </p>
            <p className="mt-3 text-sm font-medium">{aiInsight.summary}</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {aiInsight.recommendations.map((r, i) => (
                <li key={r} className="flex items-start gap-2.5 rounded-xl bg-card/80 px-3 py-2.5 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf/15 text-[11px] font-bold text-leaf">
                    {i + 1}
                  </span>
                  <span className="min-w-0">{r}</span>
                </li>
              ))}
            </ol>
            {aiReady && (
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-leaf">
                <Check className="h-4 w-4" /> Detailed AI report ready in Reports.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={generateReport}
            disabled={aiLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {aiLoading ? "Thinking…" : "Generate Detailed AI Report"}
          </button>
        </div>
      </Panel>
      <DiseasePanel right={<ViewDetailsLink onClick={() => toast("Opening Risk Intelligence details")} />} />
      </div>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-forest ai-pulse">
        <Sparkles className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold">Analyzing soil, weather and satellite data…</p>
      <div className="w-full max-w-xs space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${100 - i * 18}%` }} />
        ))}
      </div>
    </div>
  );
}

export function QuickActions() {
  const actions = [
    { label: "View Action Plan", icon: ClipboardList, to: "/action-plan" as const },
    { label: "Download Report", icon: Download, to: "/reports" as const },
    { label: "Compare Fields", icon: BarChart3, to: "/compare" as const },
  ];
  return (
    <Panel title="Quick Actions">
      <div className="grid gap-3">
        {actions.map(({ label, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="card-hover flex items-center gap-3 rounded-xl border border-border px-4 py-4 text-sm leading-tight font-semibold"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mint text-forest">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">{label}</span>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
