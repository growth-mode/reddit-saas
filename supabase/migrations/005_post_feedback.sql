-- Per-user thumbs-up / thumbs-down on posts. The signal feeds back into the
-- ICP classifier as few-shot examples so the ranker personalizes to each
-- user's actual judgment rather than a generic prompt.
--
-- NOTE: this migration is idempotent — it also creates the post_interactions
-- table if it's missing, because the original 004_post_interactions.sql was
-- never applied to the prod database (the prod 004 was a different migration).
-- Treating the creation as a belt-and-braces safety net so any environment
-- ending up here ends up with the right schema regardless of history.

CREATE TABLE IF NOT EXISTS post_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'saved', 'bin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'post_interactions'
      AND policyname = 'Users manage own post interactions'
  ) THEN
    CREATE POLICY "Users manage own post interactions"
      ON post_interactions FOR ALL TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

ALTER TABLE post_interactions
  ADD COLUMN IF NOT EXISTS feedback text
  CHECK (feedback IS NULL OR feedback IN ('up', 'down'));

-- Index so the few-shot fetch (`SELECT … WHERE user_id = $1 AND feedback IS NOT NULL`)
-- doesn't full-scan the table once interactions grow.
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_feedback
  ON post_interactions (user_id, feedback)
  WHERE feedback IS NOT NULL;
