'use client';

import { useState } from 'react';
import DayCard from './DayCard';
import RefinementBar from './RefinementBar';
import PackingChecklist from './PackingChecklist';
import BudgetChart from './BudgetChart';
import { CURRENCIES, convertCurrencyString } from '@/lib/currencyConverter';
import { saveTrip } from '@/lib/tripStorage';
import { MapPin, Calendar, RefreshCw, AlertCircle, DollarSign, AlertTriangle, SunMedium, Briefcase, Users, Printer, Share2, Check, Globe, BookmarkPlus, BookmarkCheck } from 'lucide-react';

export default function ItineraryView({ itinerary, onUpdateItinerary, onReset, onTripSaved }) {
  const [isRefining, setIsRefining] = useState(false);
  const [refineNotice, setRefineNotice] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'packing'

  if (!itinerary) return null;

  const handleSaveCurrentTrip = () => {
    const savedId = saveTrip(itinerary);
    if (savedId) {
      setIsSaved(true);
      if (onTripSaved) onTripSaved();
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

  const handleUpdateStops = (dayNumber, newStops) => {
    const updatedDays = itinerary.days.map((day) => {
      if (day.dayNumber === dayNumber) {
        return { ...day, stops: newStops };
      }
      return day;
    });

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays
    });
  };

  const handleRefine = async (instruction) => {
    setIsRefining(true);
    setRefineNotice(null);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentItinerary: itinerary,
          instruction: instruction
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine itinerary.');
      }

      onUpdateItinerary(data.data);
      setRefineNotice(`Refined based on: "${instruction}"`);

      setTimeout(() => setRefineNotice(null), 5000);
    } catch (err) {
      console.error('Refinement error:', err);
      alert(err.message || 'Could not refine itinerary. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleShareTrip = () => {
    const formattedBudget = itinerary.estimatedBudgetPerPax 
      ? convertCurrencyString(itinerary.estimatedBudgetPerPax, currency) 
      : 'N/A';

    let text = `✈️ *${itinerary.tripTitle}*\n`;
    text += `📍 *Destination*: ${itinerary.destination}\n`;
    text += `📅 *Duration*: ${itinerary.duration} (${itinerary.companionType || 'Solo Traveler'})\n`;
    text += `💰 *Est. Budget*: ${formattedBudget}\n\n`;
    text += `📝 *Summary*: ${itinerary.summary}\n\n`;

    itinerary.days.forEach((day) => {
      text += `🗓️ *DAY ${day.dayNumber}: ${day.title.toUpperCase()}*\n`;
      day.stops.forEach((stop) => {
        const costStr = stop.estimatedCost ? ` [${convertCurrencyString(stop.estimatedCost, currency)}]` : '';
        text += `• *${stop.time}* - ${stop.title}${costStr}\n  ${stop.description}\n`;
      });
      text += `\n`;
    });

    text += `🚀 *Planned with Itinera AI*`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 4000);
  };

  const formattedTotalBudget = itinerary.estimatedBudgetPerPax 
    ? convertCurrencyString(itinerary.estimatedBudgetPerPax, currency) 
    : '$350 / person';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Low Budget Warning Banner */}
      {itinerary.isBudgetTooLow && (
        <div className="border border-[#E05A3A]/40 rounded-lg p-4 sm:p-5 flex items-start gap-3 bg-[#FAECE8] text-[#162842] no-print">
          <div className="p-2 rounded-md shrink-0 bg-[#E05A3A]/20 text-[#E05A3A]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-xs sm:text-sm text-[#E05A3A]">
              Advisory: Budget Constraint
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {itinerary.budgetWarning || `The allocated budget may be restrictive for a comprehensive trip to ${itinerary.destination}. Recommended baseline is $50/day per person.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Header Field Dossier Banner in Deep Editorial Blue */}
      <div className="rounded-lg p-6 sm:p-8 space-y-5 border border-[#162842] bg-[#162842] text-[#FAF7F0] shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {itinerary.isMock ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-200 rounded-md text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Curated Sample Archive</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E05A3A]/20 border border-[#E05A3A]/40 text-[#F3785B] rounded-md text-xs font-semibold">
                  <span>Custom Generated Plan</span>
                </div>
              )}

              {/* Companion Type Badge */}
              {itinerary.companionType && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-[#FAF7F0] rounded-md text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-[#F3785B]" />
                  <span>{itinerary.companionType}</span>
                </div>
              )}
            </div>

            {/* Currency Selector & Per-Pax Budget Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-1 rounded-md text-xs no-print">
                <Globe className="w-3.5 h-3.5 text-[#A0B3CC] shrink-0" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-white text-xs font-medium outline-none cursor-pointer"
                >
                  {Object.values(CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code} className="text-[#162842] font-semibold bg-white">
                      {curr.flag} {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              {itinerary.estimatedBudgetPerPax && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E05A3A] text-white rounded-md text-xs font-semibold shadow-xs">
                  <DollarSign className="w-3.5 h-3.5 shrink-0" />
                  <span>Est. Budget: {formattedTotalBudget}</span>
                </div>
              )}
            </div>
          </div>

          {refineNotice && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E05A3A]/20 border border-[#E05A3A]/40 text-[#F3785B] rounded-md text-xs font-medium animate-fadeIn">
              <span>{refineNotice}</span>
            </div>
          )}

          {copiedShare && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 rounded-md text-xs font-medium animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Itinerary summary copied to clipboard!</span>
            </div>
          )}

          {isSaved && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#E05A3A] text-white rounded-md text-xs font-semibold animate-fadeIn shadow-xs">
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Archived to Saved Itineraries</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FAF7F0]">
                {itinerary.tripTitle}
              </h2>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-[#A0B3CC] mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E05A3A] shrink-0" />
                  {itinerary.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E05A3A] shrink-0" />
                  {itinerary.duration}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto self-start sm:self-center no-print">
              {/* Save Trip Button strictly in Coral Orange */}
              <button
                onClick={handleSaveCurrentTrip}
                title="Save itinerary to browser localStorage"
                className="px-3.5 py-2 bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved!' : 'Save Itinerary'}</span>
              </button>

              <button
                onClick={handleShareTrip}
                title="Copy trip text summary"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#FAF7F0] text-xs font-medium rounded-md border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedShare ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={handleExportPDF}
                title="Export or print itinerary to clean PDF"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#FAF7F0] text-xs font-medium rounded-md border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={onReset}
                title="Start a new travel plan"
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#FAF7F0] text-xs font-medium rounded-md border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Plan</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#C4D5E8] pt-3 border-t border-white/15 leading-relaxed">
            {itinerary.summary}
          </p>

          {/* Interactive SVG Budget Chart Block */}
          {itinerary.budgetBreakdown && (
            <BudgetChart 
              budgetBreakdown={itinerary.budgetBreakdown} 
              currency={currency} 
            />
          )}

          {/* Weather & Season Advisor Briefing Bar */}
          {itinerary.weatherAdvisor && (
            <div className="p-4 bg-white/5 rounded-md border border-white/15 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[#F3785B] text-xs">
                <SunMedium className="w-4 h-4 text-[#E05A3A] shrink-0" />
                <span className="uppercase tracking-wider text-[11px]">Seasonal Advisory for {itinerary.destination}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[#FAF7F0]">
                <div>
                  <span className="block text-[10px] text-[#8FA5C2] font-semibold uppercase tracking-wider">Optimal Season</span>
                  <span className="font-medium text-white">{itinerary.weatherAdvisor.bestSeason}</span>
                </div>

                <div>
                  <span className="block text-[10px] text-[#8FA5C2] font-semibold uppercase tracking-wider">Average Temp</span>
                  <span className="font-semibold text-[#F3785B]">{itinerary.weatherAdvisor.averageTemp}</span>
                </div>

                <div>
                  <span className="block text-[10px] text-[#8FA5C2] font-semibold uppercase tracking-wider">Packing Guideline</span>
                  <span className="text-white text-xs leading-tight">{itinerary.weatherAdvisor.packingTip}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content View Switcher Tabs (Itinerary vs Packing List) */}
      <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-3 no-print">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'itinerary'
              ? 'bg-[#162842] text-white border border-[#162842]'
              : 'bg-white text-[#526685] border border-[#E8E1D5] hover:text-[#162842]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Day-by-Day Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'packing'
              ? 'bg-[#162842] text-white border border-[#162842]'
              : 'bg-white text-[#526685] border border-[#E8E1D5] hover:text-[#162842]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Packing Manifest</span>
        </button>
      </div>

      {/* View Content based on activeTab */}
      {activeTab === 'itinerary' ? (
        <>
          {/* AI Refinement Bar Component */}
          <div className="no-print">
            <RefinementBar onRefine={handleRefine} isRefining={isRefining} />
          </div>

          {/* Days Breakdown */}
          <div className="space-y-5 sm:space-y-6">
            {itinerary.days.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                destination={itinerary.destination}
                currency={currency}
                onUpdateStops={handleUpdateStops}
              />
            ))}
          </div>
        </>
      ) : (
        /* Interactive Packing Checklist Component */
        <PackingChecklist
          packingChecklist={itinerary.packingChecklist}
          destination={itinerary.destination}
        />
      )}
    </div>
  );
}
