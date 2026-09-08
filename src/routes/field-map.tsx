import { createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon } from "lucide-react";
import { AppShell, PageHeader } from "@/components/soilguard/AppShell";
import { FieldWorkspace, QuickActions } from "@/components/soilguard/FieldWorkspace";
import { SoilPropertiesPanel, WeatherPanel } from "@/components/soilguard/panels";

export const Route = createFileRoute("/field-map")({
  head: () => ({
    meta: [
      { title: "Field Map — Draw & Measure Your Field | SoilGuard" },
      {
        name: "description",
        content:
          "Draw and edit field boundaries on satellite imagery, measure area in hectares and read exact corner coordinates.",
      },
      { property: "og:title", content: "Field Map — SoilGuard" },
      { property: "og:description", content: "Draw field boundaries on satellite imagery and measure area instantly." },
    ],
  }),
  component: FieldMapPage,
});

function FieldMapPage() {
  return (
    <AppShell>
      <PageHeader
        title="Field Map"
        subtitle="Draw, edit and measure your field boundary on satellite imagery"
        icon={MapIcon}
      />
      <FieldWorkspace />
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <WeatherPanel />
        <SoilPropertiesPanel />
        <QuickActions />
      </div>
    </AppShell>
  );
}
