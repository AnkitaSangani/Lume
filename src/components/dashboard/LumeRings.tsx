import React from 'react';
import { cn } from '@/lib/utils';

interface LumeRingsProps {
  stepsProgress: number; // 0 to 1
  waterProgress: number; // 0 to 1
  caloriesProgress: number; // 0 to 1
  caloriesRemaining: number;
  className?: string;
}

export function LumeRings({ 
  stepsProgress, 
  waterProgress, 
  caloriesProgress, 
  caloriesRemaining, 
  className 
}: LumeRingsProps) {
  const size = 280; 
  const center = size / 2;
  const strokeWidth = 18;
  const gap = 4;

  const rings = [
    { radius: 110, progress: stepsProgress, color: "text-primary" },    // Outer (Green)
    { radius: 110 - strokeWidth - gap, progress: waterProgress, color: "text-secondary" }, // Middle (Blue)
    { radius: 110 - (strokeWidth + gap) * 2, progress: caloriesProgress, color: "text-accent" }, // Inner (Orange)
  ];

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {rings.map((ring, i) => {
          const circumference = 2 * Math.PI * ring.radius;
          const strokeDashoffset = circumference - Math.min(Math.max(ring.progress, 0), 1) * circumference;
          
          return (
            <g key={i}>
              <circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                strokeWidth={strokeWidth}
                className="text-gray-100"
                stroke="currentColor"
              />
              <circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className={cn(ring.color, "fluid-transition")}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
                stroke="currentColor"
              />
            </g>
          );
        })}
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center pointer-events-none pb-2">
        <span className="text-4xl font-extrabold tracking-tight text-foreground">
          {caloriesRemaining}
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          KCAL LEFT
        </span>
      </div>
    </div>
  );
}
