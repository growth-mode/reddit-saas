"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    children: [
      { label: "Compare tools", href: "/compare" },
      { label: "Topic clusters", href: "/topics" },
      { label: "Glossary", href: "/glossary" },
      { label: "Changelog", href: "/changelog" },
      { label: "About", href: "/about" },
    ],
  },
];

const MOBILE_ALL_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Compare tools", href: "/compare" },
  { label: "Topic clusters", href: "/topics" },
  { label: "Glossary", href: "/glossary" },
  { label: "Changelog", href: "/changelog" },
  { label: "About", href: "/about" },
  { label: "For SaaS founders", href: "/for/saas-founders" },
  { label: "For agencies", href: "/for/agencies" },
  { label: "For B2B marketing", href: "/for/b2b-marketing" },
  { label: "For growth hackers", href: "/for/growth-hackers" },
];

export function SiteNav({ activePath }: { activePath?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const currentPath = activePath ?? pathname;

  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Subredify</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) =>
            "children" in item ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                    resourcesOpen
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {resourcesOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setResourcesOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-lg shadow-sm z-20 py-1">
                      {(item.children ?? []).map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setResourcesOpen(false)}
                          className={`block px-3 py-2 text-xs transition-colors ${
                            currentPath === child.href
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  currentPath === item.href || currentPath?.startsWith(item.href + "/")
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="text-xs">
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-6 py-4 space-y-1">
            {MOBILE_ALL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                  currentPath === link.href
                    ? "text-primary font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-3 py-2.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-3 py-2.5 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Get started free →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
