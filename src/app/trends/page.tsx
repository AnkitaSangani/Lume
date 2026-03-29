import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WeightTrendChart } from "@/components/trends/WeightTrendChart";

export default async function TrendsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Calculate strict 30 days lookback boundary natively protecting edge SQL constraints
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const boundaryDateString = thirtyDaysAgo.toISOString().split("T")[0];

  const { data: metrics } = await supabase
    .from("daily_metrics")
    .select("date, weight_kg")
    .eq("user_id", user.id)
    .gte("date", boundaryDateString)
    .order("date", { ascending: true })
    .limit(30);

  // Safely map against Supabase 'never[]' default types cleanly without explicit mass generic mapping
  const parsedData = (metrics || []).map((m: any) => ({
    date: m.date,
    weight_kg: parseFloat(m.weight_kg) || 0
  })).filter(d => d.weight_kg > 0);

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">True Trends</h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Historical Analytics</p>
      </header>
      
      <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">30-Day Body Mass</h2>
        <WeightTrendChart data={parsedData} />
      </section>
    </div>
  );
}
