import logo from "@/assets/soilguard-logo.png";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-mint p-1.5 ring-1 ring-lime/40",
        className,
      )}
    >
      <img src={logo} alt="" width={816} height={816} className="h-full w-full object-contain" />
    </span>
  );
}

export function Logo({
  className,
  tone = "light",
  showTagline = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <LogoMark className="h-10 w-10" />
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate font-display text-xl leading-none font-extrabold",
            tone === "light" ? "text-white" : "text-forest",
          )}
        >
          SoilGuard
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 block truncate text-[11px] leading-none font-medium",
              tone === "light" ? "text-white/60" : "text-muted-foreground",
            )}
          >
            Healthy Soil • Higher Yields
          </span>
        )}
      </span>
    </div>
  );
}
