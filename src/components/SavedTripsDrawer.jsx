'use client';

import { X, MapPin, Calendar, Users, Trash2, ArrowRight, Bookmark, Compass } from 'lucide-react';

export default function SavedTripsDrawer({ isOpen, onClose, savedTrips, onLoadTrip, onDeleteTrip }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#162842]/60 transition-opacity" 
      />

      {/* Side Drawer Modal */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l flex flex-col bg-[#FAF7F0] border-[#E8E1D5] text-[#162842]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E1D5] bg-[#F7F4EC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#FAECE8] flex items-center justify-center text-[#E05A3A]">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-base leading-none text-[#162842]">
                  Saved Itineraries
                </h3>
                <span className="text-[10px] text-[#E05A3A] font-semibold tracking-wide uppercase">
                  {savedTrips.length} {savedTrips.length === 1 ? 'dossier' : 'dossiers'} archived
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md border bg-[#FDFBF7] border-[#E8E1D5] hover:bg-[#F3EFE6] text-[#162842] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {savedTrips.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#FAECE8] border border-[#E05A3A]/30 text-[#E05A3A] flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-semibold text-base text-[#162842]">No Saved Itineraries Yet</h4>
                <p className="text-xs max-w-xs mx-auto leading-relaxed text-[#526685]">
                  Curate any itinerary and click the <strong className="text-[#E05A3A]">&quot;Save Itinerary&quot;</strong> button to archive your plans here for easy retrieval.
                </p>
              </div>
            ) : (
              savedTrips.map((trip) => (
                <div
                  key={trip.savedId}
                  className="p-4 rounded-lg border bg-[#FDFBF7] border-[#E8E1D5] hover:border-[#E05A3A]/60 space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#E05A3A] tracking-wider block mb-0.5">
                        Saved {trip.savedAt || 'Recently'}
                      </span>
                      <h4 className="font-serif font-semibold text-base leading-snug text-[#162842]">
                        {trip.tripTitle}
                      </h4>
                    </div>

                    <button
                      onClick={() => onDeleteTrip(trip.savedId)}
                      title="Delete saved itinerary"
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs flex-wrap text-[#526685]">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#E05A3A]" />
                      {trip.destination}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#162842]" />
                      {trip.duration}
                    </span>
                    {trip.companionType && (
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#162842]" />
                        {trip.companionType}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E8E1D5]/60 flex justify-end">
                    <button
                      onClick={() => {
                        onLoadTrip(trip);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
                    >
                      <span>Load Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

