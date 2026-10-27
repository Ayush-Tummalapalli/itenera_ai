'use client';

import { useState, useEffect } from 'react';
import TripInputForm from '@/components/TripInputForm';
import ItineraryView from '@/components/ItineraryView';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import SavedTripsDrawer from '@/components/SavedTripsDrawer';
import TravelConciergeChat from '@/components/TravelConciergeChat';
import Footer from '@/components/Footer';
import LegalModal from '@/components/LegalModal';
import { getMockItinerary } from '@/lib/mockItinerary';
import { getSavedTrips, deleteSavedTrip } from '@/lib/tripStorage';
import { Bookmark } from 'lucide-react';

export default function Home() {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState('');
  const [lastCompanion, setLastCompanion] = useState('Solo Traveler');
  const [lastPreferences, setLastPreferences] = useState({ pace: 'Balanced', dietary: 'None', interests: [] });
  const [savedTrips, setSavedTrips] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState(null);

  useEffect(() => {
    try {
      localStorage.removeItem('itinera_theme');
      localStorage.removeItem('flam_theme');
    } catch (e) {
      // Ignore in non-browser or sandbox environments
    }
    // Load saved trips from localStorage
    setSavedTrips(getSavedTrips());
  }, []);

  const refreshSavedTrips = () => {
    setSavedTrips(getSavedTrips());
  };

  const handleDeleteSavedTrip = (savedId) => {
    const updated = deleteSavedTrip(savedId);
    setSavedTrips(updated);
  };

  const handleLoadSavedTrip = (savedItinerary) => {
    setItinerary(savedItinerary);
  };

  const handleInstantDemo = (promptText, companion, preferences = {}) => {
    setError(null);
    setLastPrompt(promptText);
    setLastCompanion(companion);
    setLastPreferences(preferences);
    const demoData = getMockItinerary(promptText, null, companion, preferences);
    setItinerary(demoData);
  };

  const generateItinerary = async (prompt, companionType = 'Solo Traveler', preferences = {}) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);
    setLastCompanion(companionType);
    setLastPreferences(preferences);

    try {
      const savedKey = typeof window !== 'undefined' ? (localStorage.getItem('itinera_gemini_key') || '') : '';
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(savedKey ? { 'x-gemini-key': savedKey } : {})
        },
        body: JSON.stringify({ prompt, companionType, preferences, apiKey: savedKey }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate itinerary. Please try again.');
      }

      setItinerary(data.data);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPrompt) {
      generateItinerary(lastPrompt, lastCompanion, lastPreferences);
    }
  };

  const handleUseMock = () => {
    setError(null);
    const mockData = getMockItinerary(lastPrompt || 'Sample Trip', null, lastCompanion, lastPreferences);
    setItinerary(mockData);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF7F0] text-[#162842]">
      {/* Editorial Masthead Header */}
      <header className="border-b sticky top-0 z-40 bg-[#FAF7F0] border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#162842] flex items-center justify-center text-[#FAF7F0] font-serif font-bold text-sm">
              I
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold tracking-wider leading-none uppercase text-[#162842]">
                Itinera
              </h1>
              <span className="text-[10px] uppercase font-medium tracking-widest text-[#526685]">
                Curated Field Planner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Saved Itineraries Drawer Trigger in Coral Orange */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-3.5 py-1.5 rounded-md border border-[#E05A3A]/40 bg-[#FDFBF7] text-[#E05A3A] hover:bg-[#FAECE8] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#E05A3A]" />
              <span className="hidden sm:inline">Saved Itineraries</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#E05A3A] text-white">
                {savedTrips.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Saved Trips Side Drawer */}
      <SavedTripsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedTrips={savedTrips}
        onLoadTrip={handleLoadSavedTrip}
        onDeleteTrip={handleDeleteSavedTrip}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 pt-10 sm:pt-14 pb-12 w-full space-y-8">
        {/* Intro Tagline */}
        {!itinerary && !isLoading && (
          <div className="max-w-2xl space-y-3 mb-2">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#526685]">
              Bespoke Travel Dossiers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#162842]">
              Plan your journey with intentional clarity.
            </h2>
            <p className="text-sm leading-relaxed text-[#526685] max-w-xl">
              Specify your destination, pace, dietary preferences, and travel party. Itinera formats an authentic day-by-day field guide tailored to your budget and interests.
            </p>
          </div>
        )}

        {/* Input Form with Advanced Preferences */}
        <TripInputForm
          onSubmit={generateItinerary}
          onInstantDemo={handleInstantDemo}
          isLoading={isLoading}
        />

        {/* Error State */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={handleRetry}
            onUseMock={handleUseMock}
          />
        )}

        {/* Loading State for Generating Itinerary */}
        {isLoading && <LoadingSkeleton />}

        {/* Generated Itinerary Display */}
        {itinerary && !isLoading && (
          <ItineraryView
            itinerary={itinerary}
            onUpdateItinerary={setItinerary}
            onReset={() => setItinerary(null)}
            onTripSaved={refreshSavedTrips}
          />
        )}
      </main>

      {/* 24/7 AI Travel Concierge Assistant */}
      <TravelConciergeChat itinerary={itinerary} />

      {/* Structured Legal & Editorial Footer */}
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Legal Documentation Modal */}
      <LegalModal
        isOpen={Boolean(legalModalType)}
        onClose={() => setLegalModalType(null)}
        type={legalModalType}
      />
    </div>
  );
}
