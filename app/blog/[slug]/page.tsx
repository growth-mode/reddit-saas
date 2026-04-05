import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BLOG_POSTS,
  getPost,
  getRelatedPosts,
  type ContentBlock,
} from "@/lib/blog/posts";
import { buildArticleMetadata } from "@/lib/seo/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, HowToJsonLd } from "@/components/seo/json-ld";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildArticleMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    tags: post.tags,
  });
}

function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-base font-semibold mt-10 mb-3 text-foreground">
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 className="text-sm font-semibold mt-6 mb-2 text-foreground">
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-sm text-foreground/80 leading-7 mb-4">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2 mb-4 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
              <span className="text-primary mt-1.5 shrink-0 text-[10px]">▪</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "numbered":
      return (
        <ol className="space-y-3 mb-4 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
              <span className="text-primary font-semibold shrink-0 tabular-nums text-[11px] mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 my-6">
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            {block.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const postUrl = `${BASE_URL}/blog/${post.slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        url={postUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Blog", url: `${BASE_URL}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      {post.faqs && post.faqs.length > 0 && (
        <FAQJsonLd questions={post.faqs} />
      )}
      {post.howToSteps && post.howToSteps.length > 0 && (
        <HowToJsonLd
          name={post.title}
          description={post.description}
          steps={post.howToSteps}
        />
      )}

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-foreground">{post.category}</span>
            </div>

            {/* Header */}
            <div className="mb-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/5 border border-primary/20 rounded px-2 py-0.5 mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-2xl font-semibold leading-snug mb-4 mt-3">
                {post.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min read
                </span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="flex gap-1.5 ml-auto flex-wrap">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <article className="mb-16">
              {post.content.map((block, i) => (
                <ContentRenderer key={i} block={block} />
              ))}
            </article>

            {/* FAQ section */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="border border-border rounded-lg p-5 mb-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Frequently Asked Questions
                </p>
                <div className="space-y-4">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <p className="text-xs font-semibold mb-1.5">{faq.question}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related subreddits */}
            {post.relatedSubreddits.length > 0 && (
              <div className="border border-border rounded-lg p-5 mb-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Related Subreddits
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.relatedSubreddits.map((sub) => (
                    <Link
                      key={sub}
                      href={`/r/${sub}`}
                      className="text-xs bg-muted hover:bg-muted/70 text-foreground rounded px-2.5 py-1.5 transition-colors"
                    >
                      r/{sub}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related topics */}
            {post.relatedTopics.length > 0 && (
              <div className="border border-border rounded-lg p-5 mb-12">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Related Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.relatedTopics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/topics/${topic}`}
                      className="text-xs border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground rounded px-2.5 py-1.5 transition-colors"
                    >
                      {topic.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="border border-border rounded-lg p-6 bg-muted/20 mb-12">
              <h2 className="text-base font-semibold mb-2">
                Find these threads automatically
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Subredify monitors your subreddits hourly, scores every thread for Google rank potential, and generates compliant reply drafts — ready to post in the window that matters.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Start free →
              </Link>
            </div>

            {/* Back to blog */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to blog
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                Related articles
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors group"
                  >
                    <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 mb-2 inline-block">
                      {rel.category}
                    </span>
                    <h3 className="text-xs font-semibold leading-snug group-hover:text-primary transition-colors mt-1 mb-2">
                      {rel.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {rel.readingTime} min
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
