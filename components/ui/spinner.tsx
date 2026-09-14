import React from "react";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  text?: string;
  subtitle?: string;
  className?: string;
  inline?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color,
  text = "Caricamento in corso...",
  subtitle = "Sincronizzazione dati in corso...",
  className,
  inline = false,
}) => {
  // If explicitly small, medium, or requested inline, render micro SVG spinner
  if (inline || size === "sm" || size === "md") {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <svg
          className={cn("animate-spin", sizeClass, color || "text-blue-400")}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Premium admin card loader for size="lg" | "xl"
  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/95 border border-neutral-800 shadow-2xl p-7 sm:p-8 max-w-sm w-full flex flex-col items-center text-center backdrop-blur-xl">
        {/* Soft ambient gradient orbs */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Center Animated Dual-Ring & Icon */}
        <div className="relative flex items-center justify-center mb-4.5">
          {/* Outer primary spinning ring */}
          <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-400 border-b-transparent border-l-transparent animate-spin" />

          {/* Inner reverse amber ring */}
          <div className="absolute w-12 h-12 rounded-full border-2 border-transparent border-b-amber-400/70 border-l-amber-400/40 animate-[spin_2s_linear_infinite_reverse]" />

          {/* Central dumbbell badge */}
          <div className="absolute h-9 w-9 rounded-xl bg-neutral-850 border border-neutral-750 flex items-center justify-center shadow-inner">
            <Dumbbell className="h-4 w-4 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-base font-bold text-white tracking-tight">
          {text}
        </h3>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1 max-w-[250px] leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Animated pulse shimmer progress indicator */}
        <div className="w-40 h-1 bg-neutral-800 rounded-full overflow-hidden mt-5 relative">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-blue-500/80 to-transparent animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default Spinner;
