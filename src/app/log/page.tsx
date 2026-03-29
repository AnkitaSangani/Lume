"use client";

import { PlusCircle, Droplets, Footprints } from "lucide-react";
import { updateWaterIntake } from "@/actions/metrics";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogPage() {
  const [isLogging, setIsLogging] = useState(false);
  const router = useRouter();

  const handleAggressiveWaterLog = async (amount: number) => {
    setIsLogging(true);
    try {
      await updateWaterIntake(amount);
      router.push("/"); // Rapid redirect to home purely verifying Lume Rings reaction natively
    } catch(e) {
      console.error(e);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Quick Log</h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Manual Entry Bypass</p>
      </header>
      
      <section className="grid grid-cols-2 gap-4">
        {/* Aggressive Quick Add Water Limits */}
        <button 
          disabled={isLogging}
          onClick={() => handleAggressiveWaterLog(250)}
          className="bg-secondary/10 hover:bg-secondary/20 active:scale-95 text-secondary rounded-3xl p-6 flex flex-col items-center justify-center gap-3 fluid-transition font-bold shadow-sm"
        >
          <Droplets size={32} />
          <span>+ 250 ml</span>
        </button>

        <button 
          disabled={isLogging}
          onClick={() => handleAggressiveWaterLog(500)}
          className="bg-secondary/10 hover:bg-secondary/20 active:scale-95 text-secondary rounded-3xl p-6 flex flex-col items-center justify-center gap-3 fluid-transition font-bold shadow-sm"
        >
          <Droplets size={32} />
          <span>+ 500 ml</span>
        </button>
      </section>
      
      <section className="bg-surface rounded-3xl p-6 border border-gray-100 flex flex-col items-center gap-3 mt-4 opacity-50">
        <Footprints size={32} className="text-primary" />
        <span className="font-bold text-gray-400">Step Sync is currently exclusively tracking via background pedometer bridges.</span>
      </section>
    </div>
  );
}
