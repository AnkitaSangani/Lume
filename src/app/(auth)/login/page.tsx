"use client";

import { useActionState, useEffect } from "react";
import { loginWithEmail, signupWithEmail } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

// Utilizing modern React 19 Action States explicitly avoiding heavy generic overrides
export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(loginWithEmail, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signupWithEmail, null);

  const pending = isLoginPending || isSignupPending;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center fade-in px-4 relative">
      <div className="absolute top-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl rounded-full absolute pointer-events-none"></div>

      <div className="flex flex-col items-center text-center mb-10 z-10 w-full max-w-sm">
         <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-emerald-400 pb-1">
           Lume
         </h1>
         <p className="text-gray-400 text-sm font-semibold tracking-wide mt-2">Sign in to your Dashboard.</p>
      </div>

      <div className="bg-white rounded-[24px] p-6 w-full max-w-sm border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required
              className="w-full bg-surface border border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold text-foreground outline-none fluid-transition placeholder:text-gray-300" 
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required
              className="w-full bg-surface border border-transparent focus:border-primary/50 focus:bg-white rounded-xl px-4 py-3.5 text-sm font-bold text-foreground outline-none fluid-transition placeholder:text-gray-300" 
              placeholder="••••••••"
            />
          </div>

          {(loginState?.error || signupState?.error) && (
             <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mt-2 text-center animate-pulse">
               {loginState?.error || signupState?.error}
             </p>
          )}

          <div className="mt-4 flex flex-col gap-3">
             <Button 
                formAction={loginAction} 
                disabled={pending}
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl py-6 font-bold text-base shadow-lg shadow-emerald-500/20 active:scale-95 fluid-transition relative overflow-hidden group"
             >
                {pending ? "Authenticating..." : "Sign In"}
             </Button>

             <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-semibold uppercase">Or</span>
                <div className="flex-grow border-t border-gray-100"></div>
             </div>

             <Button 
                variant="outline"
                formAction={signupAction} 
                disabled={pending}
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl py-6 font-bold flex gap-2 active:scale-95 fluid-transition"
             >
                Create Account
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
