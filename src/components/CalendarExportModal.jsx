'use client';

import { useState } from 'react';
import { generateItineraryICS, downloadICSFile } from '@/lib/calendarExport';
import { Calendar as CalendarIcon, Download, X, Check, Clock, MapPin, Sparkles } from 'lucide-react';

export default function CalendarExportModal({ isOpen, onClose, itinerary }) {
  // Default to tomorrow's date or upcoming weekend
  const getDefaultStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [isExported, setIsExported] = useState(false);

  if (!isOpen || !itinerary) return null;

  const totalStops = (itinerary.days || []).reduce((acc, d) => acc + (d.stops?.length || 0), 0);

  const handleDownload = () => {
    const icsString = generateItineraryICS(itinerary, startDate);
    const sanitizedTitle = (itinerary.tripTitle || 'itinerary')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 30);
    downloadICSFile(icsString, `${sanitizedTitle}.ics`);
    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
      onClose();
    }, 2500);
  };

  const formatDateDisplay = (dayIndex) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F0] border border-[#E8E1D5] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-[#162842] space-y-0">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D5] bg-[#F7F4EC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E05A3A] flex items-center justify-center text-white">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#162842]">
                Export to Calendar
              </h3>
              <p className="text-[11px] text-[#526685]">
                Sync all stops to Google Calendar, Apple Calendar, or Outlook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#526685] hover:text-[#162842] hover:bg-[#E8E1D5]/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Trip Summary Card */}
          <div className="p-3.5 rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] space-y-1">
            <h4 className="font-serif text-sm font-bold text-[#162842]">
              {itinerary.tripTitle}
            </h4>
            <div className="flex items-center gap-3 text-xs text-[#526685]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E05A3A]" />
                {itinerary.destination}
              </span>
              <span>•</span>
              <span>{itinerary.duration} ({totalStops} scheduled stops)</span>
            </div>
          </div>

          {/* Start Date Picker */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526685]">
              Trip Departure / Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-[#E8E1D5] bg-[#FDFBF7] text-xs font-semibold text-[#162842] focus:border-[#E05A3A] outline-none"
            />
            <p className="text-[11px] text-[#526685]">
              Stops will automatically be scheduled consecutively across each day starting from this date.
            </p>
          </div>

          {/* Schedule Preview */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
              Schedule Mapping Preview
            </span>
            <div className="max-h-40 overflow-y-auto rounded-md border border-[#E8E1D5] bg-[#FDFBF7] p-2 space-y-1.5">
              {(itinerary.days || []).map((day, idx) => (
                <div
                  key={day.dayNumber}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-[#FAF7F0] border border-[#E8E1D5]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E05A3A]">Day {day.dayNumber}</span>
                    <span className="text-[#162842] font-medium truncate max-w-[180px]">
                      {day.title}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#526685] shrink-0">
                    {formatDateDisplay(idx)} ({day.stops?.length || 0} stops)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility Note */}
          <div className="p-3 rounded-md bg-[#FAECE8] border border-[#E05A3A]/30 text-xs text-[#162842] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#E05A3A] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Universal .ics format:</strong> Double-clicking the exported file opens Apple Calendar on Mac/iOS, or import via <em>Google Calendar Settings → Import & Export</em>.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E8E1D5] bg-[#F7F4EC] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#E8E1D5] text-xs font-semibold text-[#526685] hover:text-[#162842] hover:bg-[#FAF7F0] transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isExported}
            className="px-4 py-2 rounded-md bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isExported ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Downloaded .ics!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download .ics Calendar</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
