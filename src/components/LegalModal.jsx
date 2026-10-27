'use client';

import { X } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#162842]/60 transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#FAF7F0] border border-[#E8E1D5] rounded-lg p-6 sm:p-8 space-y-6 text-[#162842]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#E05A3A] font-semibold">
                Legal Documentation
              </span>
              <h2 className="font-serif text-2xl font-normal mt-0.5 text-[#162842]">
                {isTerms ? 'Terms of Service' : 'Privacy Policy'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md border border-[#E8E1D5] bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#162842] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#3B4D66] max-h-[60vh] overflow-y-auto pr-2">
            {isTerms ? (
              <>
                <p>
                  <strong>1. Acceptance of Terms:</strong> By accessing and utilizing Itinera AI (&quot;the Service&quot;), you agree to be bound by these terms. This travel planning service provides curated itinerary recommendations generated via algorithmic synthesis.
                </p>
                <p>
                  <strong>2. Nature of Recommendations:</strong> Itinerary suggestions, operating hours, estimated costs, and travel durations are provided for informational orientation only. Travelers are advised to independently verify visa requirements, local advisories, and booking confirmations prior to departure.
                </p>
                <p>
                  <strong>3. Intellectual Property &amp; Usage:</strong> You retain ownership of all customized travel plans generated for personal, non-commercial use. Automated scraping or reverse-engineering of the recommendation engine is strictly prohibited.
                </p>
                <p>
                  <strong>4. Limitation of Liability:</strong> Itinera AI assumes no liability for missed transit connections, weather disruptions, or booking discrepancies incurred during personal travel.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>1. Data Minimization:</strong> Itinera AI operates on a privacy-first principle. Your travel prompts and companion preferences are processed strictly to formulate your itinerary and are not sold to third-party travel brokers.
                </p>
                <p>
                  <strong>2. Local Storage Persistence:</strong> Saved itineraries and theme preferences are stored directly on your personal device using browser LocalStorage. You may inspect or erase saved plans at any time via the Saved Trips console.
                </p>
                <p>
                  <strong>3. Third-Party Integrations:</strong> Location queries opened in external map services (such as Google Maps) adhere to their respective privacy standards. No personal identity data is transmitted in map location queries.
                </p>
                <p>
                  <strong>4. Policy Inquiries:</strong> For inquiries regarding data practices or itinerary deletion, contact the project maintainers via the public code repository.
                </p>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#E8E1D5] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#162842] hover:bg-[#223C5E] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
