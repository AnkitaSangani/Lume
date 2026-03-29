"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

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

// Mark medication log as 'taken' based on MedId and Date
export async function markMedicationTaken(medId: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // @ts-ignore: Bypasses strict TS tuple bounds inferred as 'never' on Supabase update generic
  const { error } = await supabase.from("medication_logs").update({ status: 'taken' }).eq('med_id', medId).eq('date', date);

  if (error) {
    throw new Error(error.message);
  }

  // Next.js standard cache invalidation for updated state payloads
  revalidatePath("/");
  return { success: true };
}
