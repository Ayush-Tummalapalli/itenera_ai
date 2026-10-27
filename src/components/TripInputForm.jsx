'use client';

import { useState } from 'react';
import { ArrowRight, Compass, SlidersHorizontal, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

const PRESET_PROMPTS = [
  { label: 'Tokyo (3 Days)', prompt: '3 days in Tokyo exploring culture & street food' },
  { label: 'Paris (Weekend)', prompt: 'Weekend getaway to Paris with museum highlights' },
  { label: 'Kerala (4 Days)', prompt: '4 days in Kerala exploring backwaters, tea gardens & culture' },
  { label: 'Rome (4 Days)', prompt: '4 days in Rome exploring historical sights' },
  { label: 'Goa (5 Days)', prompt: '5-day relaxing beach & heritage trip to Goa' }
];

const COMPANION_OPTIONS = [
  { label: 'Solo Traveler', value: 'Solo Traveler' },
  { label: 'Couple / Romantic', value: 'Couple / Romantic' },
  { label: 'Family with Kids', value: 'Family with Kids' },
  { label: 'Group of Friends', value: 'Group of Friends' }
];

const CURATED_INSPIRATIONS = [
  { label: 'Tokyo', sub: '3 Days', prompt: '3 days in Tokyo exploring culture & food', companion: 'Family with Kids' },
  { label: 'Kerala', sub: '4 Days', prompt: '4 days in Kerala backwaters & tea gardens', companion: 'Couple / Romantic' },
  { label: 'Paris', sub: 'Weekend', prompt: 'Weekend trip to Paris romantic highlights', companion: 'Couple / Romantic' },
  { label: 'Goa', sub: '5 Days', prompt: '5-day beach & heritage trip to Goa', companion: 'Group of Friends' },
  { label: 'Rome', sub: '4 Days', prompt: '4 days in Rome exploring historical sights', companion: 'Solo Traveler' }
];

const PACE_OPTIONS = [
  { value: 'Relaxed', label: '🌿 Relaxed (2-3 stops/day)', desc: 'Leisurely & unhurried' },
  { value: 'Balanced', label: '⚖️ Balanced (3-4 stops/day)', desc: 'Optimal rhythm' },
  { value: 'Packed', label: '⚡ Fast-Paced (4-5 stops/day)', desc: 'High energy & comprehensive' }
];

const DIETARY_OPTIONS = [
  { value: 'None', label: 'Any / No Restriction' },
  { value: 'Vegetarian', label: '🥗 Vegetarian' },
  { value: 'Vegan', label: '🌱 100% Vegan' },
  { value: 'Halal', label: '🥩 Halal Certified' },
  { value: 'Gluten-Free', label: '🌾 Gluten-Free' }
];

const INTEREST_TAGS = [
  '🏛️ History & Heritage',
  '🍜 Street Food & Dining',
  '🎨 Art & Museums',
  '🌲 Nature & Scenic Walks',
  '📸 Photography Spots',
  '🛍️ Local Flea Markets',
  '🌙 Evening Bars & Nightlife',
  '💎 Hidden Gems & Offbeat'
];

export default function TripInputForm({ onSubmit, onInstantDemo, isLoading }) {
  const [prompt, setPrompt] = useState('');
  const [companionType, setCompanionType] = useState('Solo Traveler');
  const [showPreferences, setShowPreferences] = useState(false);
  const [pace, setPace] = useState('Balanced');
  const [dietary, setDietary] = useState('None');
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (tag) => {
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getPreferencesObject = () => ({
    pace,
    dietary,
    interests: selectedInterests
  });

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim(), companionType, getPreferencesObject());
  };

  const handleSelectPreset = (presetText) => {
    setPrompt(presetText);
    onSubmit(presetText, companionType, getPreferencesObject());
  };

  // Count active customizations
  let activePreferencesCount = 0;
  if (pace !== 'Balanced') activePreferencesCount++;
  if (dietary !== 'None') activePreferencesCount++;
  activePreferencesCount += selectedInterests.length;

  return (
    <div className="rounded-lg p-5 sm:p-7 border border-[#E8E1D5] bg-[#FDFBF7] space-y-6">
      
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
              onClick={() => onInstantDemo(demo.prompt, demo.companion, getPreferencesObject())}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#E8E1D5] bg-[#FDFBF7] text-[#162842] hover:border-[#E05A3A] hover:text-[#E05A3A] flex items-center justify-between sm:justify-center gap-2 transition-colors disabled:opacity-50"
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

      {/* Advanced Customization Accordion (Pace, Dietary, Interests) */}
      <div className="border border-[#E8E1D5] rounded-md overflow-hidden bg-[#FAF7F0]">
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="w-full px-4 py-3 flex items-center justify-between text-left bg-[#FAF7F0] hover:bg-[#F7F4EC] transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E05A3A]" />
            <span className="text-xs font-semibold text-[#162842]">
              Advanced Preferences (Pace, Dietary &amp; Interests)
            </span>
            {activePreferencesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E05A3A] text-white">
                {activePreferencesCount} Active
              </span>
            )}
          </div>
          <div className="text-[#526685]">
            {showPreferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showPreferences && (
          <div className="p-4 pt-3 border-t border-[#E8E1D5] bg-[#FDFBF7] space-y-4 animate-fadeIn">
            
            {/* Travel Pace */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#526685]">
                Travel Rhythm &amp; Pace
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PACE_OPTIONS.map((p) => {
                  const isSelected = pace === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPace(p.value)}
                      className={`p-2.5 rounded-md border text-left transition-colors ${
                        isSelected
                          ? 'border-[#162842] bg-[#162842] text-white'
                          : 'border-[#E8E1D5] bg-[#FAF7F0] text-[#162842] hover:border-[#162842]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{p.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-[#C4D5E8]' : 'text-[#526685]'}`}>
                        {p.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dietary Constraints */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#526685]">
                Dietary &amp; Culinary Restrictions
              </label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {DIETARY_OPTIONS.map((d) => {
                  const isSelected = dietary === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDietary(d.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'border-[#E05A3A] bg-[#FAECE8] text-[#E05A3A] font-semibold'
                          : 'border-[#E8E1D5] bg-[#FAF7F0] text-[#162842] hover:border-[#162842]'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Interests */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#526685]">
                Core Interests &amp; Themes (Select multiple)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INTEREST_TAGS.map((tag) => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#162842] bg-[#162842] text-white'
                          : 'border-[#E8E1D5] bg-[#FAF7F0] text-[#526685] hover:border-[#162842] hover:text-[#162842]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#F3785B]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Travel Query Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#526685]">
            Journey Details &amp; Destination
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Where do you wish to journey as a ${companionType}? (e.g. '4 days in Kerala backwaters' or 'Tokyo street food')`}
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
                onClick={() => handleSelectPreset(preset.prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded border border-[#E8E1D5] text-[11px] text-[#526685] hover:text-[#162842] hover:border-[#E05A3A] transition-colors disabled:opacity-50 font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Generate Itinerary Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#E05A3A] hover:bg-[#C94A2D] text-white font-semibold text-xs sm:text-sm rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
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
