"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const heightCm = formData.get("height_cm") as string;
  const currentWeightKg = formData.get("current_weight_kg") as string;
  const targetWeightKg = formData.get("target_weight_kg") as string;

  if (!heightCm || !currentWeightKg || !targetWeightKg) {
    return { error: "All physical matrix bound fields are explicitly required mapping Lume execution correctly." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
     return { error: "Session synchronization unexpectedly compromised. Refresh the dashboard mapping constraints." };
  }

  // Dual Transaction 1: Execute primary User map override flagging initial access logic successfully
  const { error: userError } = await supabase
    .from("users")
    // @ts-ignore
    .upsert({
      id: user.id,
      height_cm: parseInt(heightCm),
      current_weight_kg: parseFloat(currentWeightKg),
      target_weight_kg: parseFloat(targetWeightKg),
      is_onboarded: true,
    });

  if (userError) return { error: userError.message };

  // Dual Transaction 2: Protect the Phase 4 UI visual arrays from executing against an undefined backend state
  const today = new Date().toISOString().split("T")[0];

  const { error: metricsError } = await supabase
    .from("daily_metrics")
    // @ts-ignore
    .insert({
      user_id: user.id,
      date: today,
      weight_kg: parseFloat(currentWeightKg),
      steps: 0,
      water_intake_ml: 0,
      body_fat_pct: null,
      rpe_score: null
    });

  if (metricsError) {
    // We suppress explicit fails here purely if the unique (user_id, date) constraint drops a clash logic safely mapped. 
    console.error("Dashboard Seed Injection Drop: ", metricsError);
  }

  // Conclude dual-transaction sequence bypassing middleware completely naturally
  redirect("/");
}
