'use client';

import { useState } from 'react';
import { ArrowRight, Sliders, DollarSign } from 'lucide-react';

const REFINEMENT_PRESETS = [
  "Economy & Budget",
  "Balanced Budget",
  "Comfort & Luxury",
  "Local Culinary Focus",
  "Active Exploration",
  "Relaxed & Leisurely",
  "Scenic & Photography"
];

export default function RefinementBar({ onRefine, isRefining }) {
  const [instruction, setInstruction] = useState('');
  const [targetBudget, setTargetBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRefining) return;
    
    let fullInstruction = instruction.trim();
    if (targetBudget.trim()) {
      fullInstruction = fullInstruction 
        ? `${fullInstruction} (Target budget: $${targetBudget.trim()} per pax)`
        : `Adjust itinerary to target budget of $${targetBudget.trim()} per person`;
    }

    if (!fullInstruction) return;

    onRefine(fullInstruction);
    setInstruction('');
    setTargetBudget('');
  };

  const handleSelectPreset = (presetText) => {
    if (isRefining) return;
    onRefine(`Refine itinerary to: ${presetText}`);
  };

  return (
    <div className="border border-[#E8E1D5] bg-[#FDFBF7] rounded-lg p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[#162842] font-semibold text-sm">
          <Sliders className="w-4 h-4 text-[#E05A3A]" />
          <span className="font-serif">Refine Itinerary &amp; Adjust Budget</span>
        </div>
        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-[#E05A3A]/40 bg-[#FAECE8] text-[#E05A3A]">
          Adjustment Engine
        </span>
      </div>

      <p className="text-xs text-[#526685]">
        Select a calibration guideline or specify tailored adjustments for pace, budget ceiling, or neighborhood dining.
      </p>

      {/* Preset Suggestion Chips */}
      <div className="flex flex-wrap gap-2">
        {REFINEMENT_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            disabled={isRefining}
            className="px-3 py-1 rounded-md text-xs font-medium border border-[#E8E1D5] bg-[#F7F4EC] text-[#162842] hover:border-[#E05A3A] hover:text-[#E05A3A] transition-colors disabled:opacity-50"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Custom Refinement Form with Budget Box */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-1">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Target Budget per Pax Input */}
          <div className="relative sm:w-44">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <DollarSign className="w-4 h-4 text-[#E05A3A]" />
            </div>
            <input
              type="number"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              placeholder="Budget/pax"
              disabled={isRefining}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-md outline-none border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842] placeholder:text-[#8899B0] focus:border-[#E05A3A] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Refinement Prompt Input */}
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. 'Emphasize historical temples on day 2' or 'Add vegetarian dinner recommendations'"
            disabled={isRefining}
            className="flex-1 px-3.5 py-2 text-xs rounded-md outline-none border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842] placeholder:text-[#8899B0] focus:border-[#E05A3A] transition-colors disabled:opacity-50"
          />

          {/* Coral Orange Apply Button */}
          <button
            type="submit"
            disabled={(!instruction.trim() && !targetBudget.trim()) || isRefining}
            className="px-5 py-2 bg-[#E05A3A] hover:bg-[#C94A2D] text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isRefining ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calibrating...</span>
              </>
            ) : (
              <>
                <span>Apply Adjustments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

