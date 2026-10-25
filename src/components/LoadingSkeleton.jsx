'use client';

import { Compass } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div className="rounded-lg border border-[#E8E1D5] bg-white p-8 sm:p-12 text-center space-y-4 animate-fadeIn text-[#162842] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="w-12 h-12 rounded-md bg-[#FAECE8] text-[#E05A3A] flex items-center justify-center mx-auto border border-[#E05A3A]/40 shadow-xs">
        <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="font-serif text-xl font-semibold text-[#162842]">
          Formulating Your Field Dossier
        </h3>
        <p className="text-xs sm:text-sm text-[#526685] leading-relaxed">
          Synthesizing daily timing, local transit routes, companion considerations, and expenditure estimates...
        </p>
      </div>

      <div className="pt-2 flex justify-center items-center gap-2 text-[11px] text-[#E05A3A] font-semibold tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E05A3A] animate-ping" />
        <span>Curating Authentic Highlights</span>
      </div>
    </div>
  );
}

