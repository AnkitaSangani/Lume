"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Inline helper to securely instantiate the Supabase Server Client
async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignored since Server Components can't set cookies easily
          }
        },
      },
    }
  );
}

// Fetches the user's daily string for today
export async function getTodayMetrics() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Return null politely when no user is signed in to avoid SWR thrashing
    return null; 
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  if (error && error.code !== "PGRST116") { 
    // PGRST116 = No rows found. In that case, we can proceed to return null instead of throwing.
    throw new Error(error.message);
  }

  return data; 
}

// Server action to add/update water intake with optimistic UI capabilities
export async function updateWaterIntake(amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const today = new Date().toISOString().split("T")[0];

  // Retrieve current water or default to 0
  const { data: currentMetrics } = await supabase
    .from("daily_metrics")
    .select("water_intake_ml")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const currentWater = currentMetrics?.water_intake_ml || 0;
  const newWater = currentWater + amount;

  // Utilize the constraints laid out in the migration SQL
  const { data, error } = await supabase
    .from("daily_metrics")
    .upsert(
      {
        user_id: user.id,
        date: today,
        water_intake_ml: newWater,
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
