'use client';

import { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';

const PRESET_PROMPTS = [
  "3 days in Tokyo exploring culture & street food",
  "Weekend getaway to Paris with museum highlights",
  "5-day relaxing beach & heritage trip to Goa",
  "4 days in Rome exploring historical sights"
];

const COMPANION_OPTIONS = [
  { label: 'Solo Traveler', value: 'Solo Traveler' },
  { label: 'Couple / Romantic', value: 'Couple / Romantic' },
  { label: 'Family with Kids', value: 'Family with Kids' },
  { label: 'Group of Friends', value: 'Group of Friends' }
];

const CURATED_INSPIRATIONS = [
  { label: 'Tokyo', sub: '3 Days', prompt: '3 days in Tokyo exploring culture & food', companion: 'Family with Kids' },
  { label: 'Paris', sub: 'Weekend', prompt: 'Weekend trip to Paris romantic highlights', companion: 'Couple / Romantic' },
  { label: 'Goa', sub: '5 Days', prompt: '5-day beach & heritage trip to Goa', companion: 'Group of Friends' },
  { label: 'Rome', sub: '4 Days', prompt: '4 days in Rome exploring historical sights', companion: 'Solo Traveler' }
];

export default function TripInputForm({ onSubmit, onInstantDemo, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [companionType, setCompanionType] = useState('Solo Traveler');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt, companionType);
  };

  const handleSelectPreset = (presetText) => {
    setPrompt(presetText);
    onSubmit(presetText, companionType);
  };

  return (
    <div className="rounded-lg p-5 sm:p-7 border border-[#E8E1D5] bg-white space-y-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      
      {/* Curated Inspirations Bar */}
      <div className="p-4 rounded-md border border-[#E8E1D5] bg-[#F7F4EC] space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#162842]" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#162842]">
              Curated Field Inspirations
            </span>
          </div>
          <span className="text-[10px] text-[#526685] uppercase tracking-widest font-medium">
            Select to sample
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-1">
          {CURATED_INSPIRATIONS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInstantDemo(demo.prompt, demo.companion)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#E8E1D5] bg-white text-[#162842] hover:border-[#E05A3A] hover:text-[#E05A3A] flex items-center justify-between sm:justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{demo.label}</span>
              <span className="text-[10px] text-[#526685] font-normal">({demo.sub})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Companion Filter Selector */}
      <div className="space-y-2">
        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#526685]">
          Travel Party / Companions
        </label>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {COMPANION_OPTIONS.map((option) => {
            const isSelected = companionType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setCompanionType(option.value)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors text-center ${
                  isSelected
                    ? 'bg-[#162842] text-[#FAF7F0] border-[#162842]'
                    : 'bg-[#FDFBF7] text-[#162842] border-[#E8E1D5] hover:border-[#162842]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Travel Query Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#526685]">
            Journey Details &amp; Interests
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Where do you wish to journey as a ${companionType}? (e.g. '4 days in Kyoto focusing on traditional gardens, quiet tea houses, and local transit...')`}
            rows={3}
            disabled={isLoading}
            className="w-full px-3.5 py-3 border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842] placeholder:text-[#8899B0] rounded-md outline-none resize-none text-sm transition-colors focus:border-[#E05A3A] disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-[11px] text-[#526685] font-medium">
              Examples:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className="px-2 py-0.5 rounded border border-[#E8E1D5] text-[11px] text-[#526685] hover:text-[#162842] hover:border-[#E05A3A] transition-colors disabled:opacity-50"
              >
                {preset.split(' ')[2]} {preset.split(' ')[3]}
              </button>
            ))}
          </div>

          {/* Generate Itinerary Button strictly in Coral Orange */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#E05A3A] hover:bg-[#C94A2D] text-white font-semibold text-xs sm:text-sm rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-xs"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Formulating Dossier...</span>
              </>
            ) : (
              <>
                <span>Curate Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

