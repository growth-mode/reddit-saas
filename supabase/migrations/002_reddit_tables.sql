-- Subreddits (shared across all users — one record per unique subreddit)
create table public.subreddits (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  display_name text,
  description text,
  subscriber_count integer,
  rules_raw jsonb,
  rules_parsed text,
  rules_structured jsonb,
  sidebar_text text,
  wiki_content text,
  rules_fetched_at timestamptz,
  rules_refresh_interval_hours integer not null default 168,
  scan_enabled boolean not null default true,
  last_scanned_at timestamptz,
  newest_post_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Junction: user monitors subreddit
create table public.user_subreddits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subreddit_id uuid not null references public.subreddits(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, subreddit_id)
);

-- Posts ingested from Reddit
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  subreddit_id uuid not null references public.subreddits(id) on delete cascade,
  reddit_id text not null unique,
  reddit_url text not null,
  title text not null,
  body text not null default '',
  author text,
  score integer not null default 0,
  num_comments integer not null default 0,
  flair text,
  created_utc timestamptz not null,
  top_comments jsonb not null default '[]'::jsonb,
  icp_score integer,
  icp_signals text[] not null default array[]::text[],
  icp_summary text,
  icp_classified_at timestamptz,
  ingested_at timestamptz not null default now()
);

-- Reply drafts
create table public.reply_drafts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  draft_text text not null,
  edited_text text,
  risk_score text not null default 'unknown' check (risk_score in ('safe', 'borderline', 'avoid', 'unknown')),
  risk_reasons text[] not null default array[]::text[],
  risk_detail text,
  model_used text not null default 'claude-sonnet-4-5-20251001',
  generation_prompt text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'posted')),
  generated_at timestamptz not null default now(),
  posted_at timestamptz
);

-- ICP signal definitions
create table public.icp_signals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  signal_key text not null,
  signal_label text not null,
  signal_description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, signal_key)
);

-- Seed global ICP signal definitions
insert into public.icp_signals (user_id, signal_key, signal_label, signal_description) values
  (null, 'tool_seeking',      'Seeking a tool',             'Post explicitly asks for tool, software, or service recommendations'),
  (null, 'frustration',       'Expressing frustration',     'Post describes pain with current workflow, tool, or process'),
  (null, 'comparison',        'Comparing alternatives',     'Post asks for comparison between tools or approaches'),
  (null, 'decision_making',   'Making a purchase decision', 'Post indicates they are about to choose or buy something'),
  (null, 'problem_statement', 'Describing a problem',       'Post describes a specific problem your product could solve'),
  (null, 'advice_seeking',    'Seeking expert advice',      'Post asks for advice from practitioners in your space');

-- Indexes
create index on public.user_subreddits (user_id, active);
create index on public.posts (subreddit_id, icp_score desc);
create index on public.posts (reddit_id);
create index on public.posts (subreddit_id, created_utc desc);
create index on public.posts (icp_classified_at) where icp_classified_at is null;
create index on public.reply_drafts (user_id, status);
create index on public.reply_drafts (post_id);

-- RLS
alter table public.subreddits enable row level security;
alter table public.user_subreddits enable row level security;
alter table public.posts enable row level security;
alter table public.reply_drafts enable row level security;
alter table public.icp_signals enable row level security;

-- Subreddits: authenticated users read, service role writes
create policy "Authenticated users can read subreddits" on public.subreddits
  for select using (auth.role() = 'authenticated');
create policy "Service role manages subreddits" on public.subreddits
  for all using (auth.role() = 'service_role');

-- User subreddits
create policy "Users manage own subreddit monitoring" on public.user_subreddits
  for all using (auth.uid() = user_id);

-- Posts: users read posts from their monitored subreddits
create policy "Users can read posts from monitored subreddits" on public.posts
  for select using (
    exists (
      select 1 from public.user_subreddits us
      where us.subreddit_id = posts.subreddit_id
        and us.user_id = auth.uid()
        and us.active = true
    )
  );
create policy "Service role manages posts" on public.posts
  for all using (auth.role() = 'service_role');

-- Drafts
create policy "Users manage own drafts" on public.reply_drafts
  for all using (auth.uid() = user_id);

-- ICP signals
create policy "Users can read icp signals" on public.icp_signals
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users manage own icp signals" on public.icp_signals
  for all using (auth.uid() = user_id);
