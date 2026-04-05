export interface TopicPageData {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  heroStat: string;
  heroStatLabel: string;
  subreddits: string[];
  keySignals: string[];
  exampleQueries: string[];
  whyItRanks: string;
  strategyNote: string;
  relatedTopics: string[];
  relatedBlogSlugs: string[];
}

export const TOPIC_DATA: Record<string, TopicPageData> = {
  "saas-marketing": {
    slug: "saas-marketing",
    title: "SaaS Marketing Conversations on Reddit",
    description: "The Reddit communities where SaaS founders discuss marketing tools, tactics, and software — and where those conversations rank on Google.",
    longDescription: "SaaS marketing conversations on Reddit span dozens of communities — from r/SaaS and r/entrepreneur to r/growthhacking and r/marketing. These threads address real buyer questions: which tools to use for email automation, how to approach content marketing on a budget, what attribution models work for SaaS. Because these questions are asked by real practitioners, Google trusts the answers — and threads consistently rank for commercial SaaS marketing tool queries.",
    heroStat: "DA 91",
    heroStatLabel: "Domain authority of Reddit's top SaaS communities",
    subreddits: ["SaaS", "entrepreneur", "startups", "marketing", "growthhacking"],
    keySignals: [
      "Tool-seeking threads: 'What email marketing tool do you use?'",
      "Comparison threads: 'HubSpot vs Klaviyo for SaaS?'",
      "Stack questions: 'What's your SaaS marketing stack?'",
      "Frustration threads: 'Tired of [tool] — what are you using instead?'",
    ],
    exampleQueries: [
      "best email marketing tool for saas",
      "saas marketing automation software",
      "marketing tools for early stage saas",
      "hubspot alternatives for startups",
      "content marketing for saas companies",
    ],
    whyItRanks: "SaaS marketing threads in high-DA communities generate high comment velocity because the topic has broad relevance. Question-format titles match commercial search queries exactly. Google treats Reddit's practitioner-to-practitioner recommendations as high-E-E-A-T content.",
    strategyNote: "Reply to tool-seeking and comparison threads within 2-4 hours of posting for maximum Google rank potential. Threads in r/entrepreneur and r/SaaS are indexed within hours of reaching 10+ comments.",
    relatedTopics: ["startup-growth-hacking", "b2b-lead-generation", "content-marketing"],
    relatedBlogSlugs: ["best-subreddits-for-saas-founders", "find-icp-on-reddit", "b2b-saas-reddit-playbook"],
  },
  "b2b-lead-generation": {
    slug: "b2b-lead-generation",
    title: "B2B Lead Generation Conversations on Reddit",
    description: "Reddit communities where B2B sales and marketing professionals discuss lead generation tools, outbound tactics, and prospecting software.",
    longDescription: "B2B lead generation is one of the most commercially valuable topic clusters on Reddit. Threads in r/sales, r/entrepreneur, r/startups, and r/marketing regularly surface questions about prospecting tools, outbound email platforms, lead database software, and LinkedIn automation. These threads rank on Google for high-intent B2B software queries — and the buyers in these conversations are actively evaluating purchases.",
    heroStat: "High intent",
    heroStatLabel: "B2B lead gen threads indicate late-stage buying intent",
    subreddits: ["sales", "entrepreneur", "startups", "marketing", "consulting"],
    keySignals: [
      "Prospecting tool questions: 'What tools do you use for B2B prospecting?'",
      "Database comparisons: 'Apollo vs ZoomInfo — worth the price?'",
      "Outbound stack questions: 'What's your cold email stack?'",
      "Lead qualification threads: 'How are you qualifying B2B leads?'",
    ],
    exampleQueries: [
      "best b2b prospecting tools",
      "apollo vs zoominfo",
      "cold email software for b2b",
      "b2b lead generation tools 2025",
      "linkedin automation tools reddit",
    ],
    whyItRanks: "B2B lead generation tools represent large software purchases with multiple competing vendors, which means many searchers looking for independent opinions — exactly what Reddit provides. Comparison and alternatives queries in this space rank Reddit threads prominently.",
    strategyNote: "r/sales and r/entrepreneur are the primary communities. Reply to CRM and prospecting threads early — they receive high comment velocity and rank quickly for competitive commercial queries.",
    relatedTopics: ["saas-marketing", "crm-software", "startup-growth-hacking"],
    relatedBlogSlugs: ["find-icp-on-reddit", "b2b-saas-reddit-playbook", "best-subreddits-for-saas-founders"],
  },
  "startup-growth-hacking": {
    slug: "startup-growth-hacking",
    title: "Startup Growth Conversations on Reddit",
    description: "Where startup founders and growth teams discuss acquisition channels, growth experiments, and the tools powering early-stage growth.",
    longDescription: "Startup growth conversations on Reddit cover the full spectrum from early acquisition tactics to scaling what works. These communities are full of founder-to-founder knowledge sharing about SEO tools, paid acquisition, viral loops, referral programs, and the product analytics that drive growth decisions. Threads in r/entrepreneur, r/startups, and r/SaaS rank for a wide range of startup growth tool queries.",
    heroStat: "3.2M",
    heroStatLabel: "Members in r/entrepreneur alone",
    subreddits: ["entrepreneur", "SaaS", "startups", "growthhacking"],
    keySignals: [
      "Acquisition channel questions: 'What's driving growth at your early-stage startup?'",
      "Growth tool discussions: 'What analytics tools are you using?'",
      "Experiment sharing: 'We tried X and got Y result — anyone else?'",
      "Scale questions: 'What changed in your stack when you hit $X ARR?'",
    ],
    exampleQueries: [
      "startup growth tools",
      "growth hacking tools for startups",
      "best analytics tool early stage startup",
      "saas growth tactics reddit",
      "acquisition channels for b2b saas",
    ],
    whyItRanks: "Startup growth is a broad topic with many specific sub-queries, each with commercial intent. Founders sharing real results generate high comment velocity, which drives indexation and ranking.",
    strategyNote: "Focus on threads from founders at your ICP's stage — early-stage founders have different needs than growth-stage teams. Replies that acknowledge the specific stage constraints are more credible.",
    relatedTopics: ["saas-marketing", "b2b-lead-generation", "content-marketing"],
    relatedBlogSlugs: ["why-reddit-threads-rank-on-google", "reply-early-rank-faster", "rank-opportunity-score-explained"],
  },
  "developer-tools": {
    slug: "developer-tools",
    title: "Developer Tool Conversations on Reddit",
    description: "Where developers discuss IDEs, hosting platforms, databases, APIs, and the full developer toolchain.",
    longDescription: "Developer tool conversations on Reddit span r/webdev, r/programming, and dozens of framework-specific subreddits. These threads rank for highly commercial queries about hosting platforms, database solutions, CI/CD tools, monitoring software, and API platforms. The developer community is vocal and opinionated — genuine technical recommendations receive strong upvotes and rank well.",
    heroStat: "1.9M",
    heroStatLabel: "Members in r/webdev",
    subreddits: ["webdev", "programming", "devops", "javascript", "reactjs"],
    keySignals: [
      "Stack questions: 'What's your 2025 web development stack?'",
      "Hosting comparisons: 'Vercel vs Netlify vs AWS for Next.js?'",
      "Database questions: 'What database are you using for your side project?'",
      "Tool switching: 'Switched from X to Y for deployment — here's why'",
    ],
    exampleQueries: [
      "best hosting for nextjs 2025",
      "vercel vs netlify comparison",
      "developer tools reddit recommendation",
      "best database for saas startup",
      "ci cd tools for small teams",
    ],
    whyItRanks: "Developer communities have extremely high engagement rates. Technical specificity in thread titles creates exact-match ranking opportunities for tool comparison queries that have significant search volume.",
    strategyNote: "Technical depth is non-negotiable in developer communities. Replies must include specific technical context — performance benchmarks, migration experience, edge cases handled. Shallow recommendations get downvoted.",
    relatedTopics: ["saas-marketing", "startup-growth-hacking"],
    relatedBlogSlugs: ["best-subreddits-for-saas-founders", "why-reddit-threads-rank-on-google"],
  },
  "ecommerce-marketing": {
    slug: "ecommerce-marketing",
    title: "Ecommerce Marketing Tool Conversations on Reddit",
    description: "Reddit communities where ecommerce operators discuss email marketing, analytics, paid ads, and the tools running their stores.",
    longDescription: "Ecommerce marketing discussions on Reddit are highly commercial — participants are running live businesses and actively buying tools. r/ecommerce, r/shopify, and related communities generate threads about email marketing platforms, abandoned cart tools, loyalty programs, paid advertising, and analytics. These threads rank for ecommerce-specific software queries that have high purchase intent.",
    heroStat: "420K",
    heroStatLabel: "Members in r/ecommerce",
    subreddits: ["ecommerce", "shopify", "entrepreneur", "smallbusiness"],
    keySignals: [
      "Platform questions: 'What email platform are Shopify stores using?'",
      "Tool ROI questions: 'Is Klaviyo worth it for a $500K/year store?'",
      "Stack sharing: 'Here's the full ecommerce marketing stack that got us to $1M'",
      "Comparison threads: 'Klaviyo vs Mailchimp for ecommerce'",
    ],
    exampleQueries: [
      "best email marketing for shopify",
      "klaviyo alternatives ecommerce",
      "ecommerce marketing tools 2025",
      "shopify apps worth paying for",
      "email marketing roi ecommerce reddit",
    ],
    whyItRanks: "Ecommerce tool queries have high commercial intent and significant search volume. Reddit threads comparing specific platforms rank prominently because searchers trust practitioner opinions over vendor-produced comparison content.",
    strategyNote: "Revenue-specific context makes replies more credible in ecommerce communities — 'at our store doing $X/month, we found...' receives more upvotes than generic recommendations.",
    relatedTopics: ["saas-marketing", "b2b-lead-generation", "content-marketing"],
    relatedBlogSlugs: ["best-subreddits-for-saas-founders", "find-icp-on-reddit"],
  },
  "content-marketing": {
    slug: "content-marketing",
    title: "Content Marketing Tool Conversations on Reddit",
    description: "Where content marketers discuss SEO tools, CMS platforms, content creation software, and distribution strategies.",
    longDescription: "Content marketing tool discussions on Reddit cover SEO platforms, content management systems, editorial calendars, analytics tools, and distribution software. Threads in r/marketing, r/SEO, and r/entrepreneur regularly surface questions about content tools that rank for commercial queries. This is a highly competitive software category with strong practitioner-to-practitioner opinion sharing.",
    heroStat: "1.3M",
    heroStatLabel: "Members in r/marketing",
    subreddits: ["marketing", "SEO", "entrepreneur", "startups"],
    keySignals: [
      "SEO tool questions: 'What SEO tools are you using for content?'",
      "CMS questions: 'What CMS does your team use for content marketing?'",
      "Workflow questions: 'What's your content creation workflow?'",
      "Distribution questions: 'How are you distributing content beyond SEO?'",
    ],
    exampleQueries: [
      "best seo tools for content marketing",
      "content marketing software for small teams",
      "ahrefs vs semrush for content",
      "content cms for saas companies",
      "content marketing tools 2025 reddit",
    ],
    whyItRanks: "Content marketing tools represent significant spend decisions. Practitioners seeking independent opinions find Reddit threads trustworthy compared to vendor-produced content, and Google's E-E-A-T update rewards this type of first-person experience sharing.",
    strategyNote: "Content marketing professionals respond well to data-driven replies. Specific metrics from your own experience (traffic growth, keyword improvements) make recommendations credible and compelling.",
    relatedTopics: ["saas-marketing", "startup-growth-hacking"],
    relatedBlogSlugs: ["reddit-dominates-google-serp", "why-reddit-threads-rank-on-google", "best-subreddits-for-saas-founders"],
  },
  "crm-software": {
    slug: "crm-software",
    title: "CRM Software Conversations on Reddit",
    description: "Reddit communities where sales teams and founders compare CRM tools — one of the most commercially valuable conversation clusters on the platform.",
    longDescription: "CRM is one of the most actively discussed software categories on Reddit. Threads in r/sales, r/entrepreneur, r/startups, and r/smallbusiness regularly surface CRM comparisons, pricing debates, and implementation questions. These threads rank for some of the most commercially valuable software queries on Google — 'best CRM for startups', 'Salesforce alternatives', 'CRM for small business' — with audiences who are actively evaluating purchases.",
    heroStat: "$120B",
    heroStatLabel: "Global CRM market — buyers research heavily on Reddit",
    subreddits: ["sales", "entrepreneur", "startups", "smallbusiness", "consulting"],
    keySignals: [
      "Direct comparisons: 'HubSpot vs Pipedrive for small sales team'",
      "Alternatives queries: 'What are you using instead of Salesforce?'",
      "Sizing questions: 'What CRM for a 2-person sales team?'",
      "Frustration threads: 'Salesforce is too expensive — what are you using?'",
    ],
    exampleQueries: [
      "best crm for startups reddit",
      "salesforce alternatives reddit",
      "hubspot vs pipedrive",
      "crm for small business recommendation",
      "free crm for small team",
    ],
    whyItRanks: "CRM comparisons are among the highest-volume software queries on Google. Reddit threads appear in the top 5 results for dozens of CRM comparison queries because practitioners trust peer recommendations over vendor content.",
    strategyNote: "CRM threads have the highest comment velocity of any software category. Reply within 2 hours for maximum visibility. Use outcome-specific language — 'we closed 30% more deals after switching' — rather than feature lists.",
    relatedTopics: ["b2b-lead-generation", "saas-marketing", "startup-growth-hacking"],
    relatedBlogSlugs: ["find-icp-on-reddit", "b2b-saas-reddit-playbook", "best-subreddits-for-saas-founders"],
  },
  "product-management": {
    slug: "product-management",
    title: "Product Management Tool Conversations on Reddit",
    description: "Where product managers discuss roadmapping tools, analytics platforms, user research software, and the PM tech stack.",
    longDescription: "Product management tool discussions on Reddit have grown significantly as the PM role has become more tool-intensive. r/ProductManagement, r/SaaS, and r/startups host active threads about roadmapping software, user analytics, feature flagging, A/B testing, and user feedback tools. These threads rank for PM-specific tool queries and attract practitioners who are actively evaluating software for their teams.",
    heroStat: "260K",
    heroStatLabel: "Members in r/ProductManagement",
    subreddits: ["ProductManagement", "SaaS", "startups", "webdev"],
    keySignals: [
      "Roadmap tool questions: 'What roadmapping software does your team use?'",
      "Analytics questions: 'What product analytics tool are you using?'",
      "Feedback tool questions: 'How are you collecting user feedback?'",
      "Comparison threads: 'Amplitude vs Mixpanel vs PostHog'",
    ],
    exampleQueries: [
      "best product roadmap tool 2025",
      "product analytics software comparison",
      "amplitude vs mixpanel reddit",
      "user feedback tools for product managers",
      "feature flagging tools reddit",
    ],
    whyItRanks: "Product management tools are a growing software category with multiple competing vendors. Reddit's practitioner community provides the unbiased comparison content that searchers trust, ranking prominently for tool comparison queries.",
    strategyNote: "PMs respond to specificity about team size and product maturity. Recommendations that acknowledge 'at X stage, Y tool makes sense' perform better than one-size-fits-all suggestions.",
    relatedTopics: ["developer-tools", "saas-marketing", "startup-growth-hacking"],
    relatedBlogSlugs: ["best-subreddits-for-saas-founders", "find-icp-on-reddit"],
  },
};

export function getTopicData(slug: string): TopicPageData | null {
  return TOPIC_DATA[slug] ?? null;
}

export function getAllTopicSlugs(): string[] {
  return Object.keys(TOPIC_DATA);
}
