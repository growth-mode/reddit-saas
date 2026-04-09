-- Per-user post inbox status: New / Saved / Bin
-- Posts default to 'new' (no row = new). Row is created on first status change.

CREATE TABLE post_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'saved', 'bin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own post interactions"
  ON post_interactions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
