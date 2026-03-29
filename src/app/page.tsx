import { LumeRings } from "@/components/dashboard/LumeRings";
import { TrueTrendCard } from "@/components/dashboard/TrueTrendCard";
import { MedicationStation } from "@/components/dashboard/MedicationStation";
import { SnapAndTrack } from "@/components/dashboard/SnapAndTrack";
import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import { Activity } from "lucide-react";
import { getDashboardPayload } from "@/actions/metrics";
import { redirect } from "next/navigation";

export default async function Home() {
  const data = await getDashboardPayload();

  if (!data || !data.userProfile) {
    redirect("/login");
  }

  const { userProfile, dailyMetrics, totalCalories, past7DaysWeight, medications } = data;

  // Progress Calculations natively protecting against divide-by-zero limits
  const stepsGoal = userProfile.daily_step_goal || 10000;
  const currentSteps = dailyMetrics?.steps || 0;
  const stepsProgress = Math.min(currentSteps / stepsGoal, 1);

  const waterGoal = userProfile.daily_water_ml || 3500;
  const currentWater = dailyMetrics?.water_intake_ml || 0;
  const waterProgress = Math.min(currentWater / waterGoal, 1);

  // We explicitly assume a strict 2000 calorie map if no BMR formula is bound to Phase 1 limits to keep UI scale intact
  const calGoal = 2000; 
  const caloriesProgress = Math.min(totalCalories / calGoal, 1);
  const caloriesRemaining = Math.max(calGoal - totalCalories, 0);

  // Formatting strings
  const todayDate = new Date();
  const dateString = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timestampOffsetString = todayDate.toISOString().split("T")[0];

  const displayWeight = dailyMetrics?.weight_kg 
    ? parseFloat(dailyMetrics.weight_kg) 
    : parseFloat(userProfile.current_weight_kg) || 0;
    
  // Simple trend logic for baseline UI
  const trendWeight = past7DaysWeight.length > 1 ? past7DaysWeight[past7DaysWeight.length - 2] : displayWeight;

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Today</h1>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{dateString}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 fluid-transition">
          <span className="text-sm font-bold text-gray-500">
            {/* Extremely simple initial icon extraction array */}
          </span>
        </div>
      </header>

      {/* Lume Rings Hero Container */}
      <section className="flex flex-col items-center justify-center py-2 relative">
        <LumeRings 
          stepsProgress={stepsProgress}
          waterProgress={waterProgress}
          caloriesProgress={caloriesProgress}
          caloriesRemaining={caloriesRemaining} 
        />
        
        {/* Interactive Sync indicator dropping local pulse dependency bounds */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 bg-surface px-4 py-2 rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] cursor-default">
          <Activity size={12} className="text-primary animate-pulse" />
          <span>Synced Just Now</span>
        </div>
      </section>

      {/* Primary AI Vision Logic Engine Entry */}
      <SnapAndTrack />

      {/* Medication Regimen Framework */}
      <section>
        <MedicationStation initialMedications={medications} currentDate={timestampOffsetString} />
      </section>

      {/* Body Mass Track */}
      <section className="flex flex-col gap-3 mt-2">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Body Mass</h2>
        <TrueTrendCard 
          currentWeight={displayWeight} 
          trendWeight={trendWeight} 
          dataPoints={past7DaysWeight.length > 0 ? past7DaysWeight : [displayWeight]} 
        />
        <DailyBriefing />
      </section>
      
      {/* At-a-Glance Grid Array for immediate Macro reads */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-2xl p-5 border border-gray-100 flex flex-col gap-1 shadow-sm fluid-transition hover:border-primary/40 cursor-pointer">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Steps</span>
          <span className="text-2xl font-extrabold text-foreground mt-1">
            {currentSteps.toLocaleString()} <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">/ {(stepsGoal/1000).toFixed(0)}k</span>
          </span>
        </div>
        <div className="bg-surface rounded-2xl p-5 border border-gray-100 flex flex-col gap-1 shadow-sm fluid-transition hover:border-secondary/40 cursor-pointer">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Hydration</span>
          <span className="text-2xl font-extrabold text-foreground mt-1">
            {(currentWater/1000).toFixed(1)} <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">/ {(waterGoal/1000).toFixed(1)} L</span>
          </span>
        </div>
      </section>
    </div>
  );
}
