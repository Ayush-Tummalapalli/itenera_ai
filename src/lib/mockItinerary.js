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
  let accommodations = null;
  let curatedDining = null;
  let agentNotes = null;
  let cityStops = [];
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

  const TOKYO_ACCOMMODATIONS = [
    {
      id: 'acc-tokyo-1',
      name: 'Park Hyatt Tokyo / Aman Tokyo',
      type: 'Ultra-Luxury Skyline Hotel',
      area: 'Shinjuku / Otemachi, Tokyo',
      priceRange: '$450 - $750 / night',
      rating: '4.9',
      description: 'Iconic high-altitude sanctuary with Mt. Fuji panoramas, Michelin dining, and an indoor sky pool.',
      bestFor: 'Luxury travelers, couples & anniversary celebrations',
      amenities: ['Skyline Spa & Pool', 'Club Lounge', 'Michelin Dining', 'Concierge Service'],
      bookingTip: 'Request an upper-floor corner room for panoramic Tokyo Tower and sunset views.'
    },
    {
      id: 'acc-tokyo-2',
      name: 'Hotel Gracery Shinjuku',
      type: 'Charming Modern Tower Hotel',
      area: 'Kabukicho, Shinjuku, Tokyo',
      priceRange: '$140 - $210 / night',
      rating: '4.7',
      description: 'Prime central location steps from JR Shinjuku Station, soundproof guestrooms, and famous Godzilla terrace.',
      bestFor: 'Couples, families & first-time Tokyo visitors',
      amenities: ['Direct Train Access', 'English Concierge', 'High-speed Wi-Fi', 'Breakfast Buffet'],
      bookingTip: 'Book 4-6 weeks ahead for early-bird discounts and higher floor placement.'
    },
    {
      id: 'acc-tokyo-3',
      name: 'Nui. Hostel & Bar Lounge',
      type: 'Smart Design Stay & Social Café',
      area: 'Kuramae / Asakusa, Tokyo',
      priceRange: '$50 - $85 / night',
      rating: '4.6',
      description: 'Renovated former toy warehouse with handcrafted woodwork, specialty coffee bar, and riverside vibe.',
      bestFor: 'Solo explorers, creative travelers & friends',
      amenities: ['Artisan Coffee Bar', 'Bicycle Rentals', 'Co-working Lounge', 'Laundromat'],
      bookingTip: 'Private river-view double rooms offer hostel energy with hotel-grade privacy.'
    }
  ];

  const TOKYO_DINING = [
    {
      id: 'rest-tokyo-1',
      name: 'Ichiran Ramen Shibuya',
      cuisine: 'Classic Tonkotsu Ramen',
      area: 'Shibuya Crossing, Tokyo',
      mealType: 'Lunch & Late-Night',
      priceRange: '$10 - $16 / person',
      rating: '4.8',
      signatureDishes: ['Rich Tonkotsu Broth Ramen', 'Custom Spicy Red Sauce', 'Soft-Boiled Nitamago Egg'],
      ambiance: 'Solo dining booth concept focused purely on noodle savoring',
      reservationTip: 'No reservations; arrive at 11:15 AM or after 3 PM to avoid 30-min queues.'
    },
    {
      id: 'rest-tokyo-2',
      name: 'Tsukiji Sushiko Honten',
      cuisine: 'Traditional Edo-style Sushi',
      area: 'Tsukiji Outer Market, Tokyo',
      mealType: 'Fresh Morning Breakfast & Lunch',
      priceRange: '$25 - $45 / person',
      rating: '4.9',
      signatureDishes: ['O-Toro Bluefin Fatty Tuna', 'Hokkaido Sea Urchin (Uni)', 'Seared Salmon Aburi'],
      ambiance: 'Lively counter-seating sushi bar with master chefs preparing fish in front of you',
      reservationTip: 'Best visited around 9:30 AM right after the wholesale morning auction rush.'
    },
    {
      id: 'rest-tokyo-3',
      name: 'Gyukatsu Motomura',
      cuisine: 'Crispy Deep-Fried Wagyu Beef Cutlet',
      area: 'Harajuku / Shibuya, Tokyo',
      mealType: 'Lunch & Dinner',
      priceRange: '$15 - $22 / person',
      rating: '4.8',
      signatureDishes: ['Rare Panko-Crusted Beef Cutlet', 'Personal Stone Sizzle Grill', 'Barley Rice with Grated Yam'],
      ambiance: 'Cozy underground Japanese eatery with sizzling hot stones at every seat',
      reservationTip: 'Cash or IC Card preferred; join queue 15 mins before opening.'
    },
    {
      id: 'rest-tokyo-4',
      name: 'Torikizoku Shinjuku',
      cuisine: 'Social Yakitori & Craft Izakaya',
      area: 'Shinjuku, Tokyo',
      mealType: 'Evening Dinner & Drinks',
      priceRange: '$15 - $25 / person',
      rating: '4.7',
      signatureDishes: ['Tare-Glazed Chicken Thigh Skewers', 'Camembert Cheese Tempura', 'Suntory Mega Highball'],
      ambiance: 'Bustling, warm wooden izakaya with digital touch-screen ordering',
      reservationTip: 'Great group spot; flat price menu makes budgeting effortless.'
    }
  ];

  const TOKYO_AGENT_NOTES = {
    rationale: 'The agent sequenced Tokyo by rail clusters along the JR Yamanote line: Shibuya/Shinjuku on western days and Asakusa/Ueno on eastern days to minimize subway transfers.',
    transitAdvice: 'Add a digital Suica or Pasmo card to Apple/Google Wallet on your phone for instant contactless tap-and-go access on subways and convenience stores.',
    safetyAndScams: 'Tokyo is exceptionally safe. Avoid touts in Kabukicho offering bar deals or host clubs.',
    reservationAlerts: 'TeamLab Planets and Shibuya Sky observation deck tickets MUST be reserved 3-4 weeks ahead online.'
  };

  const TOKYO_CITY_STOPS = [
    { title: 'Senso-ji Temple & Nakamise Shopping Street', category: 'Culture', location: 'Asakusa, Tokyo', cost: '$10 - $15' },
    { title: 'Authentic Ramen Tasting at Ichiran', category: 'Food', location: 'Shibuya Crossing, Tokyo', cost: '$12 - $18' },
    { title: 'Shibuya Sky Panoramic Deck & Sunset', category: 'Sightseeing', location: 'Shibuya Scramble, Tokyo', cost: '$18 - $25' },
    { title: 'Tsukiji Outer Fish Market Street Food Tour', category: 'Food', location: 'Tsukiji Market, Tokyo', cost: '$20 - $35' },
    { title: 'Meiji Shrine & Yoyogi Park Stroll', category: 'Relaxation', location: 'Harajuku, Tokyo', cost: 'Free' },
    { title: 'TeamLab Planets Immersive Digital Art', category: 'Culture', location: 'Toyosu, Tokyo', cost: '$25 - $32' },
    { title: 'Akihabara Electric Town & Manga Exploration', category: 'Culture', location: 'Akihabara, Tokyo', cost: '$15 - $30' },
    { title: 'Shinjuku Gyoen National Garden & Tea House', category: 'Relaxation', location: 'Shinjuku, Tokyo', cost: '$5' },
    { title: 'Ginza Boutique Walk & Depachika Gourmet Food Hall', category: 'Shopping', location: 'Ginza, Tokyo', cost: '$15 - $28' },
    { title: 'Ueno Park & Tokyo National Museum', category: 'Culture', location: 'Ueno, Tokyo', cost: '$8 - $12' },
    { title: 'Roppongi Hills Mori Tower Observation Deck', category: 'Sightseeing', location: 'Roppongi, Tokyo', cost: '$16 - $22' },
    { title: 'Omoide Yokocho Yakitori Dinner & Lantern Alley', category: 'Food', location: 'Shinjuku, Tokyo', cost: '$18 - $30' }
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
      { title: 'Varkala Red Cliff Beach & Arabian Sea Sunset', category: 'Relaxation', location: 'Varkala Beach, Kerala', cost: 'Free' },
      { title: 'Athirappilly Waterfalls Rainforest Walk', category: 'Sightseeing', location: 'Chalakudy, Kerala', cost: '$5' },
      { title: 'Mattancherry Palace & Jew Town Antique Stroll', category: 'Culture', location: 'Kochi, Kerala', cost: '$4' },
      { title: 'Traditional Kathakali Dance Theatre Performance', category: 'Culture', location: 'Fort Kochi, Kerala', cost: '$8 - $12' },
      { title: 'Marari Fishermens Beach & Coconut Grove Chill', category: 'Relaxation', location: 'Mararikulam, Kerala', cost: 'Free' },
      { title: 'Kumarakom Bird Sanctuary & Vembanad Lake Kayaking', category: 'Adventure', location: 'Kumarakom, Kerala', cost: '$10 - $20' },
      { title: 'Kovalam Lighthouse Beach & Sunset Seafood Dinner', category: 'Food', location: 'Kovalam, Kerala', cost: '$12 - $22' }
    ];
    accommodations = [
      {
        id: 'acc-kerala-1',
        name: 'Kumarakom Lake Resort / Taj Green Cove',
        type: 'Heritage Luxury Backwater Resort',
        area: 'Kumarakom / Kovalam, Kerala',
        priceRange: '$180 - $320 / night',
        rating: '4.9',
        description: 'Authentic 16th-century traditional Keralite heritage villas with private plunge pools, lakeview dining, and premier Ayurveda.',
        bestFor: 'Couples, wellness seekers & families',
        amenities: ['Private Backwater Lake Dock', 'Ayurvedic Wellness Spa', 'Meandering Pool', 'Floating Seafood Restaurant'],
        bookingTip: 'Book a Heritage Lakefront Villa for morning mist views over Lake Vembanad.'
      },
      {
        id: 'acc-kerala-2',
        name: 'Brunton Boatyard - CGH Earth',
        type: 'Colonial Harbor Boutique Hotel',
        area: 'Fort Kochi, Kerala',
        priceRange: '$130 - $200 / night',
        rating: '4.8',
        description: 'Historic Victorian shipyard reimagined with vaulted wooden ceilings, harbor views, and sunset dolphin-watching cruises.',
        bestFor: 'History buffs & romantic couples',
        amenities: ['Harborview Balconies', 'Seafood Grill', 'Complimentary Sunset Cruise', 'Swimming Pool'],
        bookingTip: 'Complimentary tea and sunset boat cruise included daily for hotel guests.'
      },
      {
        id: 'acc-kerala-3',
        name: 'Zostel Alleppey & Munnar Tea Homestay',
        type: 'Smart Social Stay & Planter Cottage',
        area: 'Alleppey Backwaters / Munnar Hills',
        priceRange: '$28 - $55 / night',
        rating: '4.7',
        description: 'Relaxed beachfront and tea estate retreats with rooftop hammocks, private double rooms, and canoe trip assistance.',
        bestFor: 'Solo travelers, friends & budget backpackers',
        amenities: ['Rooftop Hammock Deck', 'Canoe & Kayak Docks', 'High-speed Wi-Fi', 'Home-cooked Kerala Meals'],
        bookingTip: 'Ask the host to arrange an early morning private canoe ride through narrow village canals.'
      }
    ];
    curatedDining = [
      {
        id: 'rest-kerala-1',
        name: 'Paragon Restaurant',
        cuisine: 'Legendary Malabar Coastal & Biryani',
        area: 'Kochi / Calicut',
        mealType: 'Lunch & Dinner',
        priceRange: '$8 - $16 / person',
        rating: '4.9',
        signatureDishes: ['Malabar Dum Biryani', 'Karimeen Pollichathu (Pearl Spot Fish)', 'Flaky Kerala Parotta with Chicken Stew'],
        ambiance: 'World-renowned culinary landmark bustling with family warmth and spice aromas',
        reservationTip: 'Arrive 15 minutes before 1 PM for lunch or expect a 20-min wait.'
      },
      {
        id: 'rest-kerala-2',
        name: 'Grand Pavilion',
        cuisine: 'Authentic 24-dish Kerala Sadya',
        area: 'MG Road, Ernakulam, Kochi',
        mealType: 'Traditional Afternoon Feast',
        priceRange: '$6 - $12 / person',
        rating: '4.8',
        signatureDishes: ['Grand Sadya on Banana Leaf', 'Avial, Sambar & Olan', 'Warm Payasam Dessert'],
        ambiance: 'Elegant heritage dining hall preserving century-old vegetarian recipes',
        reservationTip: 'Sadya is served exclusively between 12:00 PM and 3:30 PM.'
      },
      {
        id: 'rest-kerala-3',
        name: 'Clafouti Seaside Restaurant',
        cuisine: 'Cliffside Fresh Catch & Tropical Juices',
        area: 'North Cliff, Varkala Beach',
        mealType: 'Sunset Dinner & Cocktails',
        priceRange: '$10 - $18 / person',
        rating: '4.7',
        signatureDishes: ['Tandoori Grilled Red Snapper', 'Tiger Prawns in Coconut Masala', 'Banana Honey Pancakes'],
        ambiance: 'Open clifftop dining under thatched palms with waves crashing below and candlelit lanterns',
        reservationTip: 'Claim a cliff-edge front table by 5:30 PM to watch the sunset.'
      }
    ];
    agentNotes = {
      rationale: 'The agent sequenced Kerala starting from colonial Fort Kochi, ascending into cool misty tea hills of Munnar, and relaxing into peaceful Alleppey houseboats and Varkala cliffs.',
      transitAdvice: 'Hire a pre-paid air-conditioned taxi for inter-city transfers (Kochi to Munnar is a scenic 4-hour hill drive). In Alleppey, hire private country canoes for smaller canals where houseboats cannot enter.',
      safetyAndScams: 'Book backwater houseboats only through DTPC (District Tourism Promotion Council) verified operators to avoid substandard boats.',
      reservationAlerts: 'Overnight houseboats in Alleppey should be reserved 2-3 weeks in advance during peak season.'
    };
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
      { title: 'Pantheon Monument & Sunset Aperitivo', category: 'Relaxation', location: 'Piazza della Rotonda, Rome', cost: '$10 - $18' },
      { title: 'Borghese Gallery & Villa Borghese Gardens Walk', category: 'Culture', location: 'Piazzale Scipione Borghese, Rome', cost: '$18 - $24' },
      { title: 'Piazza Navona Street Artists & Fountain of the Four Rivers', category: 'Sightseeing', location: 'Piazza Navona, Rome', cost: 'Free' },
      { title: 'Campo de Fiori Morning Market & Artisan Bakery', category: 'Food', location: 'Campo de Fiori, Rome', cost: '$8 - $15' },
      { title: 'Castel Sant Angelo & Tiber River Sunset View', category: 'Sightseeing', location: 'Lungotevere Castello, Rome', cost: '$15' },
      { title: 'Monti Bohemian Quarter Vintage Shopping', category: 'Shopping', location: 'Rione Monti, Rome', cost: '$15 - $30' },
      { title: 'Aventine Hill Orange Garden & Keyhole Viewpoint', category: 'Relaxation', location: 'Aventine Hill, Rome', cost: 'Free' }
    ];
    accommodations = [
      {
        id: 'acc-rome-1',
        name: 'Hotel Hassler Roma / Hotel de Russie',
        type: 'Historic 5-Star Luxury Landmark',
        area: 'Piazza Trinità dei Monti (Spanish Steps), Rome',
        priceRange: '$380 - $650 / night',
        rating: '4.9',
        description: 'Perched at the pinnacle of the Spanish Steps with palatial marble interiors, rooftop dining, and views of the Roman dome skyline.',
        bestFor: 'Couples, luxury explorers & milestone celebrations',
        amenities: ['Panoramic Penthouse Terrace', 'Michelin-star Imàgo Restaurant', 'Amorvero Spa', 'Private Chauffeur'],
        bookingTip: 'Book a classic deluxe room with private balcony overlooking the Spanish Steps.'
      },
      {
        id: 'acc-rome-2',
        name: 'Hotel Artemide',
        type: 'Refined Central Boutique Hotel',
        area: 'Via Nazionale, Historic Center, Rome',
        priceRange: '$160 - $240 / night',
        rating: '4.8',
        description: 'A beautifully preserved 19th-century palazzo within walking distance of the Colosseum and Trevi, featuring a full wellness Artemis Spa.',
        bestFor: 'Couples, families & culture enthusiasts',
        amenities: ['Artemis Turkish Spa & Jacuzzi', 'Rooftop Cocktail Bar', 'Complimentary In-room Minibar', 'Gourmet Breakfast'],
        bookingTip: 'The rooftop Ambrosia restaurant serves exquisite pasta with sunset views.'
      },
      {
        id: 'acc-rome-3',
        name: 'The Beehive / YellowSquare Rome',
        type: 'Eco-Chic Design Social Stay',
        area: 'Castro Pretorio / Termini, Rome',
        priceRange: '$45 - $80 / night',
        rating: '4.7',
        description: 'A cozy eco-conscious guest house with tranquil garden courtyard, private rooms, and authentic neighborhood vibe.',
        bestFor: 'Solo travelers, budget-savvy couples & friends',
        amenities: ['Private Garden Courtyard', 'High-speed Wi-Fi', 'Artisanal Coffee Bar', 'Luggage Storage'],
        bookingTip: 'Choose the Sweets annex for peaceful private boutique studio apartments.'
      }
    ];
    curatedDining = [
      {
        id: 'rest-rome-1',
        name: 'Tonnarello',
        cuisine: 'Iconic Roman Trattoria & Pasta',
        area: 'Trastevere, Rome',
        mealType: 'Lunch & Dinner',
        priceRange: '$15 - $25 / person',
        rating: '4.8',
        signatureDishes: ['Tonnarello Cacio e Pepe in Crispy Parmesan Basket', 'Carbonara with Crispy Guanciale', 'Homemade Tiramisu'],
        ambiance: 'Vibrant cobblestone sidewalk seating with checkered tablecloths and Roman humor',
        reservationTip: 'They do not take reservations; queue before 12:30 PM or after 2:30 PM.'
      },
      {
        id: 'rest-rome-2',
        name: 'Roscioli Salumeria con Cucina',
        cuisine: 'Gourmet Roman Delicatessen & Wine Cellar',
        area: 'Campo de Fiori, Rome',
        mealType: 'Dinner & Wine Tasting',
        priceRange: '$30 - $55 / person',
        rating: '4.9',
        signatureDishes: ['Artisanal Rigatoni alla Carbonara', 'Burrata di Corato with Cantabrian Anchovies', 'Culatta Ham'],
        ambiance: 'World-renowned deli lined with 2,800 wine bottles, wheels of parmesan, and cured meats',
        reservationTip: 'Mandatory online booking 2-3 weeks in advance; counter seats are fantastic.'
      },
      {
        id: 'rest-rome-3',
        name: 'Giolitti (Est. 1900)',
        cuisine: 'Centennial Artisan Gelateria & Pasticceria',
        area: 'Near Pantheon, Rome',
        mealType: 'Dessert & Espresso',
        priceRange: '$4 - $8 / person',
        rating: '4.9',
        signatureDishes: ['Sicilian Pistachio Gelato', 'Fondente Dark Chocolate', 'Fresh Whipped Panna (Cream)'],
        ambiance: 'Gilded 1900s Art Nouveau parlor with bow-tied waiters and marble counters',
        reservationTip: 'Pay at the cash register first, then take your receipt to the counter to choose flavors.'
      },
      {
        id: 'rest-rome-4',
        name: 'Pizzarium Bonci',
        cuisine: 'Gourmet Roman Pizza al Taglio',
        area: 'Near Cipro Metro / Vatican',
        mealType: 'Quick Gourmet Lunch',
        priceRange: '$8 - $15 / person',
        rating: '4.8',
        signatureDishes: ['Crispy Fermented Sourdough Pizza by the slice', 'Potato & Mozzarella Crust', 'Porchetta with Figs'],
        ambiance: 'Casual gourmet bakery standing-room only; beloved by Anthony Bourdain',
        reservationTip: 'Take a numbered ticket at the door; pizzas are weighed and cut to your desired size.'
      }
    ];
    agentNotes = {
      rationale: 'The agent grouped Rome geographically: Imperial Rome (Colosseum/Forum) on Day 1, Renaissance & Baroque piazzas on Day 2, Vatican City on Day 3, and bohemian Trastevere on Day 4 to keep walking smooth.',
      transitAdvice: 'Rome is best traversed on foot. Wear cushioned walking shoes for cobblestones. For longer distances, take the Metro Line A/B with contactless card tap.',
      safetyAndScams: 'Watch out for pickpockets on Metro Line B near Termini. Avoid restaurants with large multi-language photo menus right outside monuments.',
      reservationAlerts: 'Vatican Museums and Colosseum tickets MUST be booked online 30 days before; walk-in lines often take 3+ hours.'
    };
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
      { title: 'Basilica of Bom Jesus & Se Cathedral Heritage Walk', category: 'Culture', location: 'Old Goa', cost: 'Free' },
      { title: 'Anjuna Flea Market & Beach Shacks', category: 'Shopping', location: 'Anjuna Beach, Goa', cost: '$10 - $25' },
      { title: 'Mandovi River Sunset Cruise with Goan Music', category: 'Relaxation', location: 'Panjim Jetty, Goa', cost: '$12 - $20' },
      { title: 'Dudhsagar Waterfalls Jeep Safari & Jungle Trek', category: 'Adventure', location: 'Mollem National Park, Goa', cost: '$25 - $40' },
      { title: 'Fontainhas Latin Quarter Heritage & Café Stroll', category: 'Culture', location: 'Fontainhas, Panaji', cost: 'Free' },
      { title: 'Chapora Fort Sunset & Vagator Clifftops', category: 'Sightseeing', location: 'Vagator Beach, Goa', cost: 'Free' },
      { title: 'Sahakari Spice Farm Tour & Traditional Goan Buffet', category: 'Food', location: 'Ponda, Goa', cost: '$10 - $18' },
      { title: 'Palolem Beach Kayaking & Butterfly Island Boat', category: 'Adventure', location: 'Palolem Beach, South Goa', cost: '$15 - $25' },
      { title: 'Arambol Sweetwater Lake & Sunset Drum Circle', category: 'Relaxation', location: 'Arambol Beach, Goa', cost: 'Free' }
    ];
    accommodations = [
      {
        id: 'acc-goa-1',
        name: 'Taj Exotica Resort & Spa',
        type: 'Luxury Beach Resort',
        area: 'Benaulim, South Goa',
        priceRange: '$220 - $350 / night',
        rating: '4.9',
        description: 'Mediterranean-inspired haven across 56 acres of lush gardens with private beach access and sunset sea views.',
        bestFor: 'Couples, luxury seekers & serene relaxers',
        amenities: ['Private Beach Access', 'Olympic Pool & Spa', 'Seafront Fine Dining', 'Free High-speed Wi-Fi'],
        bookingTip: 'Request a villa on the west wing for direct sunset garden panoramas.'
      },
      {
        id: 'acc-goa-2',
        name: 'Ahilya by the Sea',
        type: 'Charming Boutique Heritage Villa',
        area: 'Nerul / Dolphin Bay, North Goa',
        priceRange: '$160 - $240 / night',
        rating: '4.8',
        description: 'Tucked into a quiet corner of Dolphin Bay with two infinity pools, Portuguese antiques, and personalized chef dining.',
        bestFor: 'Couples & architecture enthusiasts',
        amenities: ['Infinity Sea Pool', 'Treehouse Massages', 'Artisan Breakfast', 'Boutique Library'],
        bookingTip: 'Book the Tower Room for 360-degree views of the fishing boats.'
      },
      {
        id: 'acc-goa-3',
        name: 'The Hosteller Morjim Beachfront',
        type: 'Smart Social Stay & Co-work',
        area: 'Morjim Beach, North Goa',
        priceRange: '$35 - $65 / night',
        rating: '4.7',
        description: 'Vibrant beachfront community with private dorms and en-suite rooms, co-working desks, and evening acoustic jam sessions.',
        bestFor: 'Solo travelers, remote workers & groups of friends',
        amenities: ['Direct Beach Access', 'High-speed Wi-Fi', 'Poolside Café & Bar', 'Surfboard Rentals'],
        bookingTip: 'Opt for the private sea-view balcony pod for the best blend of privacy and community.'
      }
    ];
    curatedDining = [
      {
        id: 'rest-goa-1',
        name: "The Fisherman's Wharf",
        cuisine: 'Authentic Goan Seafood & Coastal',
        area: 'Panaji / Cavelossim, Goa',
        mealType: 'Lunch & Dinner',
        priceRange: '$15 - $25 / person',
        rating: '4.8',
        signatureDishes: ['Kingfish Rava Fry', 'Prawn Balchão', 'Traditional Goan Fish Curry Thali', 'Bebinca with Vanilla Gelato'],
        ambiance: 'Riverside open-air wooden deck with gentle breeze and live acoustic fado music',
        reservationTip: 'Reserve a riverside table 24 hours in advance for the 6:30 PM sunset hour.'
      },
      {
        id: 'rest-goa-2',
        name: 'Gunpowder',
        cuisine: 'South Indian Coastal Heritage',
        area: 'Assagao, North Goa',
        mealType: 'Evening Dinner & Cocktails',
        priceRange: '$14 - $22 / person',
        rating: '4.7',
        signatureDishes: ['Kerala Beef Roast', 'Fluffy Steamed Appams', 'Sol Kadhi Cocktail', 'Pandan Panna Cotta'],
        ambiance: 'Bohemian courtyard in a restored Portuguese bungalow shaded by mango trees',
        reservationTip: 'Walk-ins often wait 45+ minutes; phone ahead by 2 PM for dinner slots.'
      },
      {
        id: 'rest-goa-3',
        name: 'Vinayak Family Restaurant',
        cuisine: 'Local Fishermen Fish Thali',
        area: 'Assagao, North Goa',
        mealType: 'Authentic Afternoon Lunch',
        priceRange: '$6 - $12 / person',
        rating: '4.9',
        signatureDishes: ['Surmai Fish Thali', 'Crispy Rava Fried Chonak', 'Tisreo Clam Masala'],
        ambiance: 'Rustic open-air local tavern overlooking green paddy fields',
        reservationTip: 'Arrive by 12:45 PM before the fresh catch of the day runs out.'
      },
      {
        id: 'rest-goa-4',
        name: 'Thalassa Greek Taverna',
        cuisine: 'Greek Mediterranean Sunset Dining',
        area: 'Siolim Waterfront, Goa',
        mealType: 'Sunset Dinner & Cocktails',
        priceRange: '$25 - $40 / person',
        rating: '4.7',
        signatureDishes: ['Lamb Souvlaki Skewers', 'Saganaki Flaming Cheese', 'Fresh Prawn Saganaki'],
        ambiance: 'Whitewashed Cycladic cliffs overlooking backwaters with fire dancers and DJs',
        reservationTip: 'Book sunset edge tables at least 3-4 days ahead.'
      },
      {
        id: 'rest-goa-5',
        name: 'Artjuna Garden Café',
        cuisine: 'Mediterranean Brunch & Specialty Coffee',
        area: 'Anjuna, North Goa',
        mealType: 'Breakfast & Morning Coffee',
        priceRange: '$8 - $14 / person',
        rating: '4.6',
        signatureDishes: ['Shakshuka with Fresh Sourdough', 'Spirulina Smoothie Bowl', 'Artisan Cortado'],
        ambiance: 'Lush tropical open-air garden with lifestyle boutique and open library',
        reservationTip: 'No reservations required; great morning work spot with fast Wi-Fi.'
      }
    ];
    agentNotes = {
      rationale: 'The agent sequenced your trip to cluster North Goa beach hubs on the first half and transition into South Goa coastal heritage to eliminate daily 2-hour cross-state taxi commutes.',
      transitAdvice: 'Rent a 125cc scooter (~₹400/day) or self-drive Thar/hatchback (~₹1,500/day). For taxis, use the GoaMiles app to avoid arbitrary roadside taxi stand pricing.',
      safetyAndScams: 'Avoid uncertified water sports brokers on Baga beach; book only through registered shacks with life jacket insurance.',
      reservationAlerts: 'Pre-book Thalassa or Fisherman Wharf sunset deck seating 48 hours ahead. Scuba slots at Grand Island fill 2 days in advance.'
    };
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
      { title: 'Le Marais Boutique Shopping & Bistro Dinner', category: 'Food', location: 'Le Marais, Paris', cost: '$30 - $55' },
      { title: 'Musée d Orsay Impressionist Masterpieces', category: 'Culture', location: 'Esplanade Valéry Giscard d Estaing, Paris', cost: '$16 - $20' },
      { title: 'Notre-Dame Cathedral & Île de la Cité Stroll', category: 'Sightseeing', location: 'Île de la Cité, Paris', cost: 'Free' },
      { title: 'Latin Quarter Historic Bookshops & Crêperies', category: 'Food', location: 'Quartier Latin, Paris', cost: '$10 - $18' },
      { title: 'Palace of Versailles Hall of Mirrors & Gardens', category: 'Sightseeing', location: 'Versailles, Paris', cost: '$22 - $32' },
      { title: 'Arc de Triomphe & Champs-Élysées Evening Promenade', category: 'Sightseeing', location: 'Place Charles de Gaulle, Paris', cost: '$14' },
      { title: 'Luxembourg Gardens Relaxation & Fountain', category: 'Relaxation', location: 'Jardin du Luxembourg, Paris', cost: 'Free' }
    ];
    accommodations = [
      {
        id: 'acc-paris-1',
        name: 'Le Meurice - Dorchester Collection',
        type: 'Historic 5-Star Palace Hotel',
        area: '1st Arrondissement (Rue de Rivoli), Paris',
        priceRange: '$520 - $890 / night',
        rating: '4.9',
        description: 'An 18th-century royal palace across from the Tuileries Garden featuring Salvador Dalí inspired interiors and 2-Michelin-star dining by Alain Ducasse.',
        bestFor: 'Luxury travelers, couples & unforgettable celebrations',
        amenities: ['Tuileries Garden Views', 'Valmont Spa & Sauna', 'Alain Ducasse Restaurant', 'Chauffeured Limousine'],
        bookingTip: 'Request an upper-floor balcony room overlooking the Eiffel Tower and Tuileries.'
      },
      {
        id: 'acc-paris-2',
        name: 'Relais Christine',
        type: 'Charming Boutique Left Bank Mansion',
        area: 'Saint-Germain-des-Prés (6th Arr.), Paris',
        priceRange: '$240 - $380 / night',
        rating: '4.8',
        description: 'Set on the site of a 13th-century abbey around a private leafy courtyard, with vaulted stone cellars and Guerlain spa.',
        bestFor: 'Couples & romantic getaways',
        amenities: ['Private Flower Courtyard', 'Subterranean Guerlain Spa', 'Complimentary Bicycles', 'Fireplace Salon'],
        bookingTip: 'Book directly for complimentary breakfast and afternoon tea in the private lounge.'
      },
      {
        id: 'acc-paris-3',
        name: 'CitizenM Paris Gare de Lyon / Generator',
        type: 'Modern Design Value Stay',
        area: '12th Arrondissement / Canal Saint-Martin, Paris',
        priceRange: '$75 - $130 / night',
        rating: '4.6',
        description: 'High-tech boutique hotel with MoodPad room lighting, XL King plush beds, and 16th-floor rooftop bar overlooking the Seine.',
        bestFor: 'Solo explorers, friends & smart budget travelers',
        amenities: ['Rooftop Cloud Bar', 'XL King Beds', 'Rain Showers', 'Superfast Free Wi-Fi'],
        bookingTip: 'Check in via the self-service kiosks and choose a river-view room on floors 12-15.'
      }
    ];
    curatedDining = [
      {
        id: 'rest-paris-1',
        name: 'Le Comptoir du Relais',
        cuisine: 'Iconic Parisian Bistronomy',
        area: 'Odéon, 6th Arrondissement, Paris',
        mealType: 'Lunch & Dinner',
        priceRange: '$28 - $50 / person',
        rating: '4.8',
        signatureDishes: ['Crispy Duck Confit with Sarladaise Potatoes', 'Foie Gras Terrine with Brioche', 'Pot-au-Feu'],
        ambiance: 'Quintessential bustling Art Deco bistro with zinc bar and sidewalk terrace',
        reservationTip: 'Lunch is walk-in only; arrive by 11:45 AM to secure an outdoor table.'
      },
      {
        id: 'rest-paris-2',
        name: 'Café de Flore',
        cuisine: 'Historic Literary Café & Salon de Thé',
        area: 'Saint-Germain-des-Prés, Paris',
        mealType: 'Breakfast & Afternoon Coffee',
        priceRange: '$14 - $24 / person',
        rating: '4.6',
        signatureDishes: ['Chocolat Chaud Spécial Flore (Rich Hot Chocolate)', 'Flaky Croissant au Beurre', 'Classic Croque Monsieur'],
        ambiance: 'Iconic intellectual haunt where Hemingway, Sartre, and Picasso drank espresso',
        reservationTip: 'Sit on the terrace for people-watching along Boulevard Saint-Germain.'
      },
      {
        id: 'rest-paris-3',
        name: 'Chez Janou',
        cuisine: 'Provençal Bistro & Dessert Legend',
        area: 'Le Marais (Near Place des Vosges), Paris',
        mealType: 'Dinner & Pastis',
        priceRange: '$22 - $36 / person',
        rating: '4.8',
        signatureDishes: ['Grilled Magret de Canard with Rosemary', 'Provençal Herbed Ratatouille', 'Unlimited Chocolate Mousse Bowl'],
        ambiance: 'Warm yellow walls, movie posters, and communal bowl of chocolate mousse brought to your table',
        reservationTip: 'Phone reservation recommended 3-5 days in advance for weekend dinners.'
      },
      {
        id: 'rest-paris-4',
        name: "L'As du Fallafel",
        cuisine: 'Famous Middle Eastern Street Food',
        area: 'Rue des Rosiers, Le Marais, Paris',
        mealType: 'Quick Gourmet Lunch',
        priceRange: '$8 - $14 / person',
        rating: '4.9',
        signatureDishes: ['Special Pita Falafel with Roasted Eggplant', 'Crispy Falafel Balls with Tahini', 'Spiced Shawarma'],
        ambiance: 'Bustling takeaway window in the historic Jewish quarter with lively street buzz',
        reservationTip: 'The takeaway queue moves in under 10 minutes; take your pita to Place des Vosges.'
      }
    ];
    agentNotes = {
      rationale: 'The agent laid out Paris in a circular rhythm along the Seine: Central monuments (Louvre, Eiffel) on Day 1, and Left Bank literary quarters & Marais boutiques on Day 2 to preserve walking energy.',
      transitAdvice: 'Download Citymapper for Paris. The Metro and RER are the fastest transit modes. Purchase a Navigo Easy contactless pass at any metro station.',
      safetyAndScams: 'Watch out for clipboard petition scams and string bracelets around Montmartre and the Eiffel Tower. Never sign anything.',
      reservationAlerts: 'Louvre Museum and Eiffel Tower summit elevators require booking online 3-4 weeks in advance.'
    };
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
    accommodations = TOKYO_ACCOMMODATIONS;
    curatedDining = TOKYO_DINING;
    agentNotes = TOKYO_AGENT_NOTES;
    cityStops = TOKYO_CITY_STOPS;
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

  // Extract duration (handles "5-day", "5 days", "5days", "5-night", "weekend")
  let daysCount = 3;
  if (promptLower.includes('weekend')) {
    daysCount = 2;
  } else {
    const dayMatch = promptLower.match(/(\d+)\s*[-]?\s*(?:days?|nights?)/i);
    if (dayMatch && dayMatch[1]) {
      daysCount = Math.min(Math.max(parseInt(dayMatch[1], 10), 1), 10);
    }
  }

  // Destination-specific daily economic profile (USD / day / person)
  let dailyBaseRate = 120;
  let stayRatio = 0.45;
  let foodRatio = 0.35;
  let activitiesRatio = 0.20;

  if (promptLower.includes('goa')) {
    dailyBaseRate = 70; // $70/day (~$300-$350 for 5 days depending on companion)
    stayRatio = 0.44;
    foodRatio = 0.36;
    activitiesRatio = 0.20;
  } else if (promptLower.includes('kerala')) {
    dailyBaseRate = 65; // $65/day (~$260-$275 for 4 days)
    stayRatio = 0.45;
    foodRatio = 0.35;
    activitiesRatio = 0.20;
  } else if (promptLower.includes('tokyo') || promptLower.includes('japan')) {
    dailyBaseRate = 180; // $180/day (~$485-$540 for 3 days)
    stayRatio = 0.46;
    foodRatio = 0.34;
    activitiesRatio = 0.20;
  } else if (promptLower.includes('paris') || promptLower.includes('france')) {
    dailyBaseRate = 210; // $210/day (~$420-$440 for 2-day weekend)
    stayRatio = 0.48;
    foodRatio = 0.34;
    activitiesRatio = 0.18;
  } else if (promptLower.includes('rome') || promptLower.includes('italy')) {
    dailyBaseRate = 160; // $160/day (~$640-$735 for 4 days)
    stayRatio = 0.46;
    foodRatio = 0.34;
    activitiesRatio = 0.20;
  } else if (promptLower.includes('barcelona') || promptLower.includes('spain')) {
    dailyBaseRate = 150; // $150/day
    stayRatio = 0.45;
    foodRatio = 0.35;
    activitiesRatio = 0.20;
  } else if (promptLower.includes('new york') || promptLower.includes('nyc')) {
    dailyBaseRate = 240; // $240/day
    stayRatio = 0.50;
    foodRatio = 0.30;
    activitiesRatio = 0.20;
  } else if (promptLower.includes('india')) {
    dailyBaseRate = 65;
  }

  // Companion party scaling
  let companionMultiplier = 1.0;
  if (companionType === 'Solo Traveler') {
    companionMultiplier = 1.15; // single supplement on lodging
  } else if (companionType === 'Couple / Romantic') {
    companionMultiplier = 1.05; // shared room + boutique dining
  } else if (companionType === 'Family with Kids') {
    companionMultiplier = 0.90; // family rooms & kid ticket discounts
  } else if (companionType === 'Group of Friends') {
    companionMultiplier = 0.85; // shared villas/hostels/transfers
  }

  // Pace scaling
  let paceMultiplier = 1.0;
  if (tripPreferences.pace === 'Packed') paceMultiplier = 1.10;
  if (tripPreferences.pace === 'Relaxed') paceMultiplier = 0.95;

  const baselinePerPax = Math.round(daysCount * dailyBaseRate * companionMultiplier * paceMultiplier);

  let reqBudget = targetBudget;
  if (!reqBudget) {
    const budgetMatch = promptLower.match(/(?:budget|under|\$|₹|usd|inr)[\s:]*[\$₹]?\s*(\d+)/i);
    if (budgetMatch && budgetMatch[1]) {
      reqBudget = parseInt(budgetMatch[1], 10);
    }
  }

  const isSouthAsia = promptLower.includes('goa') || promptLower.includes('kerala') || promptLower.includes('india');
  const minDailyViable = isSouthAsia ? 35 : 75;
  const minTotalRequired = daysCount * minDailyViable;

  let isBudgetTooLow = false;
  let budgetWarning = null;

  if (reqBudget && reqBudget < minTotalRequired) {
    isBudgetTooLow = true;
    budgetWarning = `Given budget ($${reqBudget}/pax) is too tight for a ${daysCount}-day trip to ${destination}. Recommended baseline is $${baselinePerPax} per person ($${Math.round(baselinePerPax / daysCount)}/day).`;
  }

  const estimatedTotalPerPax = reqBudget ? reqBudget : baselinePerPax;
  const stayAmount = Math.round(estimatedTotalPerPax * stayRatio);
  const foodAmount = Math.round(estimatedTotalPerPax * foodRatio);
  const activitiesAmount = Math.max(0, estimatedTotalPerPax - stayAmount - foodAmount);

  const DAY_THEMES = [
    'Arrival, Orientation & Signature Landmarks',
    'Cultural Heritage, Historic Quarters & Local Cuisine',
    'Scenic Excursions, Nature Trails & Panoramic Vistas',
    'Hidden Gems, Artisan Alleys & Sunset Highlights',
    'Local Flea Markets, Bohemian Quarters & Leisure',
    'Island Discovery, Countryside Escapes & Hidden Corners',
    'Gastronomic Tasting & Farewell Promenade',
    'Scenic Countryside Trails & Heritage Mansions',
    'Offbeat Nature Reserves & Sunset Sailing',
    'Departure Reflections & Souvenir Shopping'
  ];

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
      title: `Day ${i}: ${DAY_THEMES[i - 1] || 'Excursions & Leisure'}`,
      stops: dayStops
    });
  }

  const prefSummaryParts = [];
  if (tripPreferences.pace) prefSummaryParts.push(`${tripPreferences.pace} Pace`);
  if (tripPreferences.dietary && tripPreferences.dietary !== 'None') prefSummaryParts.push(`${tripPreferences.dietary} Cuisine`);
  if (tripPreferences.interests && tripPreferences.interests.length > 0) prefSummaryParts.push(tripPreferences.interests.slice(0, 2).join(' & '));

  const prefSnippet = prefSummaryParts.length > 0 ? ` with ${prefSummaryParts.join(', ')}` : '';

  // Fallback defaults for accommodations, dining & agent notes if not already populated
  if (!accommodations || accommodations.length === 0) {
    accommodations = [
      {
        id: 'acc-custom-1',
        name: `The Grand Palace & Spa ${destination.split(',')[0]}`,
        type: '5-Star Luxury Landmark',
        area: `Central ${destination.split(',')[0]}`,
        priceRange: '$220 - $380 / night',
        rating: '4.8',
        description: `Premier luxury retreat situated in prime central ${destination.split(',')[0]} with world-class wellness spa and fine dining.`,
        bestFor: 'Luxury travelers, couples & comfort seekers',
        amenities: ['Executive Spa & Pool', 'Concierge Desk', 'Fine Dining', 'Free Wi-Fi'],
        bookingTip: 'Request a quiet courtyard or upper-floor panorama room.'
      },
      {
        id: 'acc-custom-2',
        name: `${destination.split(',')[0]} Heritage Boutique Inn`,
        type: 'Charming Boutique Hotel',
        area: `Historic Old Town, ${destination.split(',')[0]}`,
        priceRange: '$110 - $175 / night',
        rating: '4.7',
        description: `Character-filled boutique residence with personalized concierge service, artisan local breakfast, and prime walkability.`,
        bestFor: 'Couples, families & independent explorers',
        amenities: ['Artisan Breakfast Included', 'Walkable to Landmarks', 'Free High-speed Wi-Fi', 'Air Conditioning'],
        bookingTip: 'Book directly for complimentary morning coffee and late checkout.'
      },
      {
        id: 'acc-custom-3',
        name: `Urban Hub Social Stay & Co-work`,
        type: 'Smart Value Stay & Design Lounge',
        area: `Arts District, ${destination.split(',')[0]}`,
        priceRange: '$40 - $75 / night',
        rating: '4.6',
        description: `Modern design-forward space featuring private en-suite rooms, communal café lounge, and co-working facilities.`,
        bestFor: 'Solo travelers, remote workers & friends',
        amenities: ['Co-working Desks', 'Specialty Coffee Bar', 'High-speed Wi-Fi', 'Laundry Facilities'],
        bookingTip: 'Choose a private queen studio for great value with complete privacy.'
      }
    ];
  }

  if (!curatedDining || curatedDining.length === 0) {
    curatedDining = [
      {
        id: 'rest-custom-1',
        name: `The Old Town Tavern & Grill`,
        cuisine: `Regional Signature Cuisine`,
        area: `Old Town Center, ${destination.split(',')[0]}`,
        mealType: 'Lunch & Dinner',
        priceRange: '$15 - $28 / person',
        rating: '4.8',
        signatureDishes: [`Chef's Regional Platter`, 'Seasonal Local Catch', 'Signature Artisan Dessert'],
        ambiance: 'Charming atmospheric dining hall with historic brickwork and warm hospitality',
        reservationTip: 'Evening reservations recommended on weekends.'
      },
      {
        id: 'rest-custom-2',
        name: `Marketplace Bistro & Café`,
        cuisine: 'Artisanal Brunch & Specialty Coffee',
        area: `Central Market Quarter, ${destination.split(',')[0]}`,
        mealType: 'Breakfast & Brunch',
        priceRange: '$8 - $16 / person',
        rating: '4.7',
        signatureDishes: ['Freshly Baked Pastries', 'Avocado & Poached Egg Toast', 'Single-Origin Pour Over Coffee'],
        ambiance: 'Sunlit bohemian café with open terrace and garden seating',
        reservationTip: 'Walk-ins welcome all morning.'
      },
      {
        id: 'rest-custom-3',
        name: `Sunset Panorama Rooftop Lounge`,
        cuisine: 'Modern Fusion & Signature Cocktails',
        area: `Harbor / Skyline District, ${destination.split(',')[0]}`,
        mealType: 'Sunset Dinner & Cocktails',
        priceRange: '$25 - $45 / person',
        rating: '4.8',
        signatureDishes: ['Wood-Fired Small Plates', 'Craft Herb Cocktails', 'Artisanal Cheese Selection'],
        ambiance: 'Vibrant rooftop deck with ambient lighting and panoramic sunset vistas',
        reservationTip: 'Book 24-48 hours ahead for prime sunset railing tables.'
      }
    ];
  }

  if (!agentNotes || !agentNotes.rationale) {
    agentNotes = {
      rationale: `The AI agent sequenced your trip to cluster landmarks by neighborhood, minimizing cross-town commute times and ensuring a seamless balance of sightseeing, relaxation, and cultural dining.`,
      transitAdvice: `Download local transit apps or use contactless credit/debit card taps on public transit. Walking is the best way to uncover hidden alleys in ${destination.split(',')[0]}.`,
      safetyAndScams: 'Keep an eye on personal belongings in crowded market hubs and verify official entry ticket desks.',
      reservationAlerts: 'Pre-book top-tier museums and prime sunset dining slots 1-2 weeks ahead to bypass long queues.'
    };
  }

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
      stay: `$${stayAmount}`,
      food: `$${foodAmount}`,
      activities: `$${activitiesAmount}`
    },
    accommodations: accommodations,
    curatedDining: curatedDining,
    agentNotes: agentNotes,
    weatherAdvisor: weatherAdvisor,
    packingChecklist: packingChecklist,
    isBudgetTooLow: isBudgetTooLow,
    budgetWarning: budgetWarning,
    days: days
  };
}
