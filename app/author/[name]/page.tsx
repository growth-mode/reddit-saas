import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AUTHORS, getAuthor, getAllAuthorSlugs } from "@/lib/seo/authors";
import { getPost } from "@/lib/blog/posts";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { Clock, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";

export async function generateStaticParams() {
  return getAllAuthorSlugs().map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const author = getAuthor(name);
  if (!author) return {};
  return buildMetadata({
    title: `${author.name} — ${author.role} at Subredify`,
    description: author.bio,
    path: `/author/${name}`,
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const author = getAuthor(name);
  if (!author) notFound();

  const pageUrl = `${BASE_URL}/author/${name}`;
  const posts = author.postSlugs.map((slug) => getPost(slug)).filter(Boolean);

  return (
    <>
      <WebPageJsonLd title={`${author.name} | Subredify`} description={author.bio} url={pageUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: author.name,
            jobTitle: author.role,
            description: author.bio,
            url: pageUrl,
            worksFor: {
              "@type": "Organization",
              name: "Subredify",
              url: "https://www.subredify.io",
            },
            knowsAbout: author.expertise,
            ...(author.twitterHandle && {
              sameAs: [`https://twitter.com/${author.twitterHandle}`],
            }),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h1 className="text-base font-semibold">{author.name}</h1>
                  <p className="text-xs text-muted-foreground">{author.role} · Subredify</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{author.bio}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {author.expertise.map((exp) => (
                  <span key={exp} className="text-[10px] bg-muted text-muted-foreground rounded px-2 py-0.5">
                    {exp}
                  </span>
                ))}
              </div>

              {author.twitterHandle && (
                <a
                  href={`https://twitter.com/${author.twitterHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  @{author.twitterHandle} on X →
                </a>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold mb-4">Articles</h2>
              <div className="space-y-3">
                {posts.map((post) => post && (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex items-start justify-between gap-4 border border-border rounded-lg p-4 hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 mb-2 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-xs font-semibold group-hover:text-primary transition-colors leading-snug mt-1 mb-1.5">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {post.readingTime} min
                        </span>
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
