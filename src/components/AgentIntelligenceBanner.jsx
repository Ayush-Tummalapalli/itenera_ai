'use client';

import { Sparkles, Compass, Navigation, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AgentIntelligenceBanner({ agentNotes, destination, duration }) {
  if (!agentNotes) return null;

  return (
    <div className="rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] p-5 sm:p-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8E1D5] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#162842] text-[#F3785B] flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#E05A3A] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Autonomous AI Travel Agent Intelligence</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#162842]">
              Strategic Blueprint &amp; Field Protocols
            </h3>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded bg-[#162842]/10 text-[#162842] border border-[#162842]/20 font-medium">
          Dossier for {destination} ({duration})
        </span>
      </div>

      {/* Grid of 3 Strategic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Route Strategy */}
        <div className="p-4 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#162842]">
              <Compass className="w-4 h-4 text-[#E05A3A]" />
              <span className="uppercase tracking-wider text-[11px]">1. Route Optimization</span>
            </div>
            <p className="text-xs text-[#526685] leading-relaxed">
              {agentNotes.rationale || `Sequence designed to cluster landmarks by neighborhood, minimizing cross-town commutes.`}
            </p>
          </div>
          <div className="pt-2 text-[10px] text-[#162842] font-semibold flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Backtracking Guarantee</span>
          </div>
        </div>

        {/* Pillar 2: Transit Protocol */}
        <div className="p-4 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#162842]">
              <Navigation className="w-4 h-4 text-[#E05A3A]" />
              <span className="uppercase tracking-wider text-[11px]">2. Transit &amp; Mobility</span>
            </div>
            <p className="text-xs text-[#526685] leading-relaxed">
              {agentNotes.transitAdvice || `Use contactless transit cards, local bike rentals, or licensed ride-hailing apps.`}
            </p>
          </div>
          <div className="pt-2 text-[10px] text-[#162842] font-semibold flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Local Mobility</span>
          </div>
        </div>

        {/* Pillar 3: Reservations & Scam Protection */}
        <div className="p-4 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#162842]">
              <ShieldCheck className="w-4 h-4 text-[#E05A3A]" />
              <span className="uppercase tracking-wider text-[11px]">3. Reservation Alerts</span>
            </div>
            <p className="text-xs text-[#526685] leading-relaxed">
              {agentNotes.reservationAlerts || agentNotes.safetyAndScams || `Book popular museum slots and sunset dining in advance.`}
            </p>
          </div>
          <div className="pt-2 text-[10px] text-[#162842] font-semibold flex items-center gap-1 text-amber-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Time-Critical Access</span>
          </div>
        </div>

      </div>
    </div>
  );
}
