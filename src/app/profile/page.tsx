import { getDashboardPayload } from "@/actions/metrics";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const data = await getDashboardPayload();

  if (!data || !data.userProfile) {
    redirect("/login");
  }

  const { userProfile } = data;

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Profile</h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Metrics & Config</p>
      </header>

      <section className="bg-surface rounded-3xl p-6 flex items-center justify-between border border-gray-100 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={32} className="text-primary" />
          </div>
          <div className="flex flex-col">
             <span className="font-extrabold text-lg">Lume Athlete</span>
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{userProfile.id?.split("-")[0]}</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400">Baseline Limits</h2>
        <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
             <span className="font-semibold text-gray-600">Height</span>
             <span className="font-extrabold text-foreground">{userProfile.height_cm} cm</span>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
             <span className="font-semibold text-gray-600">Starting Weight</span>
             <span className="font-extrabold text-foreground">{userProfile.current_weight_kg} kg</span>
          </div>
          <div className="flex justify-between items-center p-4">
             <span className="font-semibold text-gray-600">Target Goal</span>
             <span className="font-extrabold text-primary">{userProfile.target_weight_kg} kg</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400">PWA Activity Goals</h2>
        <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
             <span className="font-semibold text-gray-600">Daily Steps</span>
             <span className="font-extrabold text-emerald-500">{userProfile.daily_step_goal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-4">
             <span className="font-semibold text-gray-600">Hydration</span>
             <span className="font-extrabold text-secondary">{userProfile.daily_water_ml} ml</span>
          </div>
        </div>
      </section>
    </div>
  );
}
