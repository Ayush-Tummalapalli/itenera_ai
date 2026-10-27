/**
 * Dynamic Smart Itinerary Generator with Rich Real-World Locations, Packing Checklist, Companion Filters, Per-Pax Budget & Weather Advisor.
 */

export function getMockItinerary(userPrompt, targetBudget = null, companionType = 'Solo Traveler', preferences = {}) {
  const prompt = userPrompt || 'Travel trip';
  const promptLower = prompt.toLowerCase();
  
  const tripPreferences = {
    pace: preferences?.pace || 'Balanced',
    dietary: preferences?.dietary || 'None',
    interests: Array.isArray(preferences?.interests) ? preferences.interests : []
  };
  
  let destination = 'Tokyo, Japan';
  let weatherAdvisor = {
    bestSeason: 'Spring & Autumn (March-May, Sept-Nov)',
    averageTemp: '20°C / 68°F',
    packingTip: 'Comfortable walking shoes, sunglasses & light layers.'
  };

  let packingChecklist = {
    documents: ['Passport & ID Cards', 'Flight & Hotel Bookings', 'Travel Medical Insurance'],
    clothing: ['Comfortable sneakers / walking shoes', 'Breathable shirts & tops', 'Versatile jacket or sweater'],
    electronics: ['Universal Plug Adapter', 'Power Bank (10,000mAh+)', 'Phone & Camera Chargers'],
    essentials: ['High SPF Sunscreen', 'Refillable Water Bottle', 'Personal First Aid Kit']
  };

  // Specific city landmark stop definitions
  let cityStops = [
    { title: 'Senso-ji Temple & Nakamise Shopping Street', category: 'Culture', location: 'Asakusa, Tokyo', cost: '$10 - $15' },
    { title: 'Authentic Ramen Tasting at Ichiran', category: 'Food', location: 'Shibuya Crossing, Tokyo', cost: '$12 - $18' },
    { title: 'Shibuya Sky Panoramic Deck & Sunset', category: 'Sightseeing', location: 'Shibuya Scramble, Tokyo', cost: '$18 - $25' },
    { title: 'Tsukiji Outer Fish Market Street Food Tour', category: 'Food', location: 'Tsukiji Market, Tokyo', cost: '$20 - $35' },
    { title: 'Meiji Shrine & Yoyogi Park Stroll', category: 'Relaxation', location: 'Harajuku, Tokyo', cost: 'Free' },
    { title: 'TeamLab Planets Immersive Digital Art', category: 'Culture', location: 'Toyosu, Tokyo', cost: '$25 - $32' }
  ];

  if (promptLower.includes('kerala')) {
    destination = 'Kerala, India';
    weatherAdvisor = {
      bestSeason: 'September to March (Pleasant Backwaters & Lush Hills)',
      averageTemp: '27°C / 81°F',
      packingTip: 'Light cotton wear, mosquito repellent, umbrella & slip-on sandals.'
    };
    packingChecklist.clothing = ['Breathable Cotton Shirts & Pants', 'Light Rain Jacket or Umbrella', 'Comfortable Walking Sandals'];
    packingChecklist.essentials.push('Mosquito & Bug Spray', 'Sunscreen Lotion', 'Binoculars for Nature Trails');
    cityStops = [
      { title: 'Alleppey Backwaters Houseboat Cruise & Lagoon Sunset', category: 'Relaxation', location: 'Alleppey Backwaters, Kerala', cost: '$35 - $60' },
      { title: 'Authentic Kerala Sadya Lunch on Banana Leaf', category: 'Food', location: 'Heritage Quarter, Kochi', cost: '$6 - $12' },
      { title: 'Munnar Tea Plantations & Mattupetty Viewpoint', category: 'Sightseeing', location: 'Munnar Hills, Kerala', cost: '$10 - $18' },
      { title: 'Fort Kochi Chinese Fishing Nets & Heritage Stroll', category: 'Culture', location: 'Fort Kochi, Kerala', cost: 'Free' },
      { title: 'Periyar Wildlife Sanctuary Boat Safari & Spice Garden', category: 'Adventure', location: 'Thekkady, Kerala', cost: '$15 - $25' },
      { title: 'Varkala Red Cliff Beach & Arabian Sea Sunset', category: 'Relaxation', location: 'Varkala Beach, Kerala', cost: 'Free' }
    ];
  } else if (promptLower.includes('rome') || promptLower.includes('italy')) {
    destination = 'Rome, Italy';
    weatherAdvisor = {
      bestSeason: 'April-June & September-October',
      averageTemp: '23°C / 73°F',
      packingTip: 'Comfortable cobblestone walking shoes, sun hat & light cottons.'
    };
    packingChecklist.clothing = ['Comfortable Cobblestone Walking Shoes', 'Modest Clothing for Vatican (Covered Shoulders/Knees)', 'Sun Hat & Sunglasses'];
    packingChecklist.essentials.push('Reusable Water Bottle (for free public fountains)');
    cityStops = [
      { title: 'Colosseum & Roman Forum Guided Tour', category: 'Sightseeing', location: 'Piazza del Colosseo, Rome', cost: '$22 - $35' },
      { title: 'Trattoria Pasta & Wood-fired Pizza Lunch', category: 'Food', location: 'Trastevere Quarter, Rome', cost: '$15 - $25' },
      { title: 'Trevi Fountain & Spanish Steps Stroll', category: 'Culture', location: 'Piazza di Trevi, Rome', cost: 'Free' },
      { title: 'Vatican Museums & Sistine Chapel', category: 'Culture', location: 'Vatican City, Rome', cost: '$28 - $40' },
      { title: 'Authentic Gelato Tasting at Giolitti', category: 'Food', location: 'Near Pantheon, Rome', cost: '$5 - $8' },
      { title: 'Pantheon Monument & Sunset Aperitivo', category: 'Relaxation', location: 'Piazza della Rotonda, Rome', cost: '$10 - $18' }
    ];
  } else if (promptLower.includes('goa')) {
    destination = 'Goa, India';
    weatherAdvisor = {
      bestSeason: 'November to February (Pleasant Sea Breeze)',
      averageTemp: '28°C / 82°F',
      packingTip: 'Swimwear, flip flops, high SPF sunscreen & light linen shirts.'
    };
    packingChecklist.clothing = ['Swimwear & Beach Wear', 'Flip flops & Water Sandals', 'Light Linen Shirts & Shorts'];
    packingChecklist.essentials.push('Mosquito Spray', 'Waterproof Beach Bag');
    cityStops = [
      { title: 'Baga Beach Watersports & Parasailing', category: 'Adventure', location: 'Baga Beach, North Goa', cost: '$20 - $35' },
      { title: 'Authentic Goan Fish Thali Lunch', category: 'Food', location: 'Fishermans Wharf, Panaji', cost: '$8 - $15' },
      { title: 'Fort Aguada Sunset Viewpoint & Lighthouse', category: 'Sightseeing', location: 'Sinquerim, Goa', cost: 'Free' },
      { title: 'Basilica of Bom Jesus Heritage Walk', category: 'Culture', location: 'Old Goa', cost: 'Free' },
      { title: 'Anjuna Flea Market & Beach Shacks', category: 'Shopping', location: 'Anjuna Beach, Goa', cost: '$10 - $25' },
      { title: 'Mandovi River Sunset Cruise with Goan Music', category: 'Relaxation', location: 'Panjim Jetty, Goa', cost: '$12 - $20' }
    ];
  } else if (promptLower.includes('paris') || promptLower.includes('france')) {
    destination = 'Paris, France';
    weatherAdvisor = {
      bestSeason: 'June to August & September to October',
      averageTemp: '21°C / 70°F',
      packingTip: 'Stylish smart-casual outfits, comfortable shoes & light scarf.'
    };
    packingChecklist.clothing = ['Smart Casual Evening Wear', 'Comfortable Walking Shoes', 'Light Scarf & Trench Coat'];
    cityStops = [
      { title: 'Eiffel Tower Summit & Champ de Mars', category: 'Sightseeing', location: 'Champ de Mars, Paris', cost: '$25 - $38' },
      { title: 'French Croissant & Café au Lait Break', category: 'Food', location: 'Saint-Germain-des-Prés, Paris', cost: '$8 - $14' },
      { title: 'Louvre Museum Mona Lisa Highlights', category: 'Culture', location: 'Musée du Louvre, Paris', cost: '$20 - $28' },
      { title: 'Seine River Evening Sunset Cruise', category: 'Relaxation', location: 'Pont Neuf, Paris', cost: '$18 - $26' },
      { title: 'Montmartre & Sacré-Cœur Basilica Walk', category: 'Culture', location: 'Montmartre, Paris', cost: 'Free' },
      { title: 'Le Marais Boutique Shopping & Bistro Dinner', category: 'Food', location: 'Le Marais, Paris', cost: '$30 - $55' }
    ];
  } else if (promptLower.includes('spain') || promptLower.includes('barcelona')) {
    destination = 'Barcelona, Spain';
    weatherAdvisor = {
      bestSeason: 'May-June & September-October',
      averageTemp: '24°C / 75°F',
      packingTip: 'Sunscreen, comfortable walking shoes & breathable cotton clothing.'
    };
    cityStops = [
      { title: 'Sagrada Família Gaudi Basilica Tour', category: 'Culture', location: 'Sagrada Família, Barcelona', cost: '$26 - $36' },
      { title: 'Tapas & Sangria Tasting at La Boqueria', category: 'Food', location: 'La Rambla, Barcelona', cost: '$15 - $25' },
      { title: 'Park Güell Mosaic Viewpoint Walk', category: 'Sightseeing', location: 'Park Güell, Barcelona', cost: '$12 - $18' },
      { title: 'Barceloneta Beach Relaxing Walk', category: 'Relaxation', location: 'Barceloneta Beach, Barcelona', cost: 'Free' }
    ];
  } else if (promptLower.includes('new york') || promptLower.includes('nyc')) {
    destination = 'New York City, USA';
    weatherAdvisor = {
      bestSeason: 'September-November & April-June',
      averageTemp: '19°C / 66°F',
      packingTip: 'Comfortable walking sneakers, light jacket & sunglasses.'
    };
    cityStops = [
      { title: 'Statue of Liberty & Ellis Island Ferry', category: 'Sightseeing', location: 'Battery Park, New York', cost: '$24 - $32' },
      { title: 'New York Style Pizza & Bagel Lunch', category: 'Food', location: 'Greenwich Village, New York', cost: '$8 - $15' },
      { title: 'Central Park Walk & Bethesda Terrace', category: 'Relaxation', location: 'Central Park, New York', cost: 'Free' },
      { title: 'Times Square & Broadway Theater District', category: 'Culture', location: 'Times Square, New York', cost: 'Free' }
    ];
  } else if (promptLower.includes('tokyo') || promptLower.includes('japan')) {
    destination = 'Tokyo, Japan';
  } else {
    // Dynamic destination extractor for any custom location
    const cleanedDestination = prompt
      .replace(/\b(\d+\s*days?|weekend|getaway|trip|vacation|budget|under|\$\d+|in|to|for|with)\b/gi, '')
      .trim();
    if (cleanedDestination.length > 2) {
      destination = cleanedDestination.charAt(0).toUpperCase() + cleanedDestination.slice(1);
      cityStops = [
        { title: `${destination} Landmark Highlights & Orientation`, category: 'Sightseeing', location: destination, cost: '$15 - $25' },
        { title: `Authentic Regional Dining in ${destination}`, category: 'Food', location: `${destination} Old Town`, cost: '$12 - $22' },
        { title: `${destination} Cultural Heritage & Historic Walk`, category: 'Culture', location: `${destination} Center`, cost: 'Free' },
        { title: `Scenic Scenic Viewpoint & Promenade`, category: 'Relaxation', location: destination, cost: 'Free' }
      ];
    }
  }

  // Extract duration
  let daysCount = 3;
  const dayMatch = promptLower.match(/(\d+)\s*day/);
  if (dayMatch && dayMatch[1]) {
    daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 7);
  }

  let reqBudget = targetBudget;
  if (!reqBudget) {
    const budgetMatch = promptLower.match(/(?:budget|under|\$|usd|inr|₹)\s*(\d+)/);
    if (budgetMatch && budgetMatch[1]) {
      reqBudget = parseInt(budgetMatch[1], 10);
    }
  }

  const minRequiredPerDay = 50;
  const minTotalRequired = daysCount * minRequiredPerDay;

  let isBudgetTooLow = false;
  let budgetWarning = null;

  if (reqBudget && reqBudget < minTotalRequired) {
    isBudgetTooLow = true;
    budgetWarning = `Given budget ($${reqBudget}/pax) is too low for a ${daysCount}-day trip to ${destination}. Recommended minimum budget is $${minTotalRequired} per person ($${minRequiredPerDay}/day).`;
  }

  const estimatedTotalPerPax = isBudgetTooLow ? reqBudget : Math.max(reqBudget || 350, minTotalRequired);

  const days = [];
  for (let i = 1; i <= daysCount; i++) {
    const s1 = cityStops[(i - 1) * 2 % cityStops.length];
    const s2 = cityStops[((i - 1) * 2 + 1) % cityStops.length];

    let dayStops = [
      {
        id: `stop-${i}-1`,
        title: s1.title,
        time: tripPreferences.pace === 'Relaxed' ? '10:00 AM - 01:00 PM' : '09:00 AM - 11:30 AM',
        description: `Explore the vibrant culture and famous sights at ${s1.location}.`,
        category: s1.category,
        location: s1.location,
        estimatedCost: s1.cost
      },
      {
        id: `stop-${i}-2`,
        title: tripPreferences.dietary !== 'None' 
          ? `Curated ${tripPreferences.dietary} Dining Experience (${s2.title.split(' ')[0]})`
          : s2.title,
        time: tripPreferences.pace === 'Relaxed' ? '01:30 PM - 03:30 PM' : '12:00 PM - 02:00 PM',
        description: tripPreferences.dietary !== 'None'
          ? `Savor authentic ${tripPreferences.dietary.toLowerCase()}-friendly local delicacies and regional specialties near ${s2.location}.`
          : `Enjoy authentic food and regional highlights around ${s2.location}.`,
        category: 'Food',
        location: s2.location,
        estimatedCost: s2.cost
      }
    ];

    if (tripPreferences.pace !== 'Relaxed') {
      dayStops.push({
        id: `stop-${i}-3`,
        title: `${destination.split(',')[0]} Evening Promenade & Local Vibe`,
        time: '06:00 PM - 08:30 PM',
        description: `Unwind and take in the charming evening lights and local atmosphere of ${destination}.`,
        category: 'Relaxation',
        location: destination,
        estimatedCost: 'Free'
      });
    }

    if (tripPreferences.pace === 'Packed') {
      dayStops.push({
        id: `stop-${i}-4`,
        title: `Night Vista & Cultural Discovery`,
        time: '09:00 PM - 10:30 PM',
        description: `Experience the vibrant night skyline and after-hours energy of ${destination}.`,
        category: 'Culture',
        location: destination,
        estimatedCost: '$10 - $20'
      });
    }

    days.push({
      dayNumber: i,
      title: `Day ${i}: ${i === 1 ? 'Arrival & Landmark Sights' : i === 2 ? 'Culture & Culinary Highlights' : 'Excursions & Leisure'}`,
      stops: dayStops
    });
  }

  const prefSummaryParts = [];
  if (tripPreferences.pace) prefSummaryParts.push(`${tripPreferences.pace} Pace`);
  if (tripPreferences.dietary && tripPreferences.dietary !== 'None') prefSummaryParts.push(`${tripPreferences.dietary} Cuisine`);
  if (tripPreferences.interests && tripPreferences.interests.length > 0) prefSummaryParts.push(tripPreferences.interests.slice(0, 2).join(' & '));

  const prefSnippet = prefSummaryParts.length > 0 ? ` with ${prefSummaryParts.join(', ')}` : '';

  return {
    isMock: true,
    tripTitle: `${daysCount}-Day ${destination} Experience`,
    destination: destination,
    duration: `${daysCount} Days`,
    summary: `A customized ${daysCount}-day itinerary for ${companionType}${prefSnippet} exploring the top landmarks, dining, and sights of ${destination}.`,
    companionType: companionType,
    preferences: tripPreferences,
    estimatedBudgetPerPax: `$${estimatedTotalPerPax} / person`,
    budgetBreakdown: {
      stay: `$${Math.round(estimatedTotalPerPax * 0.45)}`,
      food: `$${Math.round(estimatedTotalPerPax * 0.35)}`,
      activities: `$${Math.round(estimatedTotalPerPax * 0.20)}`
    },
    weatherAdvisor: weatherAdvisor,
    packingChecklist: packingChecklist,
    isBudgetTooLow: isBudgetTooLow,
    budgetWarning: budgetWarning,
    days: days
  };
}
