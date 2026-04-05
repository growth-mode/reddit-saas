import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { getAllSubredditNames } from "@/lib/seo/subreddits";
import { getAllTopicSlugs } from "@/lib/seo/topics";
import { getAllCompetitorSlugs } from "@/lib/seo/competitors";
import { getAllGlossarySlugs } from "@/lib/seo/glossary";
import { getAllAudiences } from "@/lib/seo/use-cases";
import { getAllAuthorSlugs } from "@/lib/seo/authors";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/topics`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/changelog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const subredditPages: MetadataRoute.Sitemap = getAllSubredditNames().map(
    (name) => ({
      url: `${BASE_URL}/r/${name}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const topicPages: MetadataRoute.Sitemap = getAllTopicSlugs().map((slug) => ({
    url: `${BASE_URL}/topics/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparePages: MetadataRoute.Sitemap = getAllCompetitorSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/compare/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })
  );

  const glossaryPages: MetadataRoute.Sitemap = getAllGlossarySlugs().map(
    (term) => ({
      url: `${BASE_URL}/glossary/${term}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  const forPages: MetadataRoute.Sitemap = getAllAudiences().map((audience) => ({
    url: `${BASE_URL}/for/${audience}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const authorPages: MetadataRoute.Sitemap = getAllAuthorSlugs().map(
    (name) => ({
      url: `${BASE_URL}/author/${name}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  return [
    ...staticPages,
    ...blogPages,
    ...subredditPages,
    ...topicPages,
    ...comparePages,
    ...glossaryPages,
    ...forPages,
    ...authorPages,
  ];
}
