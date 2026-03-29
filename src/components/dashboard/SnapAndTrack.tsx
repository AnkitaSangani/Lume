"use client";

import React, { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MacroResult {
  item_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  feedback_tip: string;
}

export function SnapAndTrack() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [result, setResult] = useState<MacroResult | null>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // 1. Convert to a Local Browser Preview instantly
      const previewUrl = URL.createObjectURL(file);
      setPreviewUri(previewUrl);

      // 2. Compress the image matching instructions precisely 
      // max size 800px width/height, max 0.5MB limit
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // 3. Convert to Raw Base64 string formatting
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        // 4. Secure the fetch sequence passing payload to our Next.js edge route
        const response = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64data }),
        });
        
        if (!response.ok) throw new Error("Vision AI generation significantly failed");
        
        const data: MacroResult = await response.json();
        setResult(data);
        setIsProcessing(false);
      };
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      setPreviewUri(null); // Rollback view instantly to gracefully handle API limits
      alert("Failed to analyze image natively. Confirm OPENAI API Key is securely loaded!");
    }
  };

  const resetState = () => {
    setResult(null);
    setPreviewUri(null);
    setIsProcessing(false);
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Floating Action Center Button tracking bottom frame strictly mapping HealthifyMe aesthetics */}
      {!previewUri && !isProcessing && (
         <button 
           onClick={handleCapture}
           disabled={isProcessing}
           aria-label="Snap Fast Food Image"
           className="fixed bottom-[94px] left-1/2 -translate-x-1/2 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-[40] hover:bg-emerald-600 active:scale-95 fluid-transition"
         >
           <Camera size={26} strokeWidth={2.5} />
         </button>
      )}

      {/* Modal Block Processing State & Render Resolution */}
      {(isProcessing || previewUri || result) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/90 animate-in fade-in duration-300">
          <div className="bg-background w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* The Bounded High-Speed Image Visual Frame */}
            <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
               {previewUri ? (
                 <>
                   <img 
                      src={previewUri} 
                      alt="Local Food Scan" 
                      className={cn(
                        "object-cover w-full h-full fluid-transition",
                        isProcessing && "blur-md scale-105 saturate-50"
                      )} 
                    />
                    {isProcessing && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30 gap-3">
                         <RefreshCw className="animate-spin text-white" size={32} />
                         <span className="font-extrabold tracking-widest uppercase text-xs">Analyzing Scan...</span>
                       </div>
                    )}
                 </>
               ) : (
                 <div className="bg-surface w-full h-full animate-pulse" />
               )}
               
               {/* Modal Cancel Override */}
               <button 
                 onClick={resetState}
                 className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 fluid-transition z-10 backdrop-blur-sm"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Clean Modal JSON Extraction UI mapped rigidly rendering Soft Emerald constraints */}
            <div className="p-6 bg-white min-h-[220px]">
               {isProcessing && !result && (
                 <div className="flex flex-col gap-2 mt-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/5 mb-4 border border-gray-100"></div>
                    <div className="h-20 bg-gray-100 rounded-xl animate-pulse w-full"></div>
                 </div>
               )}

               {result && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-extrabold text-foreground tracking-tight mb-5 truncate">{result.item_name}</h3>
                    
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      <div className="flex flex-col items-center justify-center py-3 bg-surface rounded-xl border border-gray-100 shadow-sm cursor-default">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Kcal</span>
                        <span className="text-lg font-extrabold text-accent">{result.calories}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 bg-surface rounded-xl border border-gray-100 shadow-sm cursor-default">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Pro</span>
                        <span className="text-sm font-bold text-foreground mt-0.5">{result.protein}g</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 bg-surface rounded-xl border border-gray-100 shadow-sm cursor-default">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Crbs</span>
                        <span className="text-sm font-bold text-foreground mt-0.5">{result.carbs}g</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 bg-surface rounded-xl border border-gray-100 shadow-sm cursor-default">
                        <span className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Fat</span>
                        <span className="text-sm font-bold text-foreground mt-0.5">{result.fats}g</span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 bg-emerald-50/50 leading-relaxed p-4 rounded-xl border border-emerald-100 mb-6 flex gap-3 shadow-sm">
                       <div className="bg-emerald-100 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                         <Check size={14} strokeWidth={3} />
                       </div>
                       <span className="tracking-wide">"{result.feedback_tip}"</span>
                    </div>

                    <div className="flex gap-2">
                       <Button variant="outline" className="w-[100px]" onClick={resetState}>Discard</Button>
                       <Button className="flex-1" onClick={() => {
                          alert('Macros persisted to Dashboard!');
                          resetState();
                       }}>
                          Save Log
                       </Button>
                    </div>
                 </div>
               )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
