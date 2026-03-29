import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface TrueTrendCardProps {
  currentWeight: number;
  trendWeight: number;
  dataPoints: number[]; // Array of exactly 7 numbers for the 7-day sparkline
}

export function TrueTrendCard({ currentWeight, trendWeight, dataPoints }: TrueTrendCardProps) {
  // Ultra-lightweight SVG Sparkline Calculation matching the constraint.
  const width = 300;
  const height = 70;
  const padding = 10;
  
  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const range = max - min || 1; // Safeguard division by zero if all weights are identical
  
  const points = dataPoints.map((val, i) => {
    const x = (i / (dataPoints.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' L ');
  
  const pathData = `M ${points}`;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current</span>
            <span className="text-3xl font-extrabold text-foreground">{currentWeight.toFixed(1)} <span className="text-sm font-medium text-gray-400">kg</span></span>
          </div>
          
          <div className="h-12 w-px bg-gray-100"></div>
          
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">True Trend</span>
            <span className="text-3xl font-extrabold text-primary">{trendWeight.toFixed(1)} <span className="text-sm font-medium text-gray-400">kg</span></span>
          </div>
        </div>
        
        <div className="w-full mt-4 -ml-1">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            {/* Sparkline gradient fill (Optional visual flair referencing Clean White aesthetic) */}
            <linearGradient id="sparkline-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
            
            {/* The SVG Path */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="fluid-transition"
            />
            
            {/* Dots mapping precisely onto the 7 data points */}
            {dataPoints.map((val, i) => {
               const x = (i / (dataPoints.length - 1)) * (width - padding * 2) + padding;
               const y = height - ((val - min) / range) * (height - padding * 2) - padding;
               return <circle key={i} cx={x} cy={y} r="3" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="2" />;
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
