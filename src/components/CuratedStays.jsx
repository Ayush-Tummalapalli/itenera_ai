'use client';

import { useState } from 'react';
import { convertCurrencyString } from '@/lib/currencyConverter';
import { Hotel, Star, MapPin, ExternalLink, Sparkles, Bed, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

export default function CuratedStays({ accommodations, destination, currency = 'USD' }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'LUXURY' | 'BOUTIQUE' | 'VALUE'

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  const filtered = accommodations.filter(acc => {
    if (filterType === 'ALL') return true;
    const typeLower = (acc.type || '').toLowerCase();
    if (filterType === 'LUXURY') return typeLower.includes('luxury') || typeLower.includes('resort') || typeLower.includes('palace') || typeLower.includes('5-star');
    if (filterType === 'BOUTIQUE') return typeLower.includes('boutique') || typeLower.includes('heritage') || typeLower.includes('inn') || typeLower.includes('mansion');
    if (filterType === 'VALUE') return typeLower.includes('value') || typeLower.includes('social') || typeLower.includes('hostel') || typeLower.includes('design');
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Header */}
      <div className="p-5 sm:p-6 rounded-lg border border-[#162842] bg-[#162842] text-[#FAF7F0] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#E05A3A] text-white flex items-center justify-center shadow-sm">
              <Hotel className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#F3785B] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>AI Travel Agent Curated Dossier</span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#FAF7F0]">
                Curated Accommodations &amp; Stays in {destination}
              </h3>
            </div>
          </div>

          <span className="text-[11px] px-3 py-1 rounded bg-white/10 text-[#FAF7F0] border border-white/20 font-medium">
            {accommodations.length} Selected Stays
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#C4D5E8] leading-relaxed">
          Your AI Travel Agent analyzed neighborhood safety, walkability, authentic local design, and review consensus to autonomously curate these premier stays for your travel party.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-[#8FA5C2] font-semibold mr-1">
            Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Stays' },
            { id: 'LUXURY', label: '✨ Luxury & Resorts' },
            { id: 'BOUTIQUE', label: '🌿 Charming Boutique' },
            { id: 'VALUE', label: '⚡ Smart Value' }
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

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((hotel, idx) => {
          const formattedPrice = convertCurrencyString(hotel.priceRange || '$150 / night', currency);
          const searchUrl = `https://www.google.com/travel/search?q=${encodeURIComponent(hotel.name + ' ' + (hotel.area || destination))}`;

          return (
            <div
              key={hotel.id || idx}
              className="rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] p-5 flex flex-col justify-between space-y-4 hover:border-[#162842] transition-all hover:shadow-md group"
            >
              <div className="space-y-3">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#162842]/10 text-[#162842] border border-[#162842]/20">
                    {hotel.type || 'Curated Stay'}
                  </span>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-900 border border-amber-400/30 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{hotel.rating || '4.8'}</span>
                  </div>
                </div>

                {/* Hotel Name */}
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#162842] group-hover:text-[#E05A3A] transition-colors leading-snug">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#526685] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E05A3A] shrink-0" />
                    <span className="truncate">{hotel.area || destination}</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-2.5 rounded bg-[#FAF7F0] border border-[#E8E1D5] flex items-center justify-between">
                  <span className="text-[11px] text-[#526685] font-medium">Est. Nightly Rate</span>
                  <span className="font-serif text-sm font-bold text-[#162842]">
                    {formattedPrice}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#526685] leading-relaxed line-clamp-3">
                  {hotel.description}
                </p>

                {/* Best For Tag */}
                {hotel.bestFor && (
                  <div className="text-[11px] text-[#162842] bg-[#E8E1D5]/40 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                    <span className="font-semibold text-[10px] uppercase tracking-wider text-[#526685]">Ideal For:</span>
                    <span className="truncate font-medium">{hotel.bestFor}</span>
                  </div>
                )}

                {/* Amenities Badges */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities.slice(0, 4).map((amenity, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#E8E1D5] text-[#526685] font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Agent Booking Tip & Search Button */}
              <div className="pt-3 border-t border-[#E8E1D5] space-y-3">
                {hotel.bookingTip && (
                  <div className="text-[11px] text-[#526685] bg-[#F7F4EC] p-2.5 rounded border border-[#E8E1D5]/60 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E05A3A] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#162842]">Agent Tip:</strong> {hotel.bookingTip}
                    </span>
                  </div>
                )}

                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#162842] hover:bg-[#E05A3A] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Check Availability &amp; Rates</span>
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
