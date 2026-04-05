"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { UserConfig } from "@/lib/supabase/types";

interface Props {
  config: UserConfig | null;
  userId: string;
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

export function SettingsClient({ config, userId }: Props) {
  const [form, setForm] = useState({
    product_name: config?.product_name ?? "",
    product_description: config?.product_description ?? "",
    product_url: config?.product_url ?? "",
    icp_description: config?.icp_description ?? "",
    keywords: config?.keywords ?? [],
    pain_points: config?.pain_points ?? [],
    competitor_names: config?.competitor_names ?? [],
    reply_persona: config?.reply_persona ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const sb = createClient();
    const { error } = await sb
      .from("user_configs")
      .upsert({ ...form, user_id: userId, updated_at: new Date().toISOString() });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Settings saved");
    }
    setSaving(false);
  }

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-4 border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold">Product</h2>
        <div className="space-y-1.5">
          <Label htmlFor="product_name">Product name</Label>
          <Input
            id="product_name"
            value={form.product_name}
            onChange={(e) => set("product_name", e.target.value)}
            placeholder="Acme CRM"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="product_description">What it does (1-2 sentences)</Label>
          <Textarea
            id="product_description"
            value={form.product_description}
            onChange={(e) => set("product_description", e.target.value)}
            placeholder="Acme CRM helps B2B sales teams track leads and automate follow-ups."
            rows={3}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="product_url">Product URL (optional)</Label>
          <Input
            id="product_url"
            value={form.product_url}
            onChange={(e) => set("product_url", e.target.value)}
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
            onChange={(e) => set("icp_description", e.target.value)}
            placeholder="Founders and heads of sales at B2B SaaS companies with 10-100 employees who are struggling to manage outbound."
            rows={3}
          />
        </div>
        <TagInput
          label="Keywords to watch"
          value={form.keywords}
          onChange={(v) => set("keywords", v)}
          placeholder="CRM, sales automation, outbound..."
        />
        <TagInput
          label="Pain points your product solves"
          value={form.pain_points}
          onChange={(v) => set("pain_points", v)}
          placeholder="manual follow-ups, lost leads, no pipeline visibility..."
        />
        <TagInput
          label="Competitor names"
          value={form.competitor_names}
          onChange={(v) => set("competitor_names", v)}
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
            onChange={(e) => set("reply_persona", e.target.value)}
            placeholder="Practical, direct, and helpful. Occasionally mention your tool when genuinely relevant. Never salesy."
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
