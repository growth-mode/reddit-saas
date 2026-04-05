import { ImageResponse } from "next/og";
import { getPost, BLOG_POSTS } from "@/lib/blog/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return BLOG_POSTS.map((post) => ({
    id: post.slug,
    alt: post.title,
    size,
    contentType,
  }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  const title = post?.title ?? "Subredify Blog";
  const category = post?.category ?? "Reddit SEO";
  const readingTime = post?.readingTime ?? 5;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          fontFamily: "monospace",
        }}
      >
        {/* Top */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0a0a0a" }}>Subredify</span>
          <div
            style={{
              background: "#fff1ed",
              border: "1px solid #ffd8cc",
              borderRadius: "6px",
              padding: "4px 12px",
              fontSize: "12px",
              color: "#ff4500",
              fontWeight: "600",
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: title.length > 60 ? "38px" : "46px",
              fontWeight: "700",
              color: "#0a0a0a",
              lineHeight: "1.2",
              letterSpacing: "-1px",
              margin: "0",
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          {post?.description && (
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                margin: "0",
                lineHeight: "1.5",
                maxWidth: "750px",
              }}
            >
              {post.description.length > 120
                ? post.description.slice(0, 117) + "..."
                : post.description}
            </p>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ff4500",
              }}
            />
            <span style={{ fontSize: "14px", color: "#6b7280" }}>subredify.com/blog</span>
          </div>
          <span style={{ fontSize: "14px", color: "#d1d5db" }}>·</span>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>{readingTime} min read</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
