import { LumeRings } from "@/components/dashboard/LumeRings";
import { TrueTrendCard } from "@/components/dashboard/TrueTrendCard";
import { MedicationStation, Medication } from "@/components/dashboard/MedicationStation";
import { SnapAndTrack } from "@/components/dashboard/SnapAndTrack";
import { DailyBriefing } from "@/components/dashboard/DailyBriefing";
import { Activity } from "lucide-react";

export default function Home() {
  const sparklineData = [75.5, 75.4, 75.2, 75.1, 75.3, 75.0, 74.8];
  
  // Phase 5: Seed UI dummy payload to model backend flow
  const dummyMeds: Medication[] = [
    { id: 'm1', name: 'Vitamin D', time: '08:00', status: 'pending' },
    { id: 'm2', name: 'Omega 3', time: '12:30', status: 'taken' },
    { id: 'm3', name: 'Magnesium', time: '20:00', status: 'pending' },
  ];

  // Assuming naive native datestamp parsing to simulate exact day
  const timestampOffsetString = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Today</h1>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Thursday, March 29</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 fluid-transition">
          <span className="text-sm font-bold text-gray-500">JD</span>
        </div>
      </header>

      {/* Lume Rings Hero Container */}
      <section className="flex flex-col items-center justify-center py-2 relative">
        <LumeRings 
          stepsProgress={0.75}    // 75% -> Outer Ring (Emerald)
          waterProgress={0.4}     // 40% -> Middle Ring (Blue)
          caloriesProgress={0.65} // 65% -> Inner Ring (Orange)
          caloriesRemaining={1240} 
        />
        
        {/* Interactive Sync indicator simulating the Health Connect polling hook */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 bg-surface px-4 py-2 rounded-full border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] cursor-default">
          <Activity size={12} className="text-primary animate-pulse" />
          <span>Synced Just Now</span>
        </div>
      </section>

      {/* Primary AI Vision Logic Engine Entry */}
      <SnapAndTrack />

      {/* Medication Regimen Framework */}
      <section>
        <MedicationStation initialMedications={dummyMeds} currentDate={timestampOffsetString} />
      </section>

      {/* Body Mass Track */}
      <section className="flex flex-col gap-3 mt-2">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Body Mass</h2>
        <TrueTrendCard 
          currentWeight={74.8} 
          trendWeight={74.6} 
          dataPoints={sparklineData} 
        />
        <DailyBriefing />
      </section>
      
      {/* At-a-Glance Grid Array for immediate Macro reads */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-2xl p-5 border border-gray-100 flex flex-col gap-1 shadow-sm fluid-transition hover:border-primary/40 cursor-pointer">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Steps</span>
          <span className="text-2xl font-extrabold text-foreground mt-1">7,500 <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">/ 10k</span></span>
        </div>
        <div className="bg-surface rounded-2xl p-5 border border-gray-100 flex flex-col gap-1 shadow-sm fluid-transition hover:border-secondary/40 cursor-pointer">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Hydration</span>
          <span className="text-2xl font-extrabold text-foreground mt-1">1.4 <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">/ 3.5 L</span></span>
        </div>
      </section>
    </div>
  );
}
