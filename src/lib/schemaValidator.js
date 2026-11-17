/**
 * Schema Validator & Normalizer for Travel Planner Itineraries.
 * Includes Packing Checklist, Companion Type, Weather Advisor, Per-Pax Budget Estimation, and Budget Warning handling.
 */

export function validateAndCleanItinerary(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid AI response: Expected a JSON object.');
  }

  const fallbackDays = Array.isArray(data.days) && data.days.length > 0 ? data.days.length : 3;
  const isSouthAsia = typeof data.destination === 'string' && /india|goa|kerala|nepal|sri lanka|bali|thailand/i.test(data.destination);
  const fallbackDaily = isSouthAsia ? 70 : 160;
  const computedFallbackTotal = fallbackDays * fallbackDaily;
  const computedStay = Math.round(computedFallbackTotal * 0.45);
  const computedFood = Math.round(computedFallbackTotal * 0.35);
  const computedAct = Math.max(0, computedFallbackTotal - computedStay - computedFood);

  // Ensure top-level fields exist with sensible fallbacks
  const cleanData = {
    tripTitle: typeof data.tripTitle === 'string' && data.tripTitle.trim() !== '' 
      ? data.tripTitle 
      : 'Custom Travel Itinerary',
    destination: typeof data.destination === 'string' ? data.destination : 'Destination',
    duration: typeof data.duration === 'string' ? data.duration : `${fallbackDays} Days`,
    summary: typeof data.summary === 'string' ? data.summary : 'An itinerary tailored to your preferences.',
    companionType: typeof data.companionType === 'string' && data.companionType.trim() !== ''
      ? data.companionType
      : 'General',
    estimatedBudgetPerPax: typeof data.estimatedBudgetPerPax === 'string' && data.estimatedBudgetPerPax.trim() !== ''
      ? data.estimatedBudgetPerPax
      : `$${computedFallbackTotal} / person`,
    budgetBreakdown: typeof data.budgetBreakdown === 'object' && data.budgetBreakdown !== null
      ? {
          stay: data.budgetBreakdown.stay || `$${computedStay}`,
          food: data.budgetBreakdown.food || `$${computedFood}`,
          activities: data.budgetBreakdown.activities || `$${computedAct}`
        }
      : { stay: `$${computedStay}`, food: `$${computedFood}`, activities: `$${computedAct}` },
    weatherAdvisor: typeof data.weatherAdvisor === 'object' && data.weatherAdvisor !== null
      ? {
          bestSeason: data.weatherAdvisor.bestSeason || 'Spring & Autumn',
          averageTemp: data.weatherAdvisor.averageTemp || '22°C / 72°F',
          packingTip: data.weatherAdvisor.packingTip || 'Comfortable walking shoes & light layers'
        }
      : {
          bestSeason: 'Spring & Autumn',
          averageTemp: '22°C / 72°F',
          packingTip: 'Comfortable walking shoes & light layers'
        },
    packingChecklist: typeof data.packingChecklist === 'object' && data.packingChecklist !== null
      ? {
          documents: Array.isArray(data.packingChecklist.documents) ? data.packingChecklist.documents : ['Passport & Visas', 'Travel Insurance Policy', 'Hotel & Booking Confirmations'],
          clothing: Array.isArray(data.packingChecklist.clothing) ? data.packingChecklist.clothing : ['Comfortable walking shoes', 'Light cotton clothing', 'Weather-appropriate jacket'],
          electronics: Array.isArray(data.packingChecklist.electronics) ? data.packingChecklist.electronics : ['Universal travel adapter', 'Power bank (10,000mAh+)', 'Phone charger & cables'],
          essentials: Array.isArray(data.packingChecklist.essentials) ? data.packingChecklist.essentials : ['High SPF Sunscreen', 'Personal medication & first aid', 'Refillable water bottle']
        }
      : {
          documents: ['Passport & Visas', 'Travel Insurance Policy', 'Hotel & Booking Confirmations'],
          clothing: ['Comfortable walking shoes', 'Light cotton clothing', 'Weather-appropriate jacket'],
          electronics: ['Universal travel adapter', 'Power bank (10,000mAh+)', 'Phone charger & cables'],
          essentials: ['High SPF Sunscreen', 'Personal medication & first aid', 'Refillable water bottle']
        },
    preferences: typeof data.preferences === 'object' && data.preferences !== null
      ? {
          pace: typeof data.preferences.pace === 'string' ? data.preferences.pace : 'Balanced',
          dietary: typeof data.preferences.dietary === 'string' ? data.preferences.dietary : 'None',
          interests: Array.isArray(data.preferences.interests) ? data.preferences.interests : []
        }
      : { pace: 'Balanced', dietary: 'None', interests: [] },
    isBudgetTooLow: Boolean(data.isBudgetTooLow),
    budgetWarning: typeof data.budgetWarning === 'string' ? data.budgetWarning : null,
    accommodations: [],
    curatedDining: [],
    agentNotes: null,
    days: []
  };

  // Validate Curated Accommodations (Hotels, Resorts, Boutiques)
  const rawAccommodations = Array.isArray(data.accommodations) ? data.accommodations : [];
  cleanData.accommodations = rawAccommodations.map((acc, aIdx) => ({
    id: acc.id || `acc-${aIdx + 1}`,
    name: typeof acc.name === 'string' && acc.name.trim() !== '' ? acc.name : `Hotel ${aIdx + 1}`,
    type: typeof acc.type === 'string' ? acc.type : 'Boutique Hotel',
    area: typeof acc.area === 'string' ? acc.area : (cleanData.destination || 'Central Area'),
    priceRange: typeof acc.priceRange === 'string' ? acc.priceRange : '$120 - $180 / night',
    rating: typeof acc.rating === 'string' || typeof acc.rating === 'number' ? String(acc.rating) : '4.7',
    description: typeof acc.description === 'string' ? acc.description : 'Curated stay recommended for comfort, character, and prime location.',
    bestFor: typeof acc.bestFor === 'string' ? acc.bestFor : 'Couples & independent travelers',
    amenities: Array.isArray(acc.amenities) && acc.amenities.length > 0 ? acc.amenities : ['Free Wi-Fi', 'Breakfast', 'Air Conditioning'],
    bookingTip: typeof acc.bookingTip === 'string' ? acc.bookingTip : 'Reserve at least 2-3 weeks in advance for best rates.'
  }));

  // Validate Curated Dining & Restaurants
  const rawDining = Array.isArray(data.curatedDining) ? data.curatedDining : [];
  cleanData.curatedDining = rawDining.map((rest, rIdx) => ({
    id: rest.id || `rest-${rIdx + 1}`,
    name: typeof rest.name === 'string' && rest.name.trim() !== '' ? rest.name : `Restaurant ${rIdx + 1}`,
    cuisine: typeof rest.cuisine === 'string' ? rest.cuisine : 'Local Cuisine',
    area: typeof rest.area === 'string' ? rest.area : (cleanData.destination || 'Downtown'),
    mealType: typeof rest.mealType === 'string' ? rest.mealType : 'Lunch & Dinner',
    priceRange: typeof rest.priceRange === 'string' ? rest.priceRange : '$15 - $30 / person',
    rating: typeof rest.rating === 'string' || typeof rest.rating === 'number' ? String(rest.rating) : '4.8',
    signatureDishes: Array.isArray(rest.signatureDishes) && rest.signatureDishes.length > 0 ? rest.signatureDishes : ['Regional Specialty', 'Chef Selection'],
    ambiance: typeof rest.ambiance === 'string' ? rest.ambiance : 'Warm and authentic local ambiance',
    reservationTip: typeof rest.reservationTip === 'string' ? rest.reservationTip : 'Walk-ins welcome or call ahead during peak dinner hours.'
  }));

  // Validate AI Agent Notes
  cleanData.agentNotes = typeof data.agentNotes === 'object' && data.agentNotes !== null ? {
    rationale: typeof data.agentNotes.rationale === 'string' ? data.agentNotes.rationale : `Strategically sequenced to optimize travel times and capture the best of ${cleanData.destination}.`,
    transitAdvice: typeof data.agentNotes.transitAdvice === 'string' ? data.agentNotes.transitAdvice : 'Local taxis, rideshare apps, and regional transit cards are recommended.',
    safetyAndScams: typeof data.agentNotes.safetyAndScams === 'string' ? data.agentNotes.safetyAndScams : 'Keep valuables secure and verify ticket prices at official vendor booths.',
    reservationAlerts: typeof data.agentNotes.reservationAlerts === 'string' ? data.agentNotes.reservationAlerts : 'Popular landmark entry slots and fine dining reservations fill quickly.'
  } : {
    rationale: `Strategically sequenced to optimize travel times and capture the best of ${cleanData.destination}.`,
    transitAdvice: 'Local taxis, rideshare apps, and regional transit cards are recommended.',
    safetyAndScams: 'Keep valuables secure and verify ticket prices at official vendor booths.',
    reservationAlerts: 'Popular landmark entry slots and fine dining reservations fill quickly.'
  };

  // Validate days array
  const rawDays = Array.isArray(data.days) ? data.days : [];
  
  if (rawDays.length === 0) {
    throw new Error('Invalid AI response: No daily schedule found in the generated output.');
  }

  cleanData.days = rawDays.map((day, dIdx) => {
    const dayNumber = typeof day.dayNumber === 'number' ? day.dayNumber : dIdx + 1;
    const title = typeof day.title === 'string' && day.title.trim() !== '' 
      ? day.title 
      : `Day ${dayNumber}`;
      
    const rawStops = Array.isArray(day.stops) ? day.stops : [];
    
    const stops = rawStops.map((stop, sIdx) => {
      return {
        id: stop.id || `day-${dayNumber}-stop-${sIdx + 1}-${Math.random().toString(36).substr(2, 5)}`,
        title: typeof stop.title === 'string' && stop.title.trim() !== '' 
          ? stop.title 
          : `Activity ${sIdx + 1}`,
        time: typeof stop.time === 'string' && stop.time.trim() !== '' 
          ? stop.time 
          : 'Flexible Time',
        description: typeof stop.description === 'string' 
          ? stop.description 
          : 'Enjoy exploring this spot.',
        category: typeof stop.category === 'string' ? stop.category : 'General',
        location: typeof stop.location === 'string' ? stop.location : '',
        estimatedCost: typeof stop.estimatedCost === 'string' ? stop.estimatedCost : 'Free'
      };
    });

    return {
      dayNumber,
      title,
      stops
    };
  });

  return cleanData;
}
