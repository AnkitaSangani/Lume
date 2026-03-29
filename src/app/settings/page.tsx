import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Settings as SettingsIcon } from "lucide-react";

export const revalidate = 3600;

export default function SettingsPage() {
  
  // Inline Server Action mapping securely binding Vercel Edge drop
  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Device Config</p>
      </header>
      
      <section className="flex flex-col items-center justify-center p-10 bg-surface rounded-3xl border border-gray-100 gap-4 opacity-50">
        <SettingsIcon size={48} className="text-gray-400 mb-2" />
        <p className="text-center font-bold text-gray-400 max-w-[200px]">Notifications and Device Sync are locked. Coming soon.</p>
      </section>

      <section className="mt-8">
        <form action={logout} className="w-full">
           <button type="submit" className="w-full bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 font-extrabold py-5 rounded-full flex justify-center gap-3 fluid-transition shadow-sm border border-red-100">
             <LogOut />
             Secure Sign Out
           </button>
        </form>
      </section>
    </div>
  );
}
