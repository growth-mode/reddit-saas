export interface SubredditPageData {
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  subscribers: string;
  domainAuthority: number;
  rankPotential: "very high" | "high" | "medium";
  category: string;
  topics: string[];
  icpFit: string;
  googleRankNote: string;
  exampleThreads: {
    title: string;
    rankScore: number;
    signalType: string;
    why: string;
  }[];
  relatedSubreddits: string[];
  relatedTopics: string[];
  ruleNotes: string;
}

export const SUBREDDIT_DATA: Record<string, SubredditPageData> = {
  entrepreneur: {
    name: "entrepreneur",
    displayName: "r/entrepreneur",
    description: "The most active community for entrepreneurs and founders. Tool recommendation threads here rank on Google within hours.",
    longDescription: "r/entrepreneur is one of the highest-value Reddit communities for B2B SaaS companies. With over 3.2 million members and a domain authority of 91, threads posted here about CRM tools, productivity stacks, marketing software, and business workflows regularly appear on Google's first page for competitive commercial queries. The community skews toward early-stage founders and solopreneurs who are actively evaluating and buying business software.",
    subscribers: "3.2M",
    domainAuthority: 85,
    rankPotential: "very high",
    category: "Business & Entrepreneurship",
    topics: ["saas-marketing", "startup-growth-hacking", "b2b-lead-generation"],
    icpFit: "Founders, solopreneurs, early-stage startup teams, operators building companies from 0-50 employees",
    googleRankNote: "Threads in r/entrepreneur rank for hundreds of commercial queries — 'best CRM for startups', 'what tools do entrepreneurs use', 'software for small business'. New threads reach Google within 2-4 hours.",
    exampleThreads: [
      {
        title: "What CRM does your small business/startup actually use and why?",
        rankScore: 88,
        signalType: "tool-seeking",
        why: "Question format + high-intent commercial keyword + active subreddit = ranks for 10+ CRM queries within 24 hours",
      },
      {
        title: "What's in your SaaS stack for running a solo business?",
        rankScore: 82,
        signalType: "tool-seeking",
        why: "Stack questions generate high comment velocity — lots of tool mentions = broad Google coverage",
      },
      {
        title: "Frustrated with Salesforce - what are you using instead?",
        rankScore: 79,
        signalType: "frustration",
        why: "'Alternatives to Salesforce' is a high-volume query. Frustration threads attract engaged commenters quickly.",
      },
    ],
    relatedSubreddits: ["SaaS", "startups", "smallbusiness", "growthhacking"],
    relatedTopics: ["saas-marketing", "b2b-lead-generation", "startup-growth-hacking"],
    ruleNotes: "Product mentions are allowed in context of genuine recommendations. No dedicated promotional posts. Disclose affiliation if directly affiliated with a product you recommend.",
  },
  SaaS: {
    name: "SaaS",
    displayName: "r/SaaS",
    description: "A focused community for SaaS founders and operators. High ICP density, threads rank quickly for SaaS-specific queries.",
    longDescription: "r/SaaS is purpose-built for software-as-a-service founders, operators, and enthusiasts. The community discusses growth strategies, tool stacks, pricing models, acquisition channels, and everything in between. ICP match is extremely high for companies selling to other SaaS businesses. Though smaller than r/entrepreneur, the community's focus creates more targeted thread quality — a reply that surfaces in r/SaaS threads reaches buyers at exactly the right stage.",
    subscribers: "280K",
    domainAuthority: 83,
    rankPotential: "high",
    category: "SaaS & Software",
    topics: ["saas-marketing", "startup-growth-hacking", "developer-tools"],
    icpFit: "SaaS founders, product managers, growth teams, SaaS operators from seed to Series B",
    googleRankNote: "r/SaaS threads rank for SaaS-specific commercial queries — 'best tools for saas founders', 'saas analytics software', 'saas billing tools'. High concentration of commercial intent.",
    exampleThreads: [
      {
        title: "What analytics tool are you using for your SaaS in 2025?",
        rankScore: 85,
        signalType: "tool-seeking",
        why: "Analytics tools are a high-spend category for SaaS. This query has commercial intent for multiple analytics vendors.",
      },
      {
        title: "How are you handling churn analysis? What tools/methods work?",
        rankScore: 77,
        signalType: "advice-seeking",
        why: "Churn is a universal SaaS problem. Process questions with tool context rank for multiple variants of 'churn analysis tool'.",
      },
      {
        title: "We hit $10k MRR - what did you change in your stack?",
        rankScore: 72,
        signalType: "advice-seeking",
        why: "Milestone threads attract high engagement. Google surfaces these for '$10k MRR tools' and 'scaling saas stack' queries.",
      },
    ],
    relatedSubreddits: ["entrepreneur", "startups", "ProductManagement", "growthhacking"],
    relatedTopics: ["saas-marketing", "startup-growth-hacking", "developer-tools"],
    ruleNotes: "Self-promotion rules are moderate. Product mentions in context are generally accepted. Dedicated promotion posts require prior approval. Disclose if you built the product you're mentioning.",
  },
  startups: {
    name: "startups",
    displayName: "r/startups",
    description: "A large, active startup community. Stricter rules than r/entrepreneur but strong ICP reach for growth-stage tools.",
    longDescription: "r/startups covers the full startup journey from idea to scale. The community is particularly active around topics of hiring, fundraising, growth tactics, and operational tools. While moderation is stricter about overt promotion, threads about tool recommendations and software comparisons rank well on Google and attract genuinely helpful communities of founders sharing real experience.",
    subscribers: "1.1M",
    domainAuthority: 83,
    rankPotential: "high",
    category: "Startups",
    topics: ["startup-growth-hacking", "b2b-lead-generation", "saas-marketing"],
    icpFit: "Founders and early employees at venture-backed startups, growth-stage company operators, startup advisors",
    googleRankNote: "Tool and process threads from r/startups rank for a wide range of startup-specific queries. The community's credibility with Google is very high.",
    exampleThreads: [
      {
        title: "What project management tool does your startup actually use at scale?",
        rankScore: 83,
        signalType: "tool-seeking",
        why: "Project management at scale is a common pain. This query has commercial intent for multiple PM tools.",
      },
      {
        title: "How do you handle customer support at 1-5 employees?",
        rankScore: 76,
        signalType: "advice-seeking",
        why: "Support tools at early stage is a common purchase. Process answer creates natural product mention context.",
      },
    ],
    relatedSubreddits: ["entrepreneur", "SaaS", "YCombinator", "smallbusiness"],
    relatedTopics: ["startup-growth-hacking", "saas-marketing", "b2b-lead-generation"],
    ruleNotes: "Strict about self-promotion. Genuine recommendations in reply context are fine. Dedicated promo posts require flair approval. Always read the sidebar before posting.",
  },
  smallbusiness: {
    name: "smallbusiness",
    displayName: "r/smallbusiness",
    description: "890K small business owners and operators. High tool-buying intent, more permissive rules than r/startups.",
    longDescription: "r/smallbusiness is a large community of small business owners who are actively running businesses and buying software. The ICP here is different from r/entrepreneur — more established businesses, more operational focus, often non-technical buyers making software decisions. Tool recommendation threads rank for a broad range of SMB-focused queries including accounting software, scheduling tools, email marketing, and CRM.",
    subscribers: "890K",
    domainAuthority: 83,
    rankPotential: "high",
    category: "Small Business",
    topics: ["b2b-lead-generation", "saas-marketing"],
    icpFit: "Small business owners (1-50 employees), operations managers, SMB decision-makers, brick-and-mortar operators going digital",
    googleRankNote: "r/smallbusiness ranks extremely well for SMB tool queries — 'best accounting software small business', 'crm for small business', 'email marketing for small business'.",
    exampleThreads: [
      {
        title: "What accounting software are you using for your small business?",
        rankScore: 91,
        signalType: "tool-seeking",
        why: "Accounting software is the highest-spend software category for SMBs. This query surfaces for multiple branded and unbranded accounting queries.",
      },
      {
        title: "How are you managing customer relationships without expensive CRM?",
        rankScore: 78,
        signalType: "problem-statement",
        why: "Budget-conscious CRM alternatives is a high-volume SMB query. Problem statement threads attract detailed tool recommendations.",
      },
    ],
    relatedSubreddits: ["entrepreneur", "startups", "ecommerce", "freelance"],
    relatedTopics: ["b2b-lead-generation", "saas-marketing"],
    ruleNotes: "Relatively permissive for product mentions in context. No spam or promotional posts. Genuine recommendations with context are well-received.",
  },
  marketing: {
    name: "marketing",
    displayName: "r/marketing",
    description: "1.3M marketers discussing tools, tactics, and strategy. High commercial intent for marketing software.",
    longDescription: "r/marketing is one of the most commercially valuable subreddits for marketing technology companies. The community includes agency professionals, in-house marketers, growth marketers, and marketing consultants who are actively evaluating and purchasing marketing tools. Threads about email marketing, attribution, automation, SEO tools, and analytics rank consistently on Google for marketing tool queries.",
    subscribers: "1.3M",
    domainAuthority: 83,
    rankPotential: "very high",
    category: "Marketing",
    topics: ["saas-marketing", "content-marketing", "b2b-lead-generation"],
    icpFit: "Marketing managers, growth marketers, agency professionals, CMOs at SMBs, marketing consultants",
    googleRankNote: "r/marketing is a goldmine for marketing tool queries. 'Best email marketing tool', 'HubSpot alternatives', 'marketing analytics software' — all commonly surface r/marketing threads.",
    exampleThreads: [
      {
        title: "What email marketing platform are you using in 2025 and why?",
        rankScore: 94,
        signalType: "tool-seeking",
        why: "Email marketing platform is one of the highest-frequency purchase decisions in marketing. This query matches dozens of commercial keywords.",
      },
      {
        title: "How do you track attribution across all your channels?",
        rankScore: 82,
        signalType: "advice-seeking",
        why: "Attribution is a universal pain point. Process questions attract tool recommendations naturally.",
      },
    ],
    relatedSubreddits: ["SEO", "entrepreneur", "growthhacking", "AskMarketing"],
    relatedTopics: ["content-marketing", "saas-marketing", "b2b-lead-generation"],
    ruleNotes: "Clear prohibition on self-promotion as top-level posts. In reply threads, genuine recommendations with context are generally accepted. Disclose any affiliation.",
  },
  SEO: {
    name: "SEO",
    displayName: "r/SEO",
    description: "The primary SEO community on Reddit. Tool comparison threads rank for competitive SEO software queries.",
    longDescription: "r/SEO is the most active SEO community on Reddit, frequented by SEO professionals, agency owners, and in-house SEO teams at all levels. Tool recommendation threads here rank for competitive queries like 'best SEO tools 2025', 'Ahrefs vs Semrush', and 'SEO audit tools'. The community has high baseline technical knowledge, so replies need genuine depth to receive upvotes.",
    subscribers: "470K",
    domainAuthority: 83,
    rankPotential: "high",
    category: "SEO & Search",
    topics: ["content-marketing", "saas-marketing"],
    icpFit: "SEO professionals, agency SEO teams, in-house SEOs, digital marketing managers who own SEO",
    googleRankNote: "Ironic but true: r/SEO threads rank extremely well on Google for SEO tool queries. The community's high engagement rate creates strong crawl signals.",
    exampleThreads: [
      {
        title: "Ahrefs vs Semrush in 2025 - which are you actually using?",
        rankScore: 92,
        signalType: "comparison",
        why: "This is one of the highest-volume SEO tool comparison queries. r/SEO threads on this topic have ranked for years.",
      },
      {
        title: "What SEO tools are worth paying for at a small agency?",
        rankScore: 84,
        signalType: "tool-seeking",
        why: "Budget-qualified buyer query with high commercial intent. Small agency SEO tools is a specific, rankable keyword cluster.",
      },
    ],
    relatedSubreddits: ["marketing", "entrepreneur", "webdev"],
    relatedTopics: ["content-marketing", "saas-marketing"],
    ruleNotes: "Moderate self-promotion tolerance. In-depth, genuine recommendations receive upvotes and stay. Promotional one-liners get removed. Technical depth is required.",
  },
  webdev: {
    name: "webdev",
    displayName: "r/webdev",
    description: "1.9M web developers discussing tools, frameworks, and hosting. High-value for dev tool and infrastructure products.",
    longDescription: "r/webdev is one of the largest developer communities on Reddit, covering frontend, backend, full-stack development, and everything adjacent. Tool and hosting recommendations here rank for a wide range of developer-focused commercial queries. The community has high standards for reply quality — technical depth is required, promotional fluff is aggressively downvoted.",
    subscribers: "1.9M",
    domainAuthority: 83,
    rankPotential: "high",
    category: "Web Development",
    topics: ["developer-tools"],
    icpFit: "Web developers (frontend, backend, full-stack), freelance developers, development team leads, agencies with development services",
    googleRankNote: "r/webdev threads rank consistently for hosting, framework, and tooling queries. 'Best hosting for Next.js', 'Vercel vs Netlify', 'React component library' — these threads surface here frequently.",
    exampleThreads: [
      {
        title: "What's your go-to stack for building and deploying side projects in 2025?",
        rankScore: 87,
        signalType: "tool-seeking",
        why: "Tech stack questions generate high engagement and broad tool coverage, ranking for many component queries.",
      },
    ],
    relatedSubreddits: ["programming", "reactjs", "javascript", "cscareerquestions"],
    relatedTopics: ["developer-tools"],
    ruleNotes: "Strict about promotional content. Technical answers with genuine value are required. Links to your own product require disclosure. No pure promotion posts.",
  },
  programming: {
    name: "programming",
    displayName: "r/programming",
    description: "The core programming community. Technical tool discussions here rank broadly for developer queries.",
    longDescription: "r/programming is a large, technically sophisticated community discussing programming languages, tools, and software engineering practices. While less commercially focused than r/webdev, tool and workflow discussions rank for a broad range of programming tool queries. Replies need genuine technical substance — this community is highly critical of low-quality content.",
    subscribers: "6.9M",
    domainAuthority: 83,
    rankPotential: "medium",
    category: "Programming",
    topics: ["developer-tools"],
    icpFit: "Software engineers, senior developers, engineering managers, CTOs at tech companies",
    googleRankNote: "r/programming ranks for high-intent developer tool queries when threads generate substantial engagement.",
    exampleThreads: [
      {
        title: "What developer tools have genuinely improved your workflow in the last year?",
        rankScore: 79,
        signalType: "tool-seeking",
        why: "Broad tool improvement queries attract diverse recommendations, ranking for many specific tool names.",
      },
    ],
    relatedSubreddits: ["webdev", "cscareerquestions", "devops", "learnprogramming"],
    relatedTopics: ["developer-tools"],
    ruleNotes: "Very strict. Content must be technically valuable. Self-promotion requires disclosure and genuine contribution. This is a hard subreddit for product mentions.",
  },
  sales: {
    name: "sales",
    displayName: "r/sales",
    description: "310K sales professionals. CRM, prospecting tools, and sales automation discussions with high commercial intent.",
    longDescription: "r/sales is the primary community for sales professionals on Reddit, covering SDRs, AEs, sales managers, and VP Sales at companies of all sizes. Tool recommendation threads about CRM, prospecting, sales automation, and enablement rank for competitive B2B sales software queries. The community is direct and results-focused — replies need to be specific about outcomes, not just features.",
    subscribers: "310K",
    domainAuthority: 83,
    rankPotential: "high",
    category: "Sales",
    topics: ["b2b-lead-generation", "crm-software"],
    icpFit: "Sales development reps, account executives, sales managers, revenue ops, VP of Sales",
    googleRankNote: "r/sales threads rank well for sales tool queries — 'best CRM for SDRs', 'prospecting tools for outbound', 'sales automation software'. Commercial intent is extremely high.",
    exampleThreads: [
      {
        title: "What CRM are you actually using and is it worth the cost?",
        rankScore: 88,
        signalType: "tool-seeking",
        why: "CRM value queries are very high-intent. This exact question format ranks for dozens of CRM-related commercial queries.",
      },
      {
        title: "Best tools for cold email prospecting in 2025?",
        rankScore: 85,
        signalType: "tool-seeking",
        why: "Cold email tools is a recurring high-commercial-intent query. r/sales threads on this topic rank consistently.",
      },
    ],
    relatedSubreddits: ["entrepreneur", "startups", "marketing", "consulting"],
    relatedTopics: ["b2b-lead-generation", "crm-software"],
    ruleNotes: "Genuine recommendations accepted. No overt promotion. Specific experience with tools is required — vague recommendations get downvoted.",
  },
  growthhacking: {
    name: "growthhacking",
    displayName: "r/growthhacking",
    description: "Growth professionals sharing acquisition tactics and tools. Active buyer community for growth software.",
    longDescription: "r/growthhacking (sometimes r/GrowthHacking) is a community of growth practitioners sharing acquisition strategies, retention tactics, and the tools powering their growth work. High tool-buying intent for analytics, A/B testing, email automation, and conversion optimization tools. Threads here rank for growth tool queries.",
    subscribers: "180K",
    domainAuthority: 78,
    rankPotential: "medium",
    category: "Growth Marketing",
    topics: ["startup-growth-hacking", "saas-marketing", "b2b-lead-generation"],
    icpFit: "Growth marketers, head of growth, performance marketers, startup marketing generalists",
    googleRankNote: "r/growthhacking threads rank for growth-specific tool queries and acquisition channel discussions.",
    exampleThreads: [
      {
        title: "What's your current tool stack for growth experiments?",
        rankScore: 76,
        signalType: "tool-seeking",
        why: "Growth stack questions have high engagement and cover multiple tool categories.",
      },
    ],
    relatedSubreddits: ["marketing", "entrepreneur", "SaaS"],
    relatedTopics: ["startup-growth-hacking", "saas-marketing"],
    ruleNotes: "Moderate rules. Value-first replies with product context work well. Community is more tolerant of product mentions when they're specific and relevant.",
  },
  ecommerce: {
    name: "ecommerce",
    displayName: "r/ecommerce",
    description: "Ecommerce operators and founders. Tool discussions rank for ecommerce software queries with high purchase intent.",
    longDescription: "r/ecommerce is a community of ecommerce store owners, operators, and professionals. Tool recommendation threads cover shipping logistics, inventory management, email marketing for ecommerce, analytics, and platform comparisons. Commercial intent is high — participants are actively running businesses and buying tools to improve them.",
    subscribers: "420K",
    domainAuthority: 78,
    rankPotential: "high",
    category: "Ecommerce",
    topics: ["ecommerce-marketing"],
    icpFit: "Ecommerce store owners, DTC brand founders, ecommerce operations managers, marketplace sellers",
    googleRankNote: "r/ecommerce threads rank for platform comparisons, tool recommendations, and ecommerce-specific software queries.",
    exampleThreads: [
      {
        title: "What email platform are ecommerce stores actually using in 2025?",
        rankScore: 86,
        signalType: "tool-seeking",
        why: "Email for ecommerce is a highly competitive software category with many branded search queries.",
      },
    ],
    relatedSubreddits: ["entrepreneur", "smallbusiness", "shopify", "FulfillmentByAmazon"],
    relatedTopics: ["ecommerce-marketing"],
    ruleNotes: "Generally permissive about product mentions in relevant contexts. No spam posts. Genuine recommendations with experience are well-received.",
  },
  ProductManagement: {
    name: "ProductManagement",
    displayName: "r/ProductManagement",
    description: "Product managers discussing tools, processes, and strategy. High-value audience for PM and product tools.",
    longDescription: "r/ProductManagement is a professional community for product managers at all levels. Tool discussions cover roadmapping software, user research platforms, analytics tools, and collaboration software. The community values specific, experience-based recommendations. Threads rank for PM-specific tool queries.",
    subscribers: "260K",
    domainAuthority: 78,
    rankPotential: "medium",
    category: "Product Management",
    topics: ["developer-tools", "saas-marketing"],
    icpFit: "Product managers, senior PMs, heads of product, CPOs, product analysts",
    googleRankNote: "r/ProductManagement threads rank for PM tool queries — 'best roadmap tool', 'product analytics software', 'user research tools for PMs'.",
    exampleThreads: [
      {
        title: "What tool does your team use for product roadmapping?",
        rankScore: 80,
        signalType: "tool-seeking",
        why: "Roadmap tool questions are a perennial PM query. Multiple vendors compete for this keyword cluster.",
      },
    ],
    relatedSubreddits: ["startups", "SaaS", "agile", "userexperience"],
    relatedTopics: ["developer-tools", "saas-marketing"],
    ruleNotes: "Standard professional community rules. Genuine product experience required. Disclosure expected if affiliated with a tool mentioned.",
  },
  freelance: {
    name: "freelance",
    displayName: "r/freelance",
    description: "Freelancers discussing tools, rates, and business operations. High tool-switching frequency and purchase intent.",
    longDescription: "r/freelance covers every aspect of running a freelance business — client acquisition, invoicing, contracts, project management, and communication tools. Freelancers switch tools frequently and have low switching costs, making them an active buyer audience. Tool recommendation threads here rank for freelance-specific software queries.",
    subscribers: "340K",
    domainAuthority: 78,
    rankPotential: "medium",
    category: "Freelance",
    topics: ["b2b-lead-generation"],
    icpFit: "Independent freelancers, consultants, solopreneurs, fractional executives",
    googleRankNote: "r/freelance threads rank well for freelance-specific tool queries — invoicing software, project management for freelancers, client communication tools.",
    exampleThreads: [
      {
        title: "What invoicing/payment software are freelancers actually using?",
        rankScore: 82,
        signalType: "tool-seeking",
        why: "Invoicing tools for freelancers is a high-frequency search query with multiple competing products.",
      },
    ],
    relatedSubreddits: ["entrepreneur", "smallbusiness", "consulting"],
    relatedTopics: ["b2b-lead-generation"],
    ruleNotes: "Permissive about product mentions in context. No spam. Experience-based recommendations are valued.",
  },
  digitalnomad: {
    name: "digitalnomad",
    displayName: "r/digitalnomad",
    description: "Digital nomads discussing remote work tools and lifestyle. Global SaaS buyer community.",
    longDescription: "r/digitalnomad is a large community of location-independent professionals who work remotely. Tool discussions focus on remote work infrastructure — communication tools, project management, time tracking, VPNs, and productivity software. The audience is globally distributed and highly tool-aware, frequently switching and recommending software.",
    subscribers: "530K",
    domainAuthority: 80,
    rankPotential: "medium",
    category: "Remote Work",
    topics: ["saas-marketing"],
    icpFit: "Remote workers, digital nomads, freelancers, distributed team members, remote-first startup employees",
    googleRankNote: "r/digitalnomad ranks for remote work tool queries and software recommendations for distributed teams.",
    exampleThreads: [
      {
        title: "What's your essential software stack as a digital nomad?",
        rankScore: 77,
        signalType: "tool-seeking",
        why: "Stack queries get broad tool coverage and rank for multiple individual tool queries.",
      },
    ],
    relatedSubreddits: ["freelance", "entrepreneur", "remotework"],
    relatedTopics: ["saas-marketing"],
    ruleNotes: "Permissive community. Genuine recommendations accepted. No overtly promotional content.",
  },
  consulting: {
    name: "consulting",
    displayName: "r/consulting",
    description: "Consultants and consulting firm professionals. Tool discussions have very high per-seat purchase intent.",
    longDescription: "r/consulting serves consultants across industries — strategy, IT, management, and specialized consultants. Tool discussions here are high-value because consultants have high purchasing authority and bill clients for software costs. CRM, proposal, project management, and billing tool threads rank for consulting-specific software queries.",
    subscribers: "190K",
    domainAuthority: 78,
    rankPotential: "medium",
    category: "Professional Services",
    topics: ["b2b-lead-generation", "crm-software"],
    icpFit: "Independent consultants, boutique consulting firm partners, strategy consultants, IT consultants",
    googleRankNote: "r/consulting ranks for consulting-specific tool queries with higher average deal values than consumer software.",
    exampleThreads: [
      {
        title: "What CRM are boutique consulting firms using?",
        rankScore: 74,
        signalType: "tool-seeking",
        why: "CRM for consultants is a specific, rankable query cluster that multiple CRM vendors target.",
      },
    ],
    relatedSubreddits: ["freelance", "entrepreneur", "sales", "smallbusiness"],
    relatedTopics: ["b2b-lead-generation", "crm-software"],
    ruleNotes: "Professional tone required. Product mentions acceptable with context. High-quality, experience-based answers perform best.",
  },
};

export function getSubredditData(name: string): SubredditPageData | null {
  return SUBREDDIT_DATA[name] ?? null;
}

export function getAllSubredditNames(): string[] {
  return Object.keys(SUBREDDIT_DATA);
}

export function getSubredditsByTopic(topic: string): SubredditPageData[] {
  return Object.values(SUBREDDIT_DATA).filter((s) =>
    s.topics.includes(topic)
  );
}
