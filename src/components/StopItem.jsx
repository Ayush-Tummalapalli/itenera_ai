'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown, MapPin, Clock, ExternalLink } from 'lucide-react';
import { convertCurrencyString } from '@/lib/currencyConverter';

export default function StopItem({ stop, isFirst, isLast, onMoveUp, onMoveDown, onDelete, destination, currency = 'USD' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const mapSearchQuery = encodeURIComponent(`${stop.title} ${stop.location || ''} ${destination || ''}`.trim());
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  const formattedCost = stop.estimatedCost ? convertCurrencyString(stop.estimatedCost, currency) : null;

  return (
    <div className="group rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] p-4 sm:p-5 hover:border-[#E05A3A]/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* Main Content Area */}
        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs font-medium px-2 py-0.5 rounded border border-[#E8E1D5] bg-[#F7F4EC] text-[#526685] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#526685]" />
              {stop.time}
            </span>

            {stop.category && (
              <span className="text-xs font-medium px-2 py-0.5 rounded border border-[#E8E1D5] bg-[#F7F4EC] text-[#162842]">
                {stop.category}
              </span>
            )}

            {formattedCost && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-[#FAECE8] text-[#E05A3A] border-[#E05A3A]/40">
                {formattedCost}
              </span>
            )}
          </div>

          <h4 className="font-semibold text-base text-[#162842] group-hover:text-[#E05A3A] transition-colors">
            {stop.title}
          </h4>

          {/* Clickable Google Maps Location Link */}
          {stop.location && (
            <div className="mt-1" onClick={(e) => e.stopPropagation()}>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#E05A3A] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E05A3A]" />
                <span>{stop.location}</span>
                <ExternalLink className="w-3 h-3 text-[#E05A3A]" />
              </a>
            </div>
          )}
        </div>

        {/* Action buttons: Reorder, Delete, Toggle Expand */}
        <div className="flex items-center gap-0.5 p-1 rounded-md border border-[#E8E1D5] bg-[#F7F4EC]">
          <button
            onClick={() => onMoveUp(stop.id)}
            disabled={isFirst}
            title="Move Up"
            className="p-1 text-stone-400 hover:text-[#162842] disabled:opacity-20 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onMoveDown(stop.id)}
            disabled={isLast}
            title="Move Down"
            className="p-1 text-stone-400 hover:text-[#162842] disabled:opacity-20 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(stop.id)}
            title="Remove Activity"
            className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="p-1 text-stone-400 hover:text-[#162842] transition-colors ml-1 border-l border-[#E8E1D5]"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Description Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#E8E1D5] bg-[#F7F4EC]/60 text-[#3B4D66] text-sm p-3.5 rounded-md animate-fadeIn space-y-2.5">
          <p className="leading-relaxed text-xs sm:text-sm">{stop.description}</p>

          <div className="pt-1">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#FAECE8] text-[#E05A3A] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E05A3A]" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-[#E05A3A]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

