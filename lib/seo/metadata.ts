import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";
const SITE_NAME = "Subredify";
const DEFAULT_DESCRIPTION =
  "Monitor Reddit for ICP conversations, score threads for Google rank potential, and generate rule-compliant reply drafts.";

export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: "@subredify",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildArticleMetadata({
  title,
  description,
  path,
  publishedAt,
  updatedAt,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    keywords: tags,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? publishedAt,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: "@subredify",
    },
    robots: { index: true, follow: true },
  };
}

export { BASE_URL, SITE_NAME, DEFAULT_DESCRIPTION };
