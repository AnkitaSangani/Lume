import { LumeRings } from "@/components/dashboard/LumeRings";
import { TrueTrendCard } from "@/components/dashboard/TrueTrendCard";
import { MedicationStation } from "@/components/dashboard/MedicationStation";
import { SnapAndTrack } from "@/components/dashboard/SnapAndTrack";
import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import { Activity } from "lucide-react";
import { getDashboardPayload } from "@/actions/metrics";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// ---------------------------------------------------------------------------
// Streaming Component Wrappers (Invoking cached edge payloads)
// ---------------------------------------------------------------------------

async function HeroRingsWrapper() {
  const data = await getDashboardPayload();
  if (!data || !data.userProfile) redirect("/login");

  const stepsGoal = data.userProfile.daily_step_goal || 10000;
  const currentSteps = data.dailyMetrics?.steps || 0;
  const stepsProgress = Math.min(currentSteps / stepsGoal, 1);

  const waterGoal = data.userProfile.daily_water_ml || 3500;
  const currentWater = data.dailyMetrics?.water_intake_ml || 0;
  const waterProgress = Math.min(currentWater / waterGoal, 1);

  const calGoal = 2000; 
  const caloriesProgress = Math.min(data.totalCalories / calGoal, 1);
  const caloriesRemaining = Math.max(calGoal - data.totalCalories, 0);

  return (
    <LumeRings 
      stepsProgress={stepsProgress}
      waterProgress={waterProgress}
      caloriesProgress={caloriesProgress}
      caloriesRemaining={caloriesRemaining} 
    />
  );
}

async function RegimenWrapper() {
  const data = await getDashboardPayload();
  if (!data) return null;
  const timestampOffsetString = new Date().toISOString().split("T")[0];
  return <MedicationStation initialMedications={data.medications} currentDate={timestampOffsetString} />;
}

async function TrueTrendWrapper() {
  const data = await getDashboardPayload();
  if (!data) return null;

  const displayWeight = data.dailyMetrics?.weight_kg 
    ? parseFloat(data.dailyMetrics.weight_kg) 
    : parseFloat(data.userProfile.current_weight_kg) || 0;
    
  const trendWeight = data.smoothedTrendWeight || displayWeight;

  return (
    <div className="flex flex-col gap-3 mt-2">
      <h2 className="text-lg font-bold text-foreground tracking-tight">Body Mass</h2>
      <TrueTrendCard 
        currentWeight={displayWeight} 
        trendWeight={trendWeight} 
        dataPoints={data.past7DaysWeight.length > 0 ? data.past7DaysWeight : [displayWeight]} 
      />
      <DailyBriefing />
    </div>
  );
}

async function AtAGlanceWrapper() {
  const data = await getDashboardPayload();
  if (!data) return null;

  const stepsGoal = data.userProfile.daily_step_goal || 10000;
  const currentSteps = data.dailyMetrics?.steps || 0;
  const waterGoal = data.userProfile.daily_water_ml || 3500;
  const currentWater = data.dailyMetrics?.water_intake_ml || 0;

  return (
    <section className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-surface border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Steps</span>
        <span className="text-3xl font-black text-foreground mt-1 tracking-tight">
          {currentSteps.toLocaleString()} <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">/ {(stepsGoal/1000).toFixed(0)}k</span>
        </span>
      </div>
      <div className="bg-surface border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Hydration</span>
        <span className="text-3xl font-black text-foreground mt-1 tracking-tight">
          {(currentWater/1000).toFixed(1)} <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">/ {(waterGoal/1000).toFixed(1)} L</span>
        </span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Skeletons Minimalist Clean White "Pulse" states securely matching boundaries 
// ---------------------------------------------------------------------------

function RingsSkeleton() {
  return (
    <div className="w-[280px] h-[280px] rounded-full border-[18px] border-gray-50 flex items-center justify-center animate-pulse">
      <div className="w-[236px] h-[236px] rounded-full border-[18px] border-gray-50 flex items-center justify-center">
        <div className="w-[192px] h-[192px] rounded-full border-[18px] border-gray-50"></div>
      </div>
    </div>
  );
}

function RegimenSkeleton() {
  return (
    <div className="w-full h-[140px] bg-gray-50 rounded-xl animate-pulse" />
  );
}

function TrendSkeleton() {
  return (
    <div className="w-full flex gap-4 animate-pulse mt-2">
      <div className="flex-1 h-[120px] bg-gray-50 rounded-2xl" />
      <div className="flex-1 h-[120px] bg-gray-50 rounded-2xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell Architecture strictly bypassing monolithic top-level database locks 
// ---------------------------------------------------------------------------

export default function Home() {
  const todayDate = new Date();
  const dateString = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Today</h1>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{dateString}</p>
        </div>
      </header>

      {/* Lume Rings Hero Container */}
      <section className="flex flex-col items-center justify-center py-2 relative min-h-[300px]">
        <Suspense fallback={<RingsSkeleton />}>
          <HeroRingsWrapper />
        </Suspense>
        
        {/* Interactive Sync indicator dropping local pulse dependency bounds */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 bg-surface px-4 py-2 rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] cursor-default">
          <Activity size={12} className="text-primary" />
          <span>Synced Just Now</span>
        </div>
      </section>

      {/* Primary AI Vision Logic Engine Entry */}
      <SnapAndTrack />

      {/* Medication Regimen Framework */}
      <section className="min-h-[140px]">
        <Suspense fallback={<RegimenSkeleton />}>
          <RegimenWrapper />
        </Suspense>
      </section>

      {/* Body Mass Track */}
      <section className="min-h-[160px]">
        <Suspense fallback={<TrendSkeleton />}>
          <TrueTrendWrapper />
        </Suspense>
      </section>
      
      {/* At-a-Glance Grid Array for immediate Macro reads */}
      <Suspense fallback={null}>
        <AtAGlanceWrapper />
      </Suspense>
    </div>
  );
}
