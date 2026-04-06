"use client";

import { useState } from "react";

export interface AdminRow {
  id: string;
  email: string;
  signedUpAt: string;
  plan: string;
  subredditCount: number;
  draftCount: number;
  postInFeedCount: number;
  lastActive: string | null;
}

export function AdminTable({ initialRows }: { initialRows: AdminRow[] }) {
  const [rows, setRows] = useState<AdminRow[]>(initialRows);

  async function handleDelete(row: AdminRow) {
    if (!window.confirm(`Delete user ${row.email} and all their data?`)) return;
    const res = await fetch("/api/admin/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: row.id }),
    });
    if (res.ok) {
      setRows(prev => prev.filter(r => r.id !== row.id));
    } else {
      const body = await res.json().catch(() => ({}));
      alert(`Failed to delete: ${body.error ?? res.statusText}`);
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Email</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Plan</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Subreddits</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Drafts</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Posts in feed</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Last active</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Signed up</th>
            <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(r => (
            <tr key={r.id} className="hover:bg-muted/20">
              <td className="px-4 py-3 font-mono text-xs">{r.email}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  r.plan === "pro" ? "bg-primary/10 text-primary" :
                  r.plan === "growth" ? "bg-emerald-50 text-emerald-700" :
                  r.plan === "starter" ? "bg-blue-50 text-blue-700" :
                  "bg-muted text-muted-foreground"
                }`}>{r.plan === "pro" ? "Pro Agency" : r.plan}</span>
              </td>
              <td className="px-4 py-3 tabular-nums text-xs">{r.subredditCount}</td>
              <td className="px-4 py-3 tabular-nums text-xs">{r.draftCount}</td>
              <td className="px-4 py-3 tabular-nums text-xs">{r.postInFeedCount}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {r.lastActive
                  ? new Date(r.lastActive).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {new Date(r.signedUpAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(r)}
                  className="text-xs text-red-600 hover:text-red-800 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
