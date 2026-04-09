"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Rss, List, FileText, Settings, CreditCard, LogOut, Layers, ChevronLeft, ChevronRight, Menu, Shield, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-2.5 rounded-md text-[13px] transition-colors ${
        collapsed ? "px-3 py-2 justify-center" : "px-3 py-2"
      } ${
        active
          ? "text-primary font-medium border-l-2 border-primary pl-[10px] bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

const NAV_GROUPS = [
  {
    label: "Monitor",
    items: [
      { href: "/feed", icon: Rss, label: "Feed" },
      { href: "/subreddits", icon: List, label: "Subreddits" },
    ],
  },
  {
    label: "Replies",
    items: [
      { href: "/drafts", icon: FileText, label: "Drafts" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/settings", icon: Settings, label: "Settings" },
      { href: "/billing", icon: CreditCard, label: "Billing" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [engagements, setEngagements] = useState<{ total: number; thisMonth: number } | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (data?.is_admin) setIsAdmin(true);
    }
    async function fetchEngagements() {
      const res = await fetch("/api/engagements/summary");
      if (res.ok) {
        const data = await res.json() as { total: number; thisMonth: number };
        setEngagements(data);
      }
    }
    checkAdmin();
    fetchEngagements();
  }, []);

  // Persist collapse state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const sidebarContent = (
    <aside
      className={`${
        collapsed ? "w-[52px]" : "w-[220px]"
      } shrink-0 border-r border-border flex flex-col bg-white transition-all duration-200 h-full`}
    >
      {/* Logo */}
      <div className={`px-4 py-5 border-b border-border flex items-center ${collapsed ? "justify-center px-0" : ""}`}>
        <Link href="/feed" className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary shrink-0" />
          {!collapsed && <span className="font-semibold text-sm">Subredify</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
              <NavItem key={item.href} {...item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* Engagement stats */}
      {engagements !== null && engagements.total > 0 && (
        <div className={`border-t border-border ${collapsed ? "px-2 py-3" : "px-4 py-3"}`}>
          {collapsed ? (
            <div className="flex justify-center" title={`${engagements.total} engagements`}>
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-600" />
                Engagements
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold tabular-nums">{engagements.total}</span>
                <span className="text-[10px] text-muted-foreground">total</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {engagements.thisMonth} this month
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom: collapse toggle + logout */}
      <div className="border-t border-border p-2 space-y-0.5">
        {isAdmin && (
          <NavItem href="/admin" icon={Shield} label="Admin" collapsed={collapsed} />
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`flex items-center gap-2.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full ${
            collapsed ? "px-3 py-2 justify-center" : "px-3 py-2"
          }`}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={toggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`hidden lg:flex items-center gap-2.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full ${
            collapsed ? "px-3 py-2 justify-center" : "px-3 py-2"
          }`}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-muted/20 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/feed" className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Subredify</span>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
