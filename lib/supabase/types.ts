export type Plan = "free" | "starter" | "growth" | "pro";
export type RiskScore = "safe" | "borderline" | "avoid" | "unknown";
export type DraftStatus = "pending" | "approved" | "rejected" | "posted";

export interface Database {
  PostgrestVersion: "12";
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          plan: Plan;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          plan?: Plan;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          plan?: Plan;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_configs: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          product_description: string;
          product_url: string | null;
          icp_description: string;
          keywords: string[];
          pain_points: string[];
          competitor_names: string[];
          reply_persona: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_name?: string;
          product_description?: string;
          product_url?: string | null;
          icp_description?: string;
          keywords?: string[];
          pain_points?: string[];
          competitor_names?: string[];
          reply_persona?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_name?: string;
          product_description?: string;
          product_url?: string | null;
          icp_description?: string;
          keywords?: string[];
          pain_points?: string[];
          competitor_names?: string[];
          reply_persona?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_configs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      subreddits: {
        Row: {
          id: string;
          name: string;
          display_name: string | null;
          description: string | null;
          subscriber_count: number | null;
          rules_raw: Record<string, unknown> | null;
          rules_parsed: string | null;
          rules_structured: ParsedRule[] | null;
          sidebar_text: string | null;
          wiki_content: string | null;
          rules_fetched_at: string | null;
          rules_refresh_interval_hours: number;
          scan_enabled: boolean;
          last_scanned_at: string | null;
          newest_post_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_name?: string | null;
          description?: string | null;
          subscriber_count?: number | null;
          rules_raw?: Record<string, unknown> | null;
          rules_parsed?: string | null;
          rules_structured?: ParsedRule[] | null;
          sidebar_text?: string | null;
          wiki_content?: string | null;
          rules_fetched_at?: string | null;
          rules_refresh_interval_hours?: number;
          scan_enabled?: boolean;
          last_scanned_at?: string | null;
          newest_post_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          display_name?: string | null;
          description?: string | null;
          subscriber_count?: number | null;
          rules_raw?: Record<string, unknown> | null;
          rules_parsed?: string | null;
          rules_structured?: ParsedRule[] | null;
          sidebar_text?: string | null;
          wiki_content?: string | null;
          rules_fetched_at?: string | null;
          rules_refresh_interval_hours?: number;
          scan_enabled?: boolean;
          last_scanned_at?: string | null;
          newest_post_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_subreddits: {
        Row: {
          id: string;
          user_id: string;
          subreddit_id: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subreddit_id: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_subreddits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_subreddits_subreddit_id_fkey";
            columns: ["subreddit_id"];
            isOneToOne: false;
            referencedRelation: "subreddits";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          subreddit_id: string;
          reddit_id: string;
          reddit_url: string;
          title: string;
          body: string;
          author: string | null;
          score: number;
          num_comments: number;
          flair: string | null;
          created_utc: string;
          top_comments: RedditComment[];
          rank_opportunity_score: number | null;
          rank_signals: Record<string, unknown> | null;
          rank_scored_at: string | null;
          icp_score: number | null;
          icp_signals: string[];
          icp_summary: string | null;
          icp_classified_at: string | null;
          ingested_at: string;
        };
        Insert: {
          id?: string;
          subreddit_id: string;
          reddit_id: string;
          reddit_url: string;
          title: string;
          body?: string;
          author?: string | null;
          score?: number;
          num_comments?: number;
          flair?: string | null;
          created_utc: string;
          top_comments?: RedditComment[];
          icp_score?: number | null;
          icp_signals?: string[];
          icp_summary?: string | null;
          icp_classified_at?: string | null;
          rank_opportunity_score?: number | null;
          rank_signals?: Record<string, unknown> | null;
          rank_scored_at?: string | null;
          ingested_at?: string;
        };
        Update: {
          score?: number;
          num_comments?: number;
          top_comments?: RedditComment[];
          icp_score?: number | null;
          icp_signals?: string[];
          icp_summary?: string | null;
          rank_opportunity_score?: number | null;
          rank_signals?: Record<string, unknown> | null;
          rank_scored_at?: string | null;
          icp_classified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_subreddit_id_fkey";
            columns: ["subreddit_id"];
            isOneToOne: false;
            referencedRelation: "subreddits";
            referencedColumns: ["id"];
          }
        ];
      };
      reply_drafts: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          draft_text: string;
          edited_text: string | null;
          risk_score: RiskScore;
          risk_reasons: string[];
          risk_detail: string | null;
          model_used: string;
          generation_prompt: string | null;
          status: DraftStatus;
          generated_at: string;
          posted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          draft_text: string;
          edited_text?: string | null;
          risk_score?: RiskScore;
          risk_reasons?: string[];
          risk_detail?: string | null;
          model_used?: string;
          generation_prompt?: string | null;
          status?: DraftStatus;
          generated_at?: string;
          posted_at?: string | null;
        };
        Update: {
          edited_text?: string | null;
          risk_score?: RiskScore;
          risk_reasons?: string[];
          risk_detail?: string | null;
          status?: DraftStatus;
          posted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reply_drafts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reply_drafts_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      icp_signals: {
        Row: {
          id: string;
          user_id: string | null;
          signal_key: string;
          signal_label: string;
          signal_description: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          signal_key: string;
          signal_label: string;
          signal_description: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          is_active?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Shared types
export interface ParsedRule {
  title: string;
  description: string;
  violationReason: string;
  isSelfPromotionRule: boolean;
  isEngagementRule: boolean;
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
}

// Row convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserConfig = Database["public"]["Tables"]["user_configs"]["Row"];
export type Subreddit = Database["public"]["Tables"]["subreddits"]["Row"];
export type UserSubreddit = Database["public"]["Tables"]["user_subreddits"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type ReplyDraft = Database["public"]["Tables"]["reply_drafts"]["Row"];
export type IcpSignal = Database["public"]["Tables"]["icp_signals"]["Row"];
