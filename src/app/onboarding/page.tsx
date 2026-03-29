"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/actions/onboarding";
import { Button } from "@/components/ui/Button";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState("175");
  const [currentWeight, setCurrentWeight] = useState("75.0");
  const [targetWeight, setTargetWeight] = useState("70.0");
  const [errorText, setErrorText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("height_cm", height);
      formData.append("current_weight_kg", currentWeight);
      formData.append("target_weight_kg", targetWeight);
      
      const result = await completeOnboarding(formData);
      if (result?.error) {
        setErrorText(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col h-[85vh] justify-center fade-in px-4">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        
        {/* Dynamic Nav Slider Tracking visually representing transition sequence constraints */}
        <div className="flex gap-2 mb-8">
           <div className={`h-2 rounded-full fluid-transition ${step >= 1 ? 'w-8 bg-emerald-500' : 'w-4 bg-gray-200'}`}></div>
           <div className={`h-2 rounded-full fluid-transition ${step >= 2 ? 'w-8 bg-emerald-500' : 'w-4 bg-gray-200'}`}></div>
           <div className={`h-2 rounded-full fluid-transition ${step >= 3 ? 'w-8 bg-emerald-500' : 'w-4 bg-gray-200'}`}></div>
        </div>

        <div className="w-full bg-white border border-gray-100 p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          
          {step === 1 && (
            <div className="flex flex-col items-center animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">How tall are you?</h2>
              <p className="text-gray-400 font-medium text-sm mb-8 text-center text-balance">Your precise height calculates accurate BMI threshold metrics exclusively offline safely.</p>
              
              <div className="flex items-end gap-2 mb-10">
                <input 
                   type="number" 
                   value={height} 
                   onChange={(e) => setHeight(e.target.value)}
                   className="text-5xl font-extrabold text-foreground bg-transparent w-28 text-center outline-none border-b-2 border-primary/20 focus:border-primary fluid-transition"
                />
                <span className="text-xl font-bold text-gray-400 mb-1">cm</span>
              </div>
              
              <Button onClick={handleNext} className="w-full py-6 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 fluid-transition">Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Current Weight</h2>
              <p className="text-gray-400 font-medium text-sm mb-8 text-center text-balance">Initializing local tracking engines correctly mapping against initial timeline offsets natively.</p>
              
              <div className="flex items-end gap-2 mb-10">
                <input 
                   type="number" 
                   step="0.1"
                   value={currentWeight} 
                   onChange={(e) => setCurrentWeight(e.target.value)}
                   className="text-5xl font-extrabold text-foreground bg-transparent w-36 text-center outline-none border-b-2 border-primary/20 focus:border-primary fluid-transition"
                />
                <span className="text-xl font-bold text-gray-400 mb-1">kg</span>
              </div>
              
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={handleBack} className="flex-1 py-6 rounded-xl font-bold border-gray-200 active:scale-95 fluid-transition text-gray-500 hover:bg-gray-50">Back</Button>
                <Button onClick={handleNext} className="flex-1 py-6 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 fluid-transition">Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Target Goal</h2>
              <p className="text-gray-400 font-medium text-sm mb-8 text-center text-balance">The AI algorithm forces its correlation limits checking progression rigidly against this milestone.</p>
              
              <div className="flex items-end gap-2 mb-10">
                <input 
                   type="number" 
                   step="0.1"
                   value={targetWeight} 
                   onChange={(e) => setTargetWeight(e.target.value)}
                   className="text-5xl font-extrabold text-foreground bg-transparent w-36 text-center outline-none border-b-2 border-primary/20 focus:border-primary fluid-transition"
                />
                <span className="text-xl font-bold text-gray-400 mb-1">kg</span>
              </div>
              
              {errorText && <p className="text-xs text-red-500 font-bold bg-red-50 w-full text-center py-2 rounded mb-4 animate-in fade-in border border-red-100">{errorText}</p>}

              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={handleBack} disabled={isPending} className="flex-1 py-6 rounded-xl font-bold border-gray-200 active:scale-95 fluid-transition text-gray-500 hover:bg-gray-50">Back</Button>
                <Button 
                   onClick={handleSubmit} 
                   disabled={isPending}
                   className="flex-[2] py-6 rounded-xl font-bold bg-emerald-950 text-white shadow-lg hover:bg-emerald-900 active:scale-95 fluid-transition"
                >
                  {isPending ? "Configuring..." : "Launch Lume"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
