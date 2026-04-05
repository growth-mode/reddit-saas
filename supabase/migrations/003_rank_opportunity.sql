-- Add rank opportunity scoring to posts
alter table public.posts
  add column if not exists rank_opportunity_score integer,
  add column if not exists rank_signals jsonb not null default '{}'::jsonb,
  add column if not exists rank_scored_at timestamptz;

-- Index for sorting by rank opportunity
create index if not exists posts_rank_opportunity_score_idx
  on public.posts (rank_opportunity_score desc);

-- Composite index: high ICP + high rank = best targets
create index if not exists posts_icp_rank_idx
  on public.posts (icp_score desc, rank_opportunity_score desc)
  where icp_score >= 40;

-- Subreddit SEO authority scores (pre-built, updated monthly)
create table if not exists public.subreddit_seo_authority (
  subreddit_name text primary key,
  domain_authority integer not null default 50,
  google_index_rate numeric not null default 0.5,
  monthly_google_impressions integer,
  notes text,
  updated_at timestamptz not null default now()
);

-- Seed well-known subreddit authority scores
insert into public.subreddit_seo_authority
  (subreddit_name, domain_authority, google_index_rate, monthly_google_impressions, notes)
values
  ('entrepreneur',    85, 0.82, 2400000, 'Very high DA, questions rank well'),
  ('SaaS',            78, 0.75, 890000,  'Strong tech indexation'),
  ('startups',        80, 0.78, 1200000, 'High DA, competitive'),
  ('smallbusiness',   72, 0.65, 750000,  'Moderate authority'),
  ('marketing',       75, 0.70, 980000,  'Good for B2B/tools queries'),
  ('sales',           70, 0.62, 540000,  'Decent authority'),
  ('productivity',    73, 0.68, 620000,  'Questions index well'),
  ('freelance',       68, 0.60, 410000,  'Growing authority'),
  ('webdev',          82, 0.79, 1100000, 'High DA dev community'),
  ('learnprogramming',76, 0.71, 830000,  'Tutorial content indexes well'),
  ('aws',             79, 0.74, 670000,  'Technical — very indexable'),
  ('devops',          74, 0.69, 490000,  'Niche but high authority'),
  ('cscareerquestions',77, 0.72, 910000, 'Career questions rank heavily'),
  ('programming',     83, 0.80, 1400000, 'Top dev subreddit'),
  ('business',        74, 0.68, 690000,  'General business queries')
on conflict (subreddit_name) do nothing;

-- RLS: anyone authenticated can read authority scores
alter table public.subreddit_seo_authority enable row level security;
create policy "Authenticated users can read subreddit authority" on public.subreddit_seo_authority
  for select using (auth.role() = 'authenticated');
create policy "Service role manages authority" on public.subreddit_seo_authority
  for all using (auth.role() = 'service_role');
