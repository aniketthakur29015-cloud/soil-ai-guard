import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutGrid,
  LogOut,
  Map as MapIcon,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  Sprout,
  User,
  X,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Logo, LogoMark } from "./Logo";
import { notifications, user } from "@/data/soilguard";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const navItems = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/field-map", label: "Field Map", icon: MapIcon },
  { to: "/analyze-soil", label: "Analyze Soil", icon: FlaskConical },
  { to: "/risk-intelligence", label: "Risk Intelligence", icon: ShieldAlert },
  { to: "/action-plan", label: "Action Plan", icon: ClipboardList },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Main" className="space-y-1.5">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
              active
                ? "bg-[#45B649] text-white shadow-[0_8px_20px_-10px_rgba(69,182,73,0.9)]"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-forest px-4 py-6">
      <Logo />
      <div className="flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3.5 py-3">
        <LogoMark className="h-9 w-9" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold text-white">Better Soil</p>
          <p className="truncate text-xs text-white/60">Greener Tomorrow</p>
        </div>
      </div>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const [query, setQuery] = useState("");
  return (
    <header className="card-surface grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[auto_1fr_auto]">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-forest lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo tone="dark" className="hidden sm:flex" />
        <LogoMark className="h-10 w-10 sm:hidden" />
      </div>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          toast(query.trim() ? `Searching for “${query.trim()}”` : "Type something to search");
        }}
        className="hidden min-w-0 items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 md:flex"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search fields, villages, or reports"
          placeholder="Search fields, villages, or reports..."
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>

      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-forest transition-colors hover:bg-mint lg:flex">
            <MapPin className="h-4 w-4 text-leaf" />
            {user.location.state} <span className="text-muted-foreground">›</span> {user.location.district}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["Pune", "Nashik", "Ahmednagar", "Satara"].map((d) => (
              <DropdownMenuItem key={d} onSelect={() => toast(`Location set to Maharashtra › ${d}`)}>
                Maharashtra › {d}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-border text-forest transition-colors hover:bg-mint"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-risk text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.title} className="flex-col items-start gap-1 py-2.5">
                <span className="flex items-start gap-2 text-sm font-medium">
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.tone === "bad" ? "bg-risk" : "bg-water",
                    )}
                  />
                  {n.title}
                </span>
                <span className="pl-4 text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border py-1.5 pr-2 pl-1.5 transition-colors hover:bg-mint">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-sm font-bold text-white">
              {user.initials}
            </span>
            <span className="hidden min-w-0 text-left leading-tight sm:block">
              <span className="block truncate text-sm font-bold">{user.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{user.role}</span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user.name}
              <span className="block text-xs font-normal text-muted-foreground">{user.role}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast("Signed out (demo)")}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] lg:block">
        <SidebarInner />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[270px] max-w-[82vw] shadow-2xl">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute top-6 right-3 z-10 grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <div className="mx-auto max-w-[1500px] px-3 pt-3 pb-24 sm:px-5 sm:pb-8 lg:px-6">
          <TopBar onMenu={() => setOpen(true)} />
          <main className="mt-4 sm:mt-5">{children}</main>
        </div>
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card px-1 py-1.5 sm:hidden"
      >
        {navItems.slice(0, 5).map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors",
                active ? "bg-mint text-forest" : "text-muted-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="truncate">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon = Sprout,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-mint text-forest">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold sm:text-3xl">{title}</h1>
          {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
