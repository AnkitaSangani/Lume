"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { markMedicationTaken } from '@/actions/medications';

export interface Medication {
  id: string;
  name: string;
  time: string; // "HH:mm" format natively 
  status: 'pending' | 'taken' | 'missed';
}

interface MedicationStationProps {
  initialMedications: Medication[];
  currentDate: string; // "YYYY-MM-DD"
}

export function MedicationStation({ initialMedications, currentDate }: MedicationStationProps) {
  const [meds, setMeds] = useState<Medication[]>(initialMedications);
  const [toast, setToast] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleTakePill = async (medId: string) => {
    // 1. Snapshot the current state specifically prioritizing Optimistic UI
    const previousState = [...meds];
    
    // 2. Instantly update UI mimicking immediate backend persistence 
    setMeds(meds.map(m => m.id === medId ? { ...m, status: 'taken' } : m));

    try {
      // 3. Defer Server Action network mutation utilizing modern Next.js 15 boundaries
      await markMedicationTaken(medId, currentDate);
    } catch (error) {
      // 4. Revert UI if network operation or Postgres execution totally drops
      setMeds(previousState);
      displayToast("Network Error: Failed to log medication.");
    }
  };

  // Logic mapping the "soft red" background requested constraint mapping current relative pill time
  const isPastDue = (timeString: string) => {
    const now = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    const pillTime = new Date();
    pillTime.setHours(hours, minutes, 0, 0);
    return now > pillTime;
  };

  // Time cosmetic formatting mapper
  const formatAmPm = (timeString: string) => {
    const [h, m] = timeString.split(':');
    let hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${m} ${ampm}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Regimen</h2>
      </div>

      <div className="flex overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar gap-4 -mx-4 px-4 relative">
        {meds.map((med) => {
          const pastDue = isPastDue(med.time);
          const isPending = med.status === 'pending';
          const isTaken = med.status === 'taken';

          return (
            <div 
              key={med.id} 
              className={cn(
                "min-w-[140px] snap-start flex flex-col p-4 rounded-xl border fluid-transition cursor-default relative overflow-hidden flex-shrink-0 shadow-sm",
                isTaken ? "bg-emerald-50 border-emerald-100" : 
                (isPending && pastDue) ? "bg-red-50 border-red-100" : 
                "bg-surface border-gray-100"
              )}
            >
              <span className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", 
                isTaken ? "text-emerald-500" : 
                (isPending && pastDue) ? "text-red-400" : "text-gray-400"
              )}>
                {formatAmPm(med.time)}
              </span>
              
              <span className={cn("text-base font-extrabold mb-5 truncate",
                isTaken ? "text-emerald-900" : 
                (isPending && pastDue) ? "text-red-900" : "text-foreground"
              )}>
                {med.name}
              </span>
              
              <button
                onClick={() => isPending && handleTakePill(med.id)}
                disabled={!isPending}
                aria-label={`Mark ${med.name} as taken`}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center fluid-transition active:scale-90",
                  isTaken ? "bg-emerald-500 text-white" : 
                  (isPending && pastDue) ? "bg-red-200 text-red-50 hover:bg-emerald-500 hover:text-white border border-red-200" : 
                  "bg-gray-200 text-white hover:bg-emerald-500"
                )}
              >
                <Check size={20} strokeWidth={isTaken ? 3 : 2.5} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating System Component Toast */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-4 py-2.5 rounded-full shadow-xl z-50 transition-all">
          {toast}
        </div>
      )}
    </div>
  );
}
