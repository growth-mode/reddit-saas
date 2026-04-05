export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "numbered"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  category: string;
  tags: string[];
  content: ContentBlock[];
  relatedSlugs: string[];
  relatedSubreddits: string[];
  relatedTopics: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-reddit-threads-rank-on-google",
    title: "Why Reddit Threads Rank on Google (And How to Get There First)",
    description: "Reddit has a domain authority of 91. Google indexes its threads within hours. Here's exactly why Reddit dominates search results — and how early replies become permanent SEO assets.",
    publishedAt: "2025-01-15",
    readingTime: 8,
    category: "SEO Strategy",
    tags: ["reddit seo", "google ranking", "reddit threads", "rank opportunity"],
    relatedSlugs: ["rank-opportunity-score-explained", "reply-early-rank-faster", "reddit-dominates-google-serp"],
    relatedSubreddits: ["entrepreneur", "SaaS", "startups"],
    relatedTopics: ["saas-marketing", "startup-growth-hacking"],
    content: [
      {
        type: "paragraph",
        text: "Open Google and search for almost any 'best X' or 'what do you use for Y' query. Odds are, a Reddit thread sits in the top three results. This isn't an accident — and it's not temporary. Understanding why Reddit ranks so consistently on Google is the first step to turning that dominance into a distribution channel for your product.",
      },
      {
        type: "heading",
        text: "Reddit's Domain Authority Is Almost Unbeatable",
      },
      {
        type: "paragraph",
        text: "Reddit carries a domain authority of 91 out of 100 — higher than most established media outlets, higher than Wikipedia for many queries, and higher than virtually every SaaS company's blog. Domain authority is Google's rough proxy for how much a website should be trusted. Reddit has earned it through 20 years of inbound links, citations, and organic traffic.",
      },
      {
        type: "paragraph",
        text: "When a thread gets posted on r/entrepreneur, it immediately inherits that DA-91 authority. A new page on a startup's blog with DA 30 faces a steep climb to compete with that — even if the content is objectively better. The platform advantage Reddit holds is structural, not temporary.",
      },
      {
        type: "callout",
        text: "r/entrepreneur (DA 91) vs. the average SaaS blog (DA 28-45). A reply posted at hour one of a ranking thread is worth more SEO real estate than most companies' entire content budgets.",
      },
      {
        type: "heading",
        text: "The 48-Hour Indexation Window",
      },
      {
        type: "paragraph",
        text: "Google's crawler has a special relationship with Reddit. High-activity Reddit threads get crawled within minutes of posting — not days or weeks, as with most websites. But the critical window for ranking is the first 48 to 72 hours. Threads that sustain comment velocity (10+ comments per hour) in that window get promoted in search results while the question is still being actively asked.",
      },
      {
        type: "paragraph",
        text: "This creates a narrow but repeatable opportunity: find the thread while it's fresh, post a genuinely helpful reply before the thread is saturated, and your reply becomes part of the indexed content that ranks. Months later, searchers typing the exact query that thread addresses will land on that page — and your reply is the first substantive answer they read.",
      },
      {
        type: "heading",
        text: "What Makes a Thread Rank vs. Disappear",
      },
      {
        type: "paragraph",
        text: "Not every Reddit thread makes it into Google's index. The ones that rank share specific characteristics. Question-format titles outperform statement titles by a significant margin — 'What CRM does your SaaS use?' ranks on dozens of branded CRM queries; 'I switched CRMs last year' rarely surfaces. This is because question-format titles match the way people type queries into Google.",
      },
      {
        type: "list",
        items: [
          "Subreddit domain authority — r/entrepreneur and r/SaaS threads rank within hours; niche subreddits take longer",
          "Question-format titles — match user search intent directly",
          "Comment velocity — 10+ comments/hr in the first 24 hours signals quality to Googlebot",
          "Upvote velocity — early upvote concentration indicates authentic engagement",
          "Thread age window — Google favors threads 2–72 hours old for fresh rankings",
          "Existing SERP presence — some threads are already indexed; replies there have guaranteed distribution",
        ],
      },
      {
        type: "heading",
        text: "The First-Reply Advantage",
      },
      {
        type: "paragraph",
        text: "When Google renders a Reddit thread in search results, it shows the post title plus the first few substantive comments. Being in the first three replies is the difference between a searcher reading your answer or skipping it entirely. Unlike traditional SEO where you're competing for page rankings, here you're competing for position within a page that's already ranking — a much more tractable problem.",
      },
      {
        type: "paragraph",
        text: "Early replies also receive more upvotes simply by virtue of being visible longer. More upvotes push replies to the top of the thread. Top-of-thread replies are what Google highlights in its featured snippets for Reddit content. The compound effect of being first is significant.",
      },
      {
        type: "heading",
        text: "Why This Matters for B2B SaaS",
      },
      {
        type: "paragraph",
        text: "B2B SaaS buyers research heavily before purchasing. They search 'best project management tool for startups', 'what CRM do agencies use', 'alternatives to [competitor]'. These are the exact queries where Reddit threads rank on page one. A reply that genuinely answers the question — while naturally mentioning your product — captures buyers at peak intent without ad spend.",
      },
      {
        type: "paragraph",
        text: "The challenge is identifying these threads before they're saturated with competitors, verifying they'll actually rank, and drafting a reply that complies with each subreddit's specific rules. Doing this manually for dozens of subreddits is a full-time job. That's exactly the problem Subredify was built to solve.",
      },
      {
        type: "callout",
        text: "Subredify scans your monitored subreddits hourly, scores every thread for Google rank probability, and surfaces only the high-opportunity posts — so you reply in the window that matters.",
      },
    ],
  },
  {
    slug: "best-subreddits-for-saas-founders",
    title: "15 Best Subreddits for SaaS Founders and B2B Marketers (2025)",
    description: "Not all subreddits are equal for SaaS marketing. This is a ranked list of the highest-DA, most ICP-dense communities — with notes on rules, tone, and what works in each.",
    publishedAt: "2025-01-22",
    readingTime: 10,
    category: "Subreddit Guides",
    tags: ["best subreddits saas", "saas reddit", "b2b marketing reddit", "reddit for founders"],
    relatedSlugs: ["how-to-reply-reddit-without-getting-banned", "find-icp-on-reddit", "why-reddit-threads-rank-on-google"],
    relatedSubreddits: ["entrepreneur", "SaaS", "startups", "smallbusiness", "marketing"],
    relatedTopics: ["saas-marketing", "b2b-lead-generation", "startup-growth-hacking"],
    content: [
      {
        type: "paragraph",
        text: "Reddit has thousands of active communities, but most SaaS founders are either targeting the wrong ones or approaching them incorrectly. This guide breaks down the 15 subreddits where your ICP actually lives, ranked by a combination of domain authority, ICP density, and rule permissiveness for product mentions.",
      },
      {
        type: "heading",
        text: "Tier 1: High DA, High ICP Density",
      },
      {
        type: "subheading",
        text: "r/entrepreneur (DA 91, 3.2M members)",
      },
      {
        type: "paragraph",
        text: "The highest-value subreddit for most B2B SaaS tools. Threads here about tool recommendations, productivity stacks, and CRM choices rank on Google within hours. The community skews toward early-stage founders and solopreneurs who are actively buying tools. Rules allow product mentions in the context of genuine recommendations — the key is leading with value, not pitch.",
      },
      {
        type: "subheading",
        text: "r/SaaS (DA 91, 280K members)",
      },
      {
        type: "paragraph",
        text: "A purpose-built community for SaaS founders and operators. Threads about growth, tooling, and product challenges dominate. ICP match is extremely high if you're selling to other SaaS companies. The community is smaller but more concentrated than r/entrepreneur — conversion rates from genuine replies are higher.",
      },
      {
        type: "subheading",
        text: "r/startups (DA 91, 1.1M members)",
      },
      {
        type: "paragraph",
        text: "Slightly more restrictive on self-promotion than r/entrepreneur, but the audience is equally valuable. 'What tools does your startup use?' threads here regularly make Google page one for competitive SaaS queries. Focus on answering process questions with specific, actionable detail — product mentions as supporting evidence work well.",
      },
      {
        type: "heading",
        text: "Tier 2: Domain-Specific High-Value Communities",
      },
      {
        type: "subheading",
        text: "r/smallbusiness (DA 91, 890K members)",
      },
      {
        type: "paragraph",
        text: "SMB-focused founders and operators. Tool recommendation threads here rank for a wide range of commercial queries — accounting software, CRM, scheduling tools, email marketing. Rules are more permissive than r/startups because the community is less policed.",
      },
      {
        type: "subheading",
        text: "r/marketing (DA 91, 1.3M members)",
      },
      {
        type: "paragraph",
        text: "Marketers asking about marketing tools, attribution, automation, and strategy. If your product serves marketers, this is a primary target. Tool comparison threads rank aggressively for queries like 'best email marketing tool for agencies' and 'HubSpot alternatives'.",
      },
      {
        type: "subheading",
        text: "r/webdev (DA 91, 1.9M members)",
      },
      {
        type: "paragraph",
        text: "Developer-tool recommendations, hosting questions, and framework debates. If your product is dev-adjacent, threads here are high-intent. Rules are strict about overt promotion — answers need genuine technical depth. But technically substantive replies with product context do well.",
      },
      {
        type: "subheading",
        text: "r/sales (DA 91, 310K members)",
      },
      {
        type: "paragraph",
        text: "Sales professionals asking about CRM, prospecting tools, and sales automation. Tool recommendation threads rank for competitive B2B queries. The audience is actively evaluating tools. Very direct about what they want from replies — specifics over generalities.",
      },
      {
        type: "heading",
        text: "Tier 3: Niche but High-Conversion Communities",
      },
      {
        type: "list",
        items: [
          "r/SEO — SEO tool recommendations, algorithm discussions, agency questions. Ranks well for SEO tool queries.",
          "r/ProductManagement — PM tool comparisons, roadmap tools, user research methods. High-value B2B audience.",
          "r/growthhacking — Growth tool stacks, acquisition channels, funnel optimization. Active buyers.",
          "r/ecommerce — Ecommerce platform comparisons, logistics tools, marketing software. Very commercial intent.",
          "r/digitalnomad — SaaS tools for remote teams, project management, time tracking. Global ICP.",
          "r/freelance — Invoicing, project management, client communication tools. High tool-switching frequency.",
          "r/consulting — Proposal tools, CRM for consultants, project management. Niche but high-value.",
          "r/AskMarketing — Marketing questions from non-marketers. High intent, receptive to recommendations.",
        ],
      },
      {
        type: "heading",
        text: "How to Evaluate Subreddits for Your Specific ICP",
      },
      {
        type: "paragraph",
        text: "The subreddits above are a starting point. Your ICP might cluster in more specific communities — r/SalesforceAdmins, r/hubspot, r/googleanalytics, r/zapier. Search Reddit for the pain points your product solves and see where those questions get the most engagement. High comment counts on problem-statement threads are the clearest signal.",
      },
      {
        type: "paragraph",
        text: "Domain authority matters less than ICP density for conversion, but it matters a lot for distribution. A perfect-ICP thread in a low-DA subreddit might convert well but won't rank on Google and won't compound. The ideal target is high-DA communities where your ICP concentrates.",
      },
      {
        type: "callout",
        text: "Subredify monitors up to 20 subreddits on the Growth plan — scoring every new thread for ICP relevance and Google rank probability so you only see the threads worth replying to.",
      },
    ],
  },
  {
    slug: "find-icp-on-reddit",
    title: "How to Find Your ICP on Reddit: A Signal-Based Framework",
    description: "Your ideal customers are on Reddit asking real questions, showing real frustrations, and evaluating real tools. Here's a systematic framework for identifying and engaging those conversations.",
    publishedAt: "2025-01-29",
    readingTime: 7,
    category: "ICP Strategy",
    tags: ["icp reddit", "ideal customer profile reddit", "reddit icp conversations", "b2b reddit strategy"],
    relatedSlugs: ["best-subreddits-for-saas-founders", "how-to-reply-reddit-without-getting-banned", "b2b-saas-reddit-playbook"],
    relatedSubreddits: ["entrepreneur", "SaaS", "startups", "sales"],
    relatedTopics: ["b2b-lead-generation", "saas-marketing"],
    content: [
      {
        type: "paragraph",
        text: "Your ideal customer is on Reddit right now. They're asking 'what CRM does your team use?', describing a workflow they're frustrated with, comparing two tools they've narrowed to, or announcing they're finally switching off a legacy product. Every one of these posts is a high-intent buying signal — if you know what to look for.",
      },
      {
        type: "heading",
        text: "The Six ICP Signal Types",
      },
      {
        type: "paragraph",
        text: "Not all Reddit threads are equal buying signals. The following six patterns represent the clearest intent signals for most B2B SaaS products. Each pattern has different implications for how you should respond.",
      },
      {
        type: "numbered",
        items: [
          "Tool-seeking — 'What do you use for X?' threads. Direct buying intent. The poster is actively evaluating. This is your highest-priority signal.",
          "Frustration — 'I'm so tired of [competitor/current tool]'. Active dissatisfaction with existing solution. High switching intent.",
          "Comparison — '[Product A] vs [Product B]' threads. Late-stage evaluation. Poster is close to buying one of the options mentioned.",
          "Decision-making — 'Should I use X or Y?', 'Is X worth it for my use case?'. Similar to comparison but more focused. Respond with specific criteria, not just 'use mine'.",
          "Problem-statement — 'We're struggling with X'. Early-stage awareness of problem, not yet evaluating tools. Long-term play — plant the seed.",
          "Advice-seeking — 'How do you handle X?' questions. The poster wants process advice; product recommendations should be secondary to the process answer.",
        ],
      },
      {
        type: "heading",
        text: "Reading Thread Quality Before You Reply",
      },
      {
        type: "paragraph",
        text: "Not every ICP signal thread is worth your time. A tool-seeking thread in a subreddit with 200 members isn't going to drive meaningful reach. Evaluate each thread on three dimensions: ICP match (is this your buyer?), thread quality (will Google index this?), and timing (how fresh is it?).",
      },
      {
        type: "paragraph",
        text: "For ICP match, scan the comment thread quickly. Are the people responding the same profile as your buyer? A thread in r/entrepreneur asking about CRM might attract freelancers, micro-agencies, and enterprise sales teams all at once — the responses will tell you who's actually active there. If the thread is dominated by your ICP, it's worth a reply even if the original poster isn't.",
      },
      {
        type: "heading",
        text: "Keywords That Signal Buying Intent",
      },
      {
        type: "list",
        items: [
          "'What does your team use for...' — active evaluation",
          "'Switched from X to...' — recent buying decision, validates alternatives",
          "'Looking for a tool that...' — specific requirements, close to purchase",
          "'Does anyone use X?' — early-stage awareness of a specific product",
          "'X vs Y' in the title — comparison, late-stage evaluation",
          "'Alternatives to X' — switching intent",
          "'Is X worth it?' — ROI evaluation, close to purchase",
          "'What's your stack for...' — tool stack conversations often surface multiple buying opportunities",
        ],
      },
      {
        type: "heading",
        text: "Subreddit Selection for ICP Targeting",
      },
      {
        type: "paragraph",
        text: "Different subreddits attract different ICPs even for the same broad category. r/entrepreneur skews solo founders and early-stage (<$500k ARR). r/startups skews venture-backed teams. r/SaaS skews SaaS-specific operators. r/sales skews revenue teams at established companies. Knowing where your specific ICP concentrates is more important than monitoring every relevant subreddit.",
      },
      {
        type: "paragraph",
        text: "Start by searching Reddit for the exact pain points your product solves — not product category searches, but pain searches. Where those pain conversations have the most engagement is where your ICP is most active. Monitor those communities first.",
      },
      {
        type: "heading",
        text: "The Timing Problem (and How to Solve It)",
      },
      {
        type: "paragraph",
        text: "The biggest challenge with manual Reddit monitoring is timing. ICP threads are most valuable in the first two hours — before competitors have replied, before the thread gets buried, and while Google is still actively crawling it. Checking Reddit manually once a day means you're almost always too late.",
      },
      {
        type: "callout",
        text: "Subredify runs hourly scans across your monitored subreddits, classifies each post against your ICP profile using Claude AI, and surfaces only the threads with both high ICP relevance and high Google rank potential — with a reply draft ready to deploy.",
      },
    ],
  },
  {
    slug: "how-to-reply-reddit-without-getting-banned",
    title: "How to Reply to Reddit Threads Without Getting Banned (2025 Guide)",
    description: "Subreddit rules aren't suggestions — violations get your account shadow-banned and your brand associated with spam. Here's the complete framework for compliant, effective Reddit replies.",
    publishedAt: "2025-02-05",
    readingTime: 9,
    category: "Reddit Marketing",
    tags: ["reddit marketing without getting banned", "subreddit rules", "reddit self-promotion", "reddit reply strategy"],
    relatedSlugs: ["subreddit-rules-decoded", "best-subreddits-for-saas-founders", "b2b-saas-reddit-playbook"],
    relatedSubreddits: ["entrepreneur", "marketing", "startups"],
    relatedTopics: ["saas-marketing", "content-marketing"],
    content: [
      {
        type: "paragraph",
        text: "Reddit has a spam detection system and an engaged community of moderators who are very good at identifying self-promotional replies. An account that gets flagged — or worse, shadow-banned — loses all the SEO value it was building. Before you reply to a single thread, you need to understand how subreddit rules work and what 'compliant' actually means.",
      },
      {
        type: "heading",
        text: "Why Subreddit Rules Matter More Than You Think",
      },
      {
        type: "paragraph",
        text: "Every subreddit has its own rules that exist independently of Reddit's platform-wide policies. r/entrepreneur has 12 rules. r/SaaS has 8. r/startups has 15. Each set of rules was written by that community's moderators and reflects what that community considers acceptable. Violating subreddit rules can result in post removal, temporary bans, or permanent bans — all of which damage not just your account but your brand's reputation in that community.",
      },
      {
        type: "paragraph",
        text: "The most consequential rules for SaaS marketers are self-promotion rules. These vary significantly between subreddits. r/entrepreneur explicitly allows product mentions when answering questions genuinely. r/webdev effectively prohibits any commercial promotion. r/SaaS sits in the middle — product mentions are tolerated when they're specific, relevant, and secondary to the actual answer.",
      },
      {
        type: "heading",
        text: "The Anatomy of a Compliant Reply",
      },
      {
        type: "paragraph",
        text: "A compliant reply has a specific structure. It leads with genuine value — specific process advice, a concrete recommendation, or a direct answer to the question. Any product mention comes as supporting evidence, not the point of the reply. The product mention is framed as a tool you personally use, not a product you're selling.",
      },
      {
        type: "numbered",
        items: [
          "Answer the question directly first — spend the first 2-3 sentences on the actual answer, with specific, actionable content.",
          "Add context or nuance — address edge cases or follow-up questions the poster hasn't thought to ask yet.",
          "Mention your product as a tool in context — 'We use [product] for this specifically because...' not 'Check out [product]!'",
          "No links in the first reply if rules prohibit it — mention the product name and let interested people search.",
          "Never add a CTA, promotional language, or discount codes — these are immediate red flags for moderators.",
        ],
      },
      {
        type: "heading",
        text: "Red Flags That Trigger Mod Review",
      },
      {
        type: "list",
        items: [
          "First reply on an account is promotional — new accounts that start with product pitches get banned immediately",
          "URL in reply on subreddits with link restrictions — always check if links are allowed",
          "Reply starts with the product name — leads with value, not with the brand",
          "Identical or near-identical replies across multiple threads — Reddit's spam filter catches this",
          "Marketing language in replies — 'powerful', 'industry-leading', 'game-changing' scream ad copy",
          "Replying without upvoting or engaging with other comments — pure extraction behavior is visible",
          "New account, no post history, immediately promotional — build karma and history first",
        ],
      },
      {
        type: "heading",
        text: "Reading and Applying Subreddit Rules",
      },
      {
        type: "paragraph",
        text: "Before you post in a new subreddit, read all its rules. Pay specific attention to: self-promotion policies (often in rule 1 or 2), link policies (some subreddits ban all links, others allow contextual ones), and disclosure requirements (some subreddits require you to disclose if you're affiliated with a product you mention).",
      },
      {
        type: "paragraph",
        text: "Self-promotion rules often have nuance that's easy to miss. 'No self-promotion' sometimes means 'no dedicated promotional posts' but still allows product mentions in comment threads. 'No affiliate links' might not restrict direct links. 'No commercial content' might only apply to top-level posts, not replies. Read the full rule text, not just the rule title.",
      },
      {
        type: "heading",
        text: "The Account Karma Strategy",
      },
      {
        type: "paragraph",
        text: "Reddit's spam detection factors in account age and karma. An account with 500 comment karma and 6 months of history is treated very differently from a brand-new account. Before using any account for product-mention replies, build genuine karma in the communities you plan to engage with — answer questions where you have no product to mention, participate in discussions, upvote quality content.",
      },
      {
        type: "callout",
        text: "Every reply draft Subredify generates is scored against the specific subreddit's rules before you see it. Safe, borderline, and avoid ratings are assigned automatically — you only see drafts that are compliant with community guidelines.",
      },
    ],
  },
  {
    slug: "reddit-dominates-google-serp",
    title: "Reddit's Domination of Google Search Results: The Data Behind the Trend",
    description: "Reddit appears in the top 10 Google results for millions of queries. This is what happened, why it's structural, and what it means for your brand's search strategy.",
    publishedAt: "2025-02-12",
    readingTime: 6,
    category: "SEO Research",
    tags: ["reddit google serp", "reddit seo 2025", "reddit google deal", "reddit search results"],
    relatedSlugs: ["why-reddit-threads-rank-on-google", "rank-opportunity-score-explained", "reply-early-rank-faster"],
    relatedSubreddits: ["SEO", "marketing", "technology"],
    relatedTopics: ["saas-marketing", "content-marketing"],
    content: [
      {
        type: "paragraph",
        text: "Between 2023 and 2024, Reddit's presence in Google's top 10 results increased by over 400% across a wide range of commercial and informational queries. This wasn't a coincidence — it was the visible result of a structural shift in how Google weights user-generated content, combined with a direct data partnership between Google and Reddit.",
      },
      {
        type: "heading",
        text: "The Google-Reddit Data Deal",
      },
      {
        type: "paragraph",
        text: "In February 2024, Google and Reddit announced a partnership that gave Google expanded access to Reddit's Data API for training AI models and improving search results. The financial terms were reported at approximately $60 million per year. This deal formalized what was already functionally true: Reddit's content is uniquely valuable to Google's search quality mission.",
      },
      {
        type: "paragraph",
        text: "The deal had an immediate visible effect. Within months of the announcement, SEO practitioners began documenting Reddit's dramatically increased presence across query types — not just the 'site:reddit.com' queries that had always ranked well, but competitive head terms where Reddit had been absent. Product comparison queries, tool recommendation queries, and 'best X for Y' queries that had previously been dominated by review sites were now showing Reddit threads in the top three.",
      },
      {
        type: "heading",
        text: "Why Google Trusts Reddit",
      },
      {
        type: "paragraph",
        text: "Reddit's value to Google isn't just the partnership — it's structural. Reddit threads contain what Google calls 'real people saying real things', which aligns with Google's stated goal of surfacing helpful, experience-based content. The E-E-A-T update (Experience, Expertise, Authoritativeness, Trustworthiness) explicitly elevated first-person experience content — exactly what Reddit provides at massive scale.",
      },
      {
        type: "list",
        items: [
          "Domain Authority 91 — Reddit is one of the most linked-to domains on the internet",
          "High engagement signals — comment counts, upvotes, and cross-links signal authentic engagement",
          "Real people with verifiable experience — Reddit enforces against bots more aggressively than most UGC platforms",
          "Long tail keyword coverage — millions of niche queries get answered nowhere else at scale",
          "Recency — Reddit threads are continuously updated, which Google rewards for fresh content signals",
          "Community moderation — quality threads rise and low-quality threads get downvoted, creating a content filtering layer",
        ],
      },
      {
        type: "heading",
        text: "The Queries Where Reddit Dominates",
      },
      {
        type: "paragraph",
        text: "Reddit's search dominance is concentrated in specific query types. Understanding which types rank most consistently helps you identify which threads to prioritize.",
      },
      {
        type: "paragraph",
        text: "Product recommendation queries ('best CRM for startups', 'recommended tools for X') see Reddit in the top 5 most frequently. Comparison queries ('Notion vs Coda', 'HubSpot vs Salesforce') are extremely well-represented. 'Alternatives to X' queries almost always include at least one Reddit thread in the top 3. Process and how-to queries where experiential knowledge matters also rank well, particularly in technical subreddits.",
      },
      {
        type: "heading",
        text: "What This Means for Your Brand",
      },
      {
        type: "paragraph",
        text: "If your category has active Reddit communities, there are almost certainly threads ranking for your most important keywords right now. Those threads are forming first impressions of your product for searchers at peak buying intent. If you're not present in those threads, your competitors might be — or worse, negative sentiment might be the only thing a searcher finds.",
      },
      {
        type: "callout",
        text: "Subredify checks whether threads are already indexed in Google SERPs as part of the Rank Opportunity Score — so you can prioritize threads that are already visible to searchers.",
      },
    ],
  },
  {
    slug: "rank-opportunity-score-explained",
    title: "How the Reddit Rank Opportunity Score Works",
    description: "Not every Reddit thread ends up on Google's first page. The Rank Opportunity Score predicts which threads will rank — before you spend time drafting a reply.",
    publishedAt: "2025-02-19",
    readingTime: 7,
    category: "Product",
    tags: ["rank opportunity score", "reddit post google ranking", "reddit seo scoring", "which reddit posts rank"],
    relatedSlugs: ["why-reddit-threads-rank-on-google", "reddit-dominates-google-serp", "reply-early-rank-faster"],
    relatedSubreddits: ["entrepreneur", "SaaS"],
    relatedTopics: ["saas-marketing", "startup-growth-hacking"],
    content: [
      {
        type: "paragraph",
        text: "Most Reddit monitoring tools tell you what's trending. Subredify tells you what's going to rank on Google. The Rank Opportunity Score is a 0-100 composite score calculated at the moment a thread is ingested — before any AI API calls, before you see the post. Here's exactly how it's computed and what each signal means.",
      },
      {
        type: "heading",
        text: "The Six Rank Signals",
      },
      {
        type: "paragraph",
        text: "The score is a weighted composite of six independent signals. Each signal is normalized to 0-100 before weighting. The final score reflects the probability that a given thread will appear in Google's top 10 results for at least one relevant query within 72 hours of posting.",
      },
      {
        type: "numbered",
        items: [
          "Subreddit Authority (25% weight) — Reddit's domain authority is shared, but individual subreddits have different effective authority based on subscriber count, engagement rate, and external link profiles. r/entrepreneur threads rank faster than r/sideproject threads — this signal captures that difference.",
          "Title Searchability (20% weight) — Question-format titles, superlative titles ('best X', 'X vs Y'), and titles that directly mirror commercial search queries score highest. A title that reads like a Google query is a title that will rank for that Google query.",
          "Comment Velocity (20% weight) — Comments per hour in the first 24 hours. High velocity signals authentic engagement to Google's crawler, which accelerates indexation. Threads with >10 comments/hour in the first day are flagged as crawl priority.",
          "Upvote Velocity (15% weight) — Upvotes per hour in the first 6 hours. Early upvote concentration predicts sustained engagement, which Google rewards. This signal decays quickly — a thread that accumulates 50 upvotes in hour one is scored differently than one that accumulates the same total over a week.",
          "Age Window (10% weight) — Threads posted 2-72 hours ago receive a 5% multiplier bonus. This is the window Google prioritizes for fresh content; outside this window, threads compete as established content (lower recency advantage).",
          "Existing SERP Presence (10% weight) — If a thread is already confirmed to appear in Google search results (checked via external search verification), it gets the maximum signal value. These threads have already proven their ranking potential — every reply gets guaranteed distribution.",
        ],
      },
      {
        type: "heading",
        text: "Score Tiers and What They Mean",
      },
      {
        type: "list",
        items: [
          "70-100: High — Thread is actively ranking or has strong signals for imminent ranking. Reply in the next 2-4 hours.",
          "45-69: Medium — Thread may rank with continued engagement. Worth monitoring; reply if ICP match is strong.",
          "0-44: Low — Thread unlikely to rank organically. Only worth engagement if ICP match is exceptional or you have specific off-platform reasons.",
        ],
      },
      {
        type: "heading",
        text: "Why It's Computed at Ingest (Not Later)",
      },
      {
        type: "paragraph",
        text: "The score is calculated the moment a thread is ingested — using pure CPU computation, no AI API calls. This approach has two advantages: it's instantaneous (scores appear alongside posts with no delay), and it's free to compute (scoring 10,000 posts costs zero API tokens).",
      },
      {
        type: "paragraph",
        text: "The score is computed at ingest because the signals that matter most are early signals. By the time a thread is 6 hours old, its rank destiny is largely determined. Acting before the window closes is the entire point — and you need scores the moment threads appear, not after a processing delay.",
      },
      {
        type: "heading",
        text: "Combined with ICP Scoring",
      },
      {
        type: "paragraph",
        text: "The Rank Opportunity Score answers 'will Google show this thread?' The ICP Score (computed separately via Claude Haiku) answers 'is this thread relevant to your buyers?' Both are required for a thread to be worth your time. A thread that ranks on Google but isn't ICP-relevant is distribution without targeting. A thread that's ICP-relevant but won't rank is effort without reach.",
      },
      {
        type: "callout",
        text: "The feed's 'High Google Rank' filter shows only threads with Rank Opportunity Score ≥ 70. The 'High Opportunity' badge appears when Rank ≥ 70 and ICP ≥ 60 — these are the threads where distribution and targeting converge.",
      },
    ],
  },
  {
    slug: "reply-early-rank-faster",
    title: "Reply Early, Rank Faster: The Reddit Comment Velocity Strategy",
    description: "The first three replies to a high-DA Reddit thread are worth more than most content marketing budgets. Here's the timing strategy that maximizes your SEO return from Reddit engagement.",
    publishedAt: "2025-02-26",
    readingTime: 6,
    category: "SEO Strategy",
    tags: ["reddit reply strategy", "reddit comment velocity", "reddit seo timing", "first mover reddit"],
    relatedSlugs: ["why-reddit-threads-rank-on-google", "rank-opportunity-score-explained", "how-to-reply-reddit-without-getting-banned"],
    relatedSubreddits: ["entrepreneur", "SaaS", "startups", "marketing"],
    relatedTopics: ["saas-marketing", "startup-growth-hacking"],
    content: [
      {
        type: "paragraph",
        text: "In traditional content marketing, you publish and then wait — sometimes months — for Google to index, rank, and serve your content to searchers. Reddit flips this timeline completely. A reply posted at 9am to a thread in r/entrepreneur can be ranking for a commercial query by 11am. But only if you post in the right window.",
      },
      {
        type: "heading",
        text: "The 48-Hour Ranking Window",
      },
      {
        type: "paragraph",
        text: "Google's crawler visits high-DA Reddit threads on an accelerated schedule. When a thread in r/entrepreneur or r/SaaS starts generating engagement, Googlebot typically indexes it within 1-4 hours. The thread then competes for rankings based on its signals at crawl time — which means early engagement shapes the indexed version of the thread.",
      },
      {
        type: "paragraph",
        text: "The window that matters most is the first 48 hours, and most critically, the first 12 hours. Threads that reach high comment velocity in the first 12 hours sustain engagement and continue ranking. Threads that start slow rarely catch up — Google's fresh content signals are weighted toward the initial crawl, and threads that are 3 days old compete as archival content, not fresh content.",
      },
      {
        type: "heading",
        text: "Why Position Matters Within a Thread",
      },
      {
        type: "paragraph",
        text: "When Google surfaces a Reddit thread in search results, it typically shows the post title plus 2-3 comments in the SERP preview. Those are the first replies that received upvotes — and they're usually the earliest substantive replies. Being in the first 3 replies, with a reply that earns upvotes, positions your answer as the one Google shows first.",
      },
      {
        type: "paragraph",
        text: "The compound effect is significant. Early replies receive more visibility, which generates more upvotes, which drives further upvotes (the upvote loop), which results in a top-of-thread position, which is what Google highlights. The early advantage self-reinforces. A reply posted 6 hours late that's objectively better than the top reply will still usually rank lower within the thread.",
      },
      {
        type: "heading",
        text: "Comment Velocity as a Crawl Signal",
      },
      {
        type: "paragraph",
        text: "Comment velocity (comments per hour) is one of the signals Googlebot uses to determine crawl priority. A thread that's generating 15 comments/hour gets recrawled more frequently than one generating 2 comments/hour. Each recrawl updates the indexed version of the thread, which means your reply that was posted in hour three might get indexed in Google on the hour-eight crawl.",
      },
      {
        type: "list",
        items: [
          "0-2 hours: Optimal reply window — thread is fresh, fewer competitors, Google crawler arriving soon",
          "2-12 hours: Strong window — thread is indexed but not yet saturated, comment velocity still active",
          "12-48 hours: Declining returns — established replies have upvote advantages, but high-rank threads are still worth engaging",
          "48-72 hours: Marginal — thread is becoming archival, upvote advantages are locked in",
          "72+ hours: Low ROI — unless the thread is already confirmed ranking, late replies rarely capture the SEO benefit",
        ],
      },
      {
        type: "heading",
        text: "The Attention Bottleneck",
      },
      {
        type: "paragraph",
        text: "The constraint isn't knowing that early replies matter. The constraint is monitoring dozens of subreddits in real time, distinguishing high-rank threads from noise, and drafting compliant replies before the window closes — all while running a company. Manual monitoring fails here because the volume of threads across relevant subreddits is too high to triage effectively at the speed required.",
      },
      {
        type: "callout",
        text: "Subredify's hourly scans surface high-rank threads the moment they appear. Reply drafts are generated in under 30 seconds. The window is short — the workflow is designed to fit inside it.",
      },
    ],
  },
  {
    slug: "b2b-saas-reddit-playbook",
    title: "The B2B SaaS Reddit Playbook: Get Customers Without Getting Banned",
    description: "A complete playbook for B2B SaaS companies using Reddit as a distribution channel — account strategy, subreddit selection, reply frameworks, and measurement.",
    publishedAt: "2025-03-05",
    readingTime: 12,
    category: "Reddit Marketing",
    tags: ["b2b saas reddit marketing", "reddit for b2b companies", "reddit lead generation b2b", "reddit marketing playbook"],
    relatedSlugs: ["find-icp-on-reddit", "how-to-reply-reddit-without-getting-banned", "best-subreddits-for-saas-founders"],
    relatedSubreddits: ["entrepreneur", "SaaS", "startups", "sales", "marketing"],
    relatedTopics: ["b2b-lead-generation", "saas-marketing", "startup-growth-hacking"],
    content: [
      {
        type: "paragraph",
        text: "Reddit is the most underutilized B2B distribution channel that exists. While every SaaS company has a LinkedIn strategy and a content marketing calendar, most are leaving a category of high-intent buyer conversations completely unaddressed on Reddit. This playbook covers everything from account setup to measurement.",
      },
      {
        type: "heading",
        text: "The Reddit Advantage for B2B SaaS",
      },
      {
        type: "paragraph",
        text: "B2B buyers on Reddit are different from B2B buyers on LinkedIn. On LinkedIn, they're in professional mode — their guard is up, they know they're being marketed to, and they're skeptical of every piece of 'content'. On Reddit, they're asking genuine questions and sharing genuine frustrations. They're explicitly asking for tool recommendations. They're complaining about their current software. This is the most direct access to buying intent that exists outside of a sales call.",
      },
      {
        type: "paragraph",
        text: "The distribution advantage is the Google angle. A well-placed reply doesn't just reach the thread's audience — it reaches everyone who searches for that question over the next 12 months. A single reply to a ranking thread in r/entrepreneur can generate thousands of impressions from searchers at exactly the moment they're evaluating tools in your category.",
      },
      {
        type: "heading",
        text: "Phase 1: Account Setup and Karma Building",
      },
      {
        type: "paragraph",
        text: "Never start with promotional replies. Reddit's algorithms and community moderators are sophisticated enough to identify and penalize accounts that appear for the first time to promote a product. Before any product-adjacent engagement, build an account with genuine community karma.",
      },
      {
        type: "numbered",
        items: [
          "Create a personal account (not a brand account) — personal accounts are less scrutinized and more credible",
          "Spend the first 2-4 weeks answering questions in your area of expertise where you have no product to promote",
          "Aim for 200+ comment karma before your first product mention",
          "Engage in subreddits tangentially related to your target communities first",
          "Upvote and engage regularly — pure extractors are visible",
        ],
      },
      {
        type: "heading",
        text: "Phase 2: Subreddit Research and Monitoring",
      },
      {
        type: "paragraph",
        text: "Identify your primary and secondary subreddits based on ICP concentration and domain authority. Primary subreddits are where your ICP actively discusses problems your product solves. Secondary subreddits are adjacent communities where your ICP is present but product conversations are less central.",
      },
      {
        type: "paragraph",
        text: "For each target subreddit, read and document the rules before posting anything. Understand the self-promotion policy, link policy, disclosure requirements, and what types of replies have historically been well-received versus removed. Some subreddits have wikis with explicit guidance for marketers — always read these.",
      },
      {
        type: "heading",
        text: "Phase 3: Thread Identification and Prioritization",
      },
      {
        type: "paragraph",
        text: "Not all ICP threads are worth your time. Prioritize threads that combine ICP relevance with Google rank potential. A tool-seeking thread in r/entrepreneur that's less than 6 hours old with 15+ comments is worth immediate attention. A similar thread in a low-DA subreddit with 3 comments is a low-priority target.",
      },
      {
        type: "paragraph",
        text: "Your prioritization criteria: thread age (prefer under 6 hours), subreddit DA (prefer 80+), thread type (prefer tool-seeking and comparison over general advice), and ICP specificity (prefer threads from your exact buyer profile over adjacent profiles).",
      },
      {
        type: "heading",
        text: "Phase 4: Reply Drafting and Compliance",
      },
      {
        type: "paragraph",
        text: "Each reply needs to pass three filters before posting: value filter (does this genuinely help the person asking?), compliance filter (does this comply with subreddit rules?), and attribution filter (is your product mention contextual and appropriate?). All three need to pass.",
      },
      {
        type: "paragraph",
        text: "The structure that works consistently: lead with the direct answer (2-3 sentences of actual value), add nuance or caveats that demonstrate genuine expertise, then contextualize your product mention as a specific use case rather than a recommendation. 'We built [product] specifically because we hit this exact problem — happy to share more if helpful' outperforms 'check out [product]' in every measurable way.",
      },
      {
        type: "heading",
        text: "Phase 5: Measurement",
      },
      {
        type: "list",
        items: [
          "Direct attribution — track users who come from Reddit via UTM parameters on your product URL",
          "Brand mention monitoring — track brand mentions that originate from Reddit threads",
          "SERP presence — track which queries now show your Reddit replies in the top 10",
          "Upvote accumulation — high-upvote replies compound over time as thread continues to rank",
          "Referral traffic — segment Reddit referral traffic in analytics, track quality vs other sources",
        ],
      },
      {
        type: "callout",
        text: "Subredify automates Phase 2, 3, and 4: continuous subreddit monitoring, thread scoring, and compliance-checked draft generation — so you focus exclusively on posting and measuring.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string): BlogPost[] {
  const post = getPost(slug);
  if (!post) return [];
  return BLOG_POSTS.filter(
    (p) => p.slug !== slug && post.relatedSlugs.includes(p.slug)
  ).slice(0, 3);
}
