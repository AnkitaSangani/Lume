"use client";

import { Home, Activity, PlusCircle, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  // Conditionally hide Nav map entirely when user accesses Auth or Onboarding gates
  if (pathname === "/login" || pathname === "/onboarding") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-between px-6 z-50">
      <div className="flex w-full max-w-md mx-auto items-center justify-between text-gray-400">
        <Link href="/" className="flex flex-col items-center gap-1 text-primary w-16 group">
          <Home size={24} className="group-active:scale-95 fluid-transition" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link href="/trends" className="flex flex-col items-center gap-1 hover:text-gray-900 group w-16 fluid-transition">
          <Activity size={24} className="group-active:scale-95 fluid-transition" />
          <span className="text-[10px] font-medium">Trends</span>
        </Link>
        
        <div className="relative w-16 flex justify-center">
          <Link href="/log" aria-label="Quick Log" className="absolute -top-10 bg-primary text-white p-3.5 rounded-full shadow-lg shadow-primary/30 hover:bg-emerald-600 hover:scale-105 active:scale-95 fluid-transition">
            <PlusCircle size={28} strokeWidth={2.5} />
          </Link>
        </div>
        
        <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-gray-900 group w-16 fluid-transition">
          <User size={24} className="group-active:scale-95 fluid-transition" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
        
        <Link href="/settings" className="flex flex-col items-center gap-1 hover:text-gray-900 group w-16 fluid-transition">
          <Settings size={24} className="group-active:scale-95 fluid-transition" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>
    </nav>
  );
}
