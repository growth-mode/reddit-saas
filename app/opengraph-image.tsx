import { ImageResponse } from "next/og";

export const alt = "Subredify — Reply to Reddit threads that rank on Google";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          border: "none",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ff4500",
            }}
          />
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#0a0a0a", letterSpacing: "-0.5px" }}>
            Subredify
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#fff1ed",
              border: "1px solid #ffd8cc",
              borderRadius: "100px",
              padding: "6px 16px",
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: "13px", color: "#ff4500", fontWeight: "600" }}>
              Reddit threads rank on Google. Yours should too.
            </span>
          </div>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "700",
              color: "#0a0a0a",
              lineHeight: "1.15",
              letterSpacing: "-1.5px",
              margin: "0",
            }}
          >
            Reply early.
            <br />
            <span style={{ color: "#ff4500" }}>Rank faster.</span>
          </h1>
          <p style={{ fontSize: "20px", color: "#6b7280", margin: "0", lineHeight: "1.5", maxWidth: "620px" }}>
            Find ICP conversations, score them for Google rank probability, and get a compliant reply draft — in one workflow.
          </p>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[
            { label: "Subreddit DA", value: "91/100" },
            { label: "Reply window", value: "2–72 hrs" },
            { label: "Rank scoring", value: "0–100" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#0a0a0a" }}>{s.value}</span>
              <span style={{ fontSize: "13px", color: "#9ca3af" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
