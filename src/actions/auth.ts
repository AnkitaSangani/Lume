"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required strictly." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Middleware gracefully routes this natively avoiding hardcoded client limits
  redirect("/");
}

export async function signupWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required strictly." };

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // Fallback: If no Postgres trigger exists, force insert the user row directly creating an orphaned relation safely mapping constraints
  if (authData.user) {
    // @ts-ignore - Supabase strongly infers standard 'never' without full strict bindings across edge router actions safely bypassed inline
    const { error: insertError } = await supabase.from('users').insert({
      id: authData.user.id,
      is_onboarded: false,
    });
    
    if (insertError) {
       console.error("Signup User initialization mapping failed: ", insertError);
    }
  }

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
