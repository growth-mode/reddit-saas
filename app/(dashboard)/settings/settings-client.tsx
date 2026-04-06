"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Wand2 } from "lucide-react";
import type { UserConfig, ClientProfile } from "@/lib/supabase/types";
import type { Plan } from "@/lib/supabase/types";

interface Props {
  config: UserConfig | null;
  userId: string;
  clientProfiles: ClientProfile[];
  plan: Plan;
}

function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(); }
          }}
          className="text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[11px] bg-muted border border-border rounded px-2 py-0.5"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="text-muted-foreground hover:text-destructive ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type FormState = {
  name: string;
  product_name: string;
  product_description: string;
  product_url: string;
  icp_description: string;
  keywords: string[];
  pain_points: string[];
  competitor_names: string[];
  reply_persona: string;
};

function profileToForm(p: ClientProfile): FormState {
  return {
    name: p.name,
    product_name: p.product_name,
    product_description: p.product_description,
    product_url: p.product_url ?? "",
    icp_description: p.icp_description,
    keywords: p.keywords,
    pain_points: p.pain_points,
    competitor_names: p.competitor_names,
    reply_persona: p.reply_persona,
  };
}

export function SettingsClient({ config, userId, clientProfiles: initialProfiles, plan }: Props) {
  const isPro = plan === "pro";
  const router = useRouter();

  const [profiles, setProfiles] = useState<ClientProfile[]>(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(
    initialProfiles[0]?.id ?? null
  );
  const [forms, setForms] = useState<Record<string, FormState>>(
    Object.fromEntries(initialProfiles.map(p => [p.id, profileToForm(p)]))
  );
  const [saving, setSaving] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const form = activeProfileId ? (forms[activeProfileId] ?? null) : null;
  const isFirstProfile = profiles[0]?.id === activeProfileId;

  function setField(key: keyof FormState, value: unknown) {
    if (!activeProfileId) return;
    setForms(f => ({
      ...f,
      [activeProfileId]: { ...f[activeProfileId], [key]: value },
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!activeProfileId || !form) return;
    setSaving(true);
    const sb = createClient();
    const now = new Date().toISOString();

    // Save to client_profiles
    const { error: cpError } = await sb
      .from("client_profiles")
      .update({
        name: form.name,
        product_name: form.product_name,
        product_description: form.product_description,
        product_url: form.product_url || null,
        icp_description: form.icp_description,
        keywords: form.keywords,
        pain_points: form.pain_points,
        competitor_names: form.competitor_names,
        reply_persona: form.reply_persona,
        updated_at: now,
      })
      .eq("id", activeProfileId);

    if (cpError) {
      toast.error(cpError.message);
      setSaving(false);
      return;
    }

    // Sync first profile back to user_configs for ICP classifier backward compat
    if (isFirstProfile) {
      await sb.from("user_configs").update({
        product_name: form.product_name,
        product_description: form.product_description,
        product_url: form.product_url || null,
        icp_description: form.icp_description,
        keywords: form.keywords,
        pain_points: form.pain_points,
        competitor_names: form.competitor_names,
        reply_persona: form.reply_persona,
        updated_at: now,
      }).eq("user_id", userId);
    }

    // Update local profile name if changed
    setProfiles(prev => prev.map(p =>
      p.id === activeProfileId ? { ...p, name: form.name } : p
    ));

    toast.success("Settings saved");
    setSaving(false);
  }

  async function handleNewProfile() {
    if (!isPro) return;
    setCreatingNew(true);
    const sb = createClient();
    const { data, error } = await sb
      .from("client_profiles")
      .insert({ user_id: userId, name: "New Profile" })
      .select()
      .single();

    if (error || !data) {
      toast.error(error?.message ?? "Failed to create profile");
      setCreatingNew(false);
      return;
    }

    setProfiles(prev => [...prev, data]);
    setForms(f => ({ ...f, [data.id]: profileToForm(data) }));
    setActiveProfileId(data.id);
    setCreatingNew(false);
    toast.success("New profile created");
  }

  async function handleDeleteProfile(profileId: string) {
    if (!isPro || isFirstProfile) return;
    setDeletingId(profileId);
    const sb = createClient();
    const { error } = await sb
      .from("client_profiles")
      .delete()
      .eq("id", profileId);

    if (error) {
      toast.error(error.message);
      setDeletingId(null);
      return;
    }

    const remaining = profiles.filter(p => p.id !== profileId);
    setProfiles(remaining);
    setForms(f => {
      const next = { ...f };
      delete next[profileId];
      return next;
    });
    setActiveProfileId(remaining[0]?.id ?? null);
    setDeletingId(null);
    toast.success("Profile deleted");
  }

  if (!form) {
    return (
      <div className="text-sm text-muted-foreground">
        No profile found. Please refresh the page.
      </div>
    );
  }

  const showTabs = profiles.length > 1 || isPro;

  return (
    <div className="space-y-6">
      {/* Profile tabs */}
      {showTabs && (
        <div className="flex items-center gap-2 flex-wrap">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfileId(p.id)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                p.id === activeProfileId
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p.name}
            </button>
          ))}
          {isPro && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewProfile}
              disabled={creatingNew}
              className="text-xs h-7"
            >
              <Plus className="h-3 w-3 mr-1" />
              {creatingNew ? "Creating..." : "New profile"}
            </Button>
          )}
        </div>
      )}

      {/* Re-run wizard */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <p className="text-sm font-medium">ICP setup wizard</p>
          <p className="text-xs text-muted-foreground mt-0.5">Scan a website to auto-fill your ICP and discover new subreddits</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push("/onboarding")}
        >
          <Wand2 className="h-3.5 w-3.5 mr-1.5" />
          Re-run wizard
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile name */}
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="profile_name">Profile name</Label>
            <Input
              id="profile_name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="My Company"
            />
          </div>
          {isPro && !isFirstProfile && activeProfileId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteProfile(activeProfileId)}
              disabled={deletingId === activeProfileId}
              className="text-muted-foreground hover:text-destructive mb-0.5"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {deletingId === activeProfileId ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>

        <div className="space-y-4 border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold">Product</h2>
          <div className="space-y-1.5">
            <Label htmlFor="product_name">Product name</Label>
            <Input
              id="product_name"
              value={form.product_name}
              onChange={(e) => setField("product_name", e.target.value)}
              placeholder="Acme CRM"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="product_description">What it does (1-2 sentences)</Label>
            <Textarea
              id="product_description"
              value={form.product_description}
              onChange={(e) => setField("product_description", e.target.value)}
              placeholder="Acme CRM helps B2B sales teams track leads and automate follow-ups."
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="product_url">Product URL (optional)</Label>
            <Input
              id="product_url"
              value={form.product_url}
              onChange={(e) => setField("product_url", e.target.value)}
              placeholder="https://yourproduct.com"
            />
          </div>
        </div>

        <div className="space-y-4 border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold">Target Customer (ICP)</h2>
          <div className="space-y-1.5">
            <Label htmlFor="icp_description">ICP description</Label>
            <Textarea
              id="icp_description"
              value={form.icp_description}
              onChange={(e) => setField("icp_description", e.target.value)}
              placeholder="Founders and heads of sales at B2B SaaS companies with 10-100 employees who are struggling to manage outbound."
              rows={3}
            />
          </div>
          <TagInput
            label="Keywords to watch"
            value={form.keywords}
            onChange={(v) => setField("keywords", v)}
            placeholder="CRM, sales automation, outbound..."
          />
          <TagInput
            label="Pain points your product solves"
            value={form.pain_points}
            onChange={(v) => setField("pain_points", v)}
            placeholder="manual follow-ups, lost leads, no pipeline visibility..."
          />
          <TagInput
            label="Competitor names"
            value={form.competitor_names}
            onChange={(v) => setField("competitor_names", v)}
            placeholder="Salesforce, HubSpot, Pipedrive..."
          />
        </div>

        <div className="space-y-4 border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold">Reply Persona</h2>
          <div className="space-y-1.5">
            <Label htmlFor="reply_persona">How should you come across? (optional)</Label>
            <Textarea
              id="reply_persona"
              value={form.reply_persona}
              onChange={(e) => setField("reply_persona", e.target.value)}
              placeholder="Practical, direct, and helpful. Occasionally mention your tool when genuinely relevant. Never salesy."
              rows={3}
            />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
