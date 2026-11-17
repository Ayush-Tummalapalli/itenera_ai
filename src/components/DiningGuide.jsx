'use client';

import { useState } from 'react';
import { convertCurrencyString } from '@/lib/currencyConverter';
import { Utensils, Star, MapPin, ExternalLink, Sparkles, Coffee, Clock, Heart, ChefHat } from 'lucide-react';

export default function DiningGuide({ curatedDining, destination, currency = 'USD' }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'DINNER' | 'LUNCH' | 'BREAKFAST'

  if (!curatedDining || curatedDining.length === 0) {
    return null;
  }

  const filtered = curatedDining.filter(rest => {
    if (filterType === 'ALL') return true;
    const mealLower = (rest.mealType || '').toLowerCase();
    if (filterType === 'DINNER') return mealLower.includes('dinner') || mealLower.includes('cocktail') || mealLower.includes('evening');
    if (filterType === 'LUNCH') return mealLower.includes('lunch') || mealLower.includes('afternoon') || mealLower.includes('midday');
    if (filterType === 'BREAKFAST') return mealLower.includes('breakfast') || mealLower.includes('brunch') || mealLower.includes('café') || mealLower.includes('morning');
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Header Banner */}
      <div className="p-5 sm:p-6 rounded-lg border border-[#162842] bg-[#162842] text-[#FAF7F0] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#E05A3A] text-white flex items-center justify-center shadow-sm">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#F3785B] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <ChefHat className="w-3 h-3" />
                <span>AI Travel Agent Culinary Curation</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#FAF7F0]">
                Iconic Restaurants &amp; Food Gems in {destination}
              </h3>
            </div>
          </div>

          <span className="text-[11px] px-3 py-1 rounded bg-white/10 text-[#FAF7F0] border border-white/20 font-medium">
            {curatedDining.length} Curated Culinary Picks
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#C4D5E8] leading-relaxed">
          The AI Travel Agent selected these authentic dining establishments, historic taverns, and breakfast cafés based on local chef consensus, signature regional specialties, and ambiance.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-[#8FA5C2] font-semibold mr-1">
            Category:
          </span>
          {[
            { id: 'ALL', label: 'All Dining' },
            { id: 'DINNER', label: '🍷 Iconic Dinners' },
            { id: 'LUNCH', label: '🍛 Authentic Lunches' },
            { id: 'BREAKFAST', label: '☕ Breakfast & Cafés' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-[#E05A3A] text-white'
                  : 'bg-white/10 text-[#FAF7F0] hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((rest, idx) => {
          const formattedPrice = convertCurrencyString(rest.priceRange || '$20 / person', currency);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.name + ' ' + (rest.area || destination))}`;

          return (
            <div
              key={rest.id || idx}
              className="rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] p-5 flex flex-col justify-between space-y-4 hover:border-[#162842] transition-all hover:shadow-md group"
            >
              <div className="space-y-3">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E05A3A]/10 text-[#E05A3A] border border-[#E05A3A]/20">
                    {rest.mealType || 'Dining Pick'}
                  </span>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-900 border border-amber-400/30 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{rest.rating || '4.8'}</span>
                  </div>
                </div>

                {/* Name & Cuisine */}
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#162842] group-hover:text-[#E05A3A] transition-colors leading-snug">
                    {rest.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#526685] mt-1 flex-wrap gap-2">
                    <span className="font-medium text-[#162842]">{rest.cuisine}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#E05A3A]" />
                      {rest.area || destination}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-2.5 rounded bg-[#FAF7F0] border border-[#E8E1D5] flex items-center justify-between">
                  <span className="text-[11px] text-[#526685] font-medium">Est. Cost Per Person</span>
                  <span className="font-serif text-sm font-bold text-[#162842]">
                    {formattedPrice}
                  </span>
                </div>

                {/* Signature Dishes */}
                {rest.signatureDishes && rest.signatureDishes.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#526685]">
                      🍽️ Must-Try Signature Dishes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rest.signatureDishes.map((dish, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2.5 py-1 rounded-md text-[11px] bg-white border border-[#E8E1D5] text-[#162842] font-medium shadow-2xs"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ambiance */}
                {rest.ambiance && (
                  <p className="text-xs text-[#526685] italic pt-1 leading-relaxed">
                    &ldquo;{rest.ambiance}&rdquo;
                  </p>
                )}
              </div>

              {/* Card Footer: Reservation Tip & Maps Link */}
              <div className="pt-3 border-t border-[#E8E1D5] space-y-3">
                {rest.reservationTip && (
                  <div className="text-[11px] text-[#526685] bg-[#F7F4EC] p-2.5 rounded border border-[#E8E1D5]/60 flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E05A3A] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#162842]">Reservation Intel:</strong> {rest.reservationTip}
                    </span>
                  </div>
                )}

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#162842] hover:bg-[#E05A3A] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Locate &amp; View Menu on Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
