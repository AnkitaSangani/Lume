import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-sm fluid-transition focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "bg-primary text-white hover:bg-emerald-600 shadow-sm",
          variant === "outline" && "border border-gray-200 bg-transparent hover:bg-gray-50 text-foreground",
          variant === "ghost" && "bg-transparent text-foreground hover:bg-gray-100",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
