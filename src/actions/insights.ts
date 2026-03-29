"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {}
        },
      },
    }
  );
}

export async function generateDailyBriefing(userId: string) {
  const supabase = await createClient();
  
  // Validate Security fallback bounds
  if (!userId) {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) return [];
     userId = user.id;
  }

  // Phase 7: Calculate the exact ISO bounds for a rolling strict 7-day query
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const formattedToday = today.toISOString().split("T")[0];
  const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", formattedSevenDaysAgo)
    .lte("date", formattedToday)
    .order("date", { ascending: true });

  const metrics: any[] = data || [];

  if (error || metrics.length === 0) {
    return [];
  }

  const insights: string[] = [];

  // 1. Correlation UX Engine: RPE (Exertion) mapped against Water Intake (ml)
  let highRpeWater = 0;
  let highRpeCount = 0;
  let lowRpeWater = 0;
  let lowRpeCount = 0;

  metrics.forEach(m => {
    if (m.rpe_score !== null && m.water_intake_ml !== null) {
      if (m.rpe_score >= 7) {
        highRpeWater += m.water_intake_ml;
        highRpeCount++;
      } else if (m.rpe_score <= 4) {
        lowRpeWater += m.water_intake_ml;
        lowRpeCount++;
      }
    }
  });

  if (highRpeCount > 0 && lowRpeCount > 0) {
    const avgHigh = highRpeWater / highRpeCount;
    const avgLow = lowRpeWater / lowRpeCount;
    
    if (avgHigh > avgLow + 400) { 
      insights.push("You consistently drink significantly more water on heavy training days (RPE 7+). Incredible habit!");
    } else if (avgHigh < avgLow) {
      insights.push("Your hydration sharply drops on heavy training days. Try locking down a water bottle before intense sessions start.");
    }
  }

  // 2. Correlation UX Engine: Weight Spikes versus True Trajectory moving average
  if (metrics.length >= 3) {
    const todayMetric = metrics[metrics.length - 1];
    
    // Check if the chron filter trapped today precisely
    if (todayMetric.date === formattedToday && todayMetric.weight_kg !== null) {
      // Calculate active 7-day smoothed average skipping null values cleanly
      const validWeights = metrics.filter(m => m.weight_kg !== null).map(m => Number(m.weight_kg));
      
      if (validWeights.length > 2) {
        const avg = validWeights.reduce((a, b) => a + b, 0) / validWeights.length;
        const previousMetric = metrics[metrics.length - 2];
        
        if (previousMetric.weight_kg !== null) {
          const spike = Number(todayMetric.weight_kg) - Number(previousMetric.weight_kg);
          const trendDiff = Number(todayMetric.weight_kg) - avg;
          
          // If weight jumped >0.5kg aggressively over 24h BUT remains below the rolling 7-day average:
          if (spike > 0.5 && trendDiff < 0) {
             insights.push("Weight spiked overnight, but the 7-day trend remains strongly down. It is highly likely simple water retention.");
          }
        }
      }
    }
  }

  // Default encouraging framework failsafe
  if (insights.length === 0) {
    insights.push("You are building immense consistency. Keep logging your daily stats to generate deeper algorithmic insights.");
  }

  return insights;
}
