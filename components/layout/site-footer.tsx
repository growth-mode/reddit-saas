import Link from "next/link";
import { Layers } from "lucide-react";

const FOOTER_LINKS = [
  {
    group: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "About", href: "/about" },
    ],
  },
  {
    group: "Use cases",
    links: [
      { label: "For SaaS founders", href: "/for/saas-founders" },
      { label: "For agencies", href: "/for/agencies" },
      { label: "For B2B marketing", href: "/for/b2b-marketing" },
      { label: "For growth hackers", href: "/for/growth-hackers" },
    ],
  },
  {
    group: "Compare",
    links: [
      { label: "vs GummySearch", href: "/compare/subredify-vs-gummysearch" },
      { label: "vs Brandwatch", href: "/compare/subredify-vs-brandwatch" },
      { label: "vs F5Bot", href: "/compare/subredify-vs-f5bot" },
      { label: "vs Mention", href: "/compare/subredify-vs-mention" },
      { label: "All comparisons", href: "/compare" },
    ],
  },
  {
    group: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Topic clusters", href: "/topics" },
      { label: "Glossary", href: "/glossary" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Logo + tagline */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">Subredify</span>
          </div>
          <p className="text-xs text-muted-foreground">Reply early. Rank faster.</p>
        </div>

        {/* Link groups */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {FOOTER_LINKS.map((group) => (
            <div key={group.group}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {group.group}
              </p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Subredify. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-[11px] text-primary hover:underline">
              Get started free →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
