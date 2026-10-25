'use client';

import { AlertTriangle, RefreshCw, Compass } from 'lucide-react';

export default function ErrorAlert({ message, onRetry, onUseMock }) {
  return (
    <div className="bg-[#FAECE8] border border-[#E05A3A]/40 rounded-lg p-5 text-[#162842] space-y-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#E05A3A]/20 rounded-md text-[#E05A3A]">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold text-sm text-[#E05A3A]">
            Dossier Generation Notice
          </h3>
          <p className="text-xs sm:text-sm text-[#3B4D66] leading-relaxed">
            {message || 'The itinerary generator could not reach the server or returned an incomplete response.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E05A3A]/20">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Generation</span>
        </button>

        {onUseMock && (
          <button
            onClick={onUseMock}
            className="px-4 py-2 bg-white hover:bg-[#F7F4EC] text-[#162842] border border-[#E8E1D5] text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#E05A3A]" />
            <span>Load Curated Sample Archive</span>
          </button>
        )}
      </div>
    </div>
  );
}

