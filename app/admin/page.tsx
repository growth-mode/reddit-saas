import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();

  // Check admin
  const { data: profile } = await service.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/feed");

  // Get all users with stats
  const { data: { users: authUsers } } = await service.auth.admin.listUsers();

  const { data: profiles } = await service.from("profiles").select("id, plan, is_admin, created_at");
  const { data: userSubCounts } = await service.from("user_subreddits").select("user_id");
  const { data: draftCounts } = await service.from("reply_drafts").select("user_id, generated_at");
  const { data: postCounts } = await service.from("posts").select("ingested_at");

  // Build per-user stats
  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));
  const subCountMap = new Map<string, number>();
  (userSubCounts ?? []).forEach(s => subCountMap.set(s.user_id, (subCountMap.get(s.user_id) ?? 0) + 1));
  const draftCountMap = new Map<string, number>();
  (draftCounts ?? []).forEach(d => draftCountMap.set(d.user_id, (draftCountMap.get(d.user_id) ?? 0) + 1));

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalPosts = postCounts?.length ?? 0;
  const recentPosts = postCounts?.filter(p => new Date(p.ingested_at) > thirtyDaysAgo).length ?? 0;
  const totalDrafts = draftCounts?.length ?? 0;

  const rows = (authUsers ?? []).map(u => ({
    id: u.id,
    email: u.email ?? "—",
    signedUpAt: u.created_at,
    plan: profileMap.get(u.id)?.plan ?? "free",
    subredditCount: subCountMap.get(u.id) ?? 0,
    draftCount: draftCountMap.get(u.id) ?? 0,
  })).sort((a, b) => new Date(b.signedUpAt).getTime() - new Date(a.signedUpAt).getTime());

  const planCounts = rows.reduce((acc, r) => { acc[r.plan] = (acc[r.plan] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">User signups and platform usage</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total users", value: rows.length },
          { label: "Posts ingested (30d)", value: recentPosts },
          { label: "Total posts", value: totalPosts },
          { label: "Drafts generated", value: totalDrafts },
        ].map(s => (
          <div key={s.label} className="border border-border rounded-lg p-4">
            <div className="text-2xl font-semibold tabular-nums">{s.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {Object.entries(planCounts).map(([plan, count]) => (
          <span key={plan} className="text-xs border border-border rounded px-2.5 py-1 font-medium">
            {plan === "pro" ? "Pro Agency" : plan}: {count}
          </span>
        ))}
      </div>

      {/* Users table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Subreddits</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Drafts</th>
              <th className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">Signed up</th>
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
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.signedUpAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
