"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Rss, List, FileText, Settings, CreditCard, LogOut, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
        active
          ? "text-primary font-medium border-l-2 border-primary pl-[10px] bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-border flex flex-col bg-white">
        <div className="px-4 py-5 border-b border-border">
          <Link href="/feed" className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Subredify</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Monitor
          </p>
          <NavItem href="/feed" icon={Rss} label="Feed" />
          <NavItem href="/subreddits" icon={List} label="Subreddits" />

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-5">
            Replies
          </p>
          <NavItem href="/drafts" icon={FileText} label="Drafts" />

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-5">
            Account
          </p>
          <NavItem href="/settings" icon={Settings} label="Settings" />
          <NavItem href="/billing" icon={CreditCard} label="Billing" />
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        {children}
      </main>
    </div>
  );
}
