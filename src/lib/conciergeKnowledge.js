/**
 * Advanced Field Knowledge & Reasoning Engine for Itinera AI Concierge.
 * Provides deep, destination-aware intelligence across cities, itineraries, transit, dining, and safety.
 */

export const CITY_INTELLIGENCE = {
  tokyo: {
    city: 'Tokyo, Japan',
    transit: {
      overview: 'Tokyo has the world\'s most punctual and extensive rail and subway network (JR East & Tokyo Metro).',
      card: 'Get a digital **Welcome Suica** or **Pasmo** card on your phone wallet (Apple Wallet / Google Wallet) for seamless tap-and-go travel.',
      tip: 'Trains stop running around midnight (~00:30 AM). Taxis after midnight are expensive, so plan return transit accordingly.'
    },
    dining: {
      highlights: 'Tonkotsu Ramen, Tsukiji sushi, Yakitori in Omoide Yokocho, Conveyor-belt sushi (Kura/Sushiro).',
      etiquette: 'Never stick chopsticks vertically into a bowl of rice (funeral association). Slurping noodles is polite and shows appreciation. Do not walk while eating street food; consume it near the stall.',
      tipping: 'Strictly **NO tipping** anywhere in Japan. Exceptional service is standard and leaving extra money causes confusion or embarrassment.'
    },
    phrases: [
      { jp: 'Arigatou Gozaimasu', en: 'Thank you very much' },
      { jp: 'Sumimasen', en: 'Excuse me / Sorry / Pardon' },
      { jp: 'Kore o kudasai', en: 'This one, please (pointing to menu)' },
      { jp: 'Ikura desu ka?', en: 'How much is this?' },
      { jp: 'Toire wa doko desu ka?', en: 'Where is the restroom?' }
    ],
    safety: 'Extremely safe even late at night. Emergency numbers: **110** (Police), **119** (Ambulance/Fire). Keep your passport or a photocopy on you at all times as Japanese law requires foreign visitors to carry ID.',
    connectivity: 'Free public Wi-Fi is spotty; renting a Pocket Wi-Fi or getting an e-SIM (e.g. Ubigi or Airalo) is strongly recommended.'
  },
  paris: {
    city: 'Paris, France',
    transit: {
      overview: 'The Paris Métro and RER network connects every corner of the city efficiently.',
      card: 'Get a **Navigo Easy** contactless card at any station counter or use the Île-de-France Mobilités app on your phone.',
      tip: 'Beware of pickpockets at major hubs (Gare du Nord, Châtelet, Eiffel Tower, Louvre). Keep zippers locked and backpacks in front on crowded lines.'
    },
    dining: {
      highlights: 'Fresh croissants from artisanal boulangeries, Duck Confit, Steak Frites, French Onion Soup, Macarons.',
      etiquette: 'Always say **"Bonjour, Madame/Monsieur"** when entering any boutique or cafe before asking a question. Skipping this is considered rude.',
      tipping: 'Service is legally included (*service compris*). Rounding up by 1-2 Euros for good cafe service or 5% in nice restaurants is appreciated but not mandatory.'
    },
    phrases: [
      { jp: 'Bonjour', en: 'Hello / Good morning' },
      { jp: 'Merci beaucoup', en: 'Thank you very much' },
      { jp: 'S\'il vous plaît', en: 'Please' },
      { jp: 'Combien ça coûte?', en: 'How much does it cost?' },
      { jp: 'L\'addition, s\'il vous plaît', en: 'The check / bill, please' }
    ],
    safety: 'Generally safe, but vigilance against pickpocketing, ring scams, and fake petition clipboards around Montmartre and the Eiffel Tower is essential. Emergency: **112** (Universal European Emergency).'
  },
  rome: {
    city: 'Rome, Italy',
    transit: {
      overview: 'Rome has a two-line Metro (A & B) plus extensive tram and bus routes.',
      card: 'Purchase contactless BIT tickets (€1.50 valid for 100 mins) or tap your contactless credit card directly at metro turnstiles.',
      tip: 'Validate paper bus tickets immediately upon boarding to avoid hefty spot fines.'
    },
    dining: {
      highlights: 'The 4 Roman Pastas: Cacio e Pepe, Carbonara, Amatriciana, and Gricia. Wood-fired Roman thin-crust pizza in Trastevere.',
      etiquette: 'Never order a Cappuccino after 11:00 AM (Italians only drink milk coffees in the morning). Stand at the counter (*al banco*) for cheaper espresso pricing.',
      tipping: 'A cover charge (*coperto*) is often added to the bill. Extra tipping of €1-€2 per person is generous and appreciated.'
    },
    phrases: [
      { jp: 'Buongiorno', en: 'Good morning / Hello' },
      { jp: 'Grazie mille', en: 'Thank you very much' },
      { jp: 'Per favore', en: 'Please' },
      { jp: 'Il conto, per favore', en: 'The bill, please' },
      { jp: 'Dov\'è il bagno?', en: 'Where is the restroom?' }
    ],
    safety: 'Stay alert at Termini Station and crowded bus #64. Carry a refillable bottle for the free historic public drinking fountains (*nasoni*). Emergency: **112**.'
  },
  kerala: {
    city: 'Kerala, India',
    transit: {
      overview: 'Kochi has a clean, air-conditioned metro and water metro ferries. For hill stations (Munnar, Thekkady), pre-booked private taxis or KSRTC buses are best.',
      tip: 'Book Alleppey backwater houseboats and Shikara rides through authorized DTPC counters.'
    },
    dining: {
      highlights: 'Traditional Kerala Sadya on banana leaf, Appam with Stew, Karimeen Pollichathu, Malabar Parotta with curry.',
      etiquette: 'Sadya is traditionally eaten with the right hand. Start with rice and dal (parippu) and finish with sweet payasam.',
      tipping: '5% to 10% tip is customary in dine-in restaurants.'
    },
    phrases: [
      { jp: 'Namaskaram', en: 'Formal greeting / Hello' },
      { jp: 'Nanni', en: 'Thank you' },
      { jp: 'Ithinu ethraya vila?', en: 'How much does this cost?' },
      { jp: 'Kure koodi venam', en: 'I want a little more' },
      { jp: 'Evideya...?', en: 'Where is...?' }
    ],
    safety: 'Very welcoming and peaceful state. Wear breathable cottons, carry mosquito repellent for backwaters, and drink bottled or boiled water. Emergency: **112**.'
  },
  goa: {
    city: 'Goa, India',
    transit: {
      overview: 'Renting a scooter/car or using the GoaMiles app is the standard way to explore North and South Goa.',
      tip: 'Always wear a helmet and carry a valid driving license when renting two-wheelers; traffic police checks are frequent.'
    },
    dining: {
      highlights: 'Goan Fish Curry Thali, Prawn Balchão, Pork Vindaloo, Bebinca dessert, and fresh coconut water.',
      etiquette: 'Beach shacks welcome casual swimwear, but throw on a shirt/cover-up when walking through town markets or churches.',
      tipping: '7% to 10% is customary at beach shacks and restaurants.'
    },
    safety: 'Follow flag warnings on beaches (Red flag = Do NOT swim). Emergency: **112**.'
  }
};

/**
 * Intelligent Destination & Query Matcher
 */
export function generateSmartConciergeAnswer(userQuery, destination = 'Destination', tripContext = {}) {
  const q = (userQuery || '').toLowerCase();
  const destLower = (destination || '').toLowerCase();

  // Find known city profile
  let cityProfile = null;
  for (const [key, profile] of Object.entries(CITY_INTELLIGENCE)) {
    if (destLower.includes(key) || q.includes(key)) {
      cityProfile = profile;
      break;
    }
  }

  // 1. Specific questions about the current itinerary / schedule / stops
  if (q.includes('day 1') || q.includes('day 2') || q.includes('day 3') || q.includes('schedule') || q.includes('my plan') || q.includes('next stop') || q.includes('doing today')) {
    if (tripContext?.days && tripContext.days.length > 0) {
      const matchDay = q.match(/day\s*(\d+)/i);
      const targetDayNum = matchDay ? parseInt(matchDay[1], 10) : 1;
      const targetDay = tripContext.days.find(d => d.dayNumber === targetDayNum) || tripContext.days[0];

      let scheduleText = `📅 **Your Schedule for Day ${targetDay.dayNumber}: ${targetDay.title}**\n\n`;
      if (targetDay.stops && targetDay.stops.length > 0) {
        targetDay.stops.forEach((stopStr, idx) => {
          scheduleText += `${idx + 1}. **${stopStr}**\n`;
        });
      }
      scheduleText += `\n💡 *Pro-Tip: Allow 15-20 minutes transit buffer between stops to explore nearby side streets comfortably!*`;
      return scheduleText;
    }
  }

  // 2. Transport, Transit & Getting Around
  if (q.includes('transit') || q.includes('transport') || q.includes('metro') || q.includes('subway') || q.includes('train') || q.includes('taxi') || q.includes('bus') || q.includes('card') || q.includes('pass')) {
    if (cityProfile) {
      return `🚇 **Transit & Transportation Guide for ${cityProfile.city}**:\n\n` +
        `• **System Overview**: ${cityProfile.transit.overview}\n` +
        `• **Transit Pass / Payment**: ${cityProfile.transit.card}\n` +
        `• **Key Advice**: ${cityProfile.transit.tip}\n\n` +
        `💡 *Recommendation: Download Citymapper or Google Maps with offline area maps downloaded beforehand for real-time train and platform schedules!*`;
    }
    return `🚇 **Public Transit Guide for ${destination}**:\n\n` +
      `• **Transit Hubs**: Use the official city metro or central train stations for fastest point-to-point journeys.\n` +
      `• **Contactless Pay**: Most modern transit systems allow tapping your contactless phone wallet directly at the fare gates.\n` +
      `• **Taxis**: Stick to licensed metered cabs or authorized ride-hailing apps (Uber, Grab, Bolt) rather than unmetered private cars.\n` +
      `• **Daily Passes**: Look for 24h or multi-day tourist transit passes at the main station ticket counter for significant savings.`;
  }

  // 3. Phrases & Language Guide
  if (q.includes('phrase') || q.includes('language') || q.includes('hello') || q.includes('thank') || q.includes('words') || q.includes('speak')) {
    if (cityProfile && cityProfile.phrases) {
      let phraseList = `🗣️ **Essential Local Phrases for ${cityProfile.city}**:\n\n`;
      cityProfile.phrases.forEach(p => {
        phraseList += `• **"${p.jp}"** → *${p.en}*\n`;
      });
      phraseList += `\n💡 *Pronunciation Tip: Locals appreciate any genuine effort to speak their greetings, and a polite smile goes a long way!*`;
      return phraseList;
    }
    return `🗣️ **Essential Local Phrases for ${destination}**:\n\n` +
      `• **Hello / Greetings**: Use the polite local greeting upon entering any establishment.\n` +
      `• **Thank You**: The most important word to remember—use it often with hotel staff, drivers, and servers.\n` +
      `• **Please & Excuse Me**: Indispensable for asking directions or navigating crowded corridors.\n` +
      `• **How much is this?**: Useful for open-air markets and boutiques.\n` +
      `• **Where is the restroom?**: A crucial phrase for train stations and restaurants.\n\n` +
      `💡 *Tip: Google Translate has an instant camera feature that translates signs and menus in real time!*`;
  }

  // 4. Dining, Food Specialties & Dietary
  if (q.includes('food') || q.includes('eat') || q.includes('dining') || q.includes('restaurant') || q.includes('dish') || q.includes('cafe') || q.includes('vegetarian') || q.includes('vegan') || q.includes('halal')) {
    const dietaryPref = tripContext?.preferences?.dietary || 'standard';
    const dietNote = dietaryPref !== 'None' ? `\n\n🥗 *Regarding your "${dietaryPref}" preference:* Save a translation card on your phone stating your dietary restriction clearly to show waitstaff.` : '';

    if (cityProfile) {
      return `🍽️ **Culinary & Dining Guide for ${cityProfile.city}**:\n\n` +
        `• **Must-Try Specialties**: ${cityProfile.dining.highlights}\n` +
        `• **Dining Etiquette**: ${cityProfile.dining.etiquette}\n` +
        `• **Tipping Rule**: ${cityProfile.dining.tipping}${dietNote}`;
    }
    return `🍽️ **Culinary Recommendations for ${destination}**:\n\n` +
      `• **Local Markets**: Seek out bustling food stalls and neighborhood bistros where you see locals gathering.\n` +
      `• **Meal Timings**: Research local dinner hours (e.g., in Southern Europe, restaurants open late at 8:30 PM, whereas in Northern Europe/Asia, 6:00 PM - 7:30 PM is standard).\n` +
      `• **Reservations**: Popular dining spots often book out days in advance; check if your hotel concierge can reserve for you.${dietNote}`;
  }

  // 5. Tipping, Currency & Money
  if (q.includes('tip') || q.includes('money') || q.includes('cash') || q.includes('card') || q.includes('atm') || q.includes('currency') || q.includes('euro') || q.includes('dollar') || q.includes('yen') || q.includes('rupee')) {
    if (cityProfile) {
      return `💵 **Money & Tipping Guide for ${cityProfile.city}**:\n\n` +
        `• **Tipping Custom**: ${cityProfile.dining.tipping}\n` +
        `• **Cards vs Cash**: Keep some local currency on hand for street markets, small shrines/temples, and coin-operated lockers.\n` +
        `• **ATM Advice**: Always choose "Debit without conversion" (charge in local currency) when using foreign bank ATMs to get the true interbank exchange rate!`;
    }
    return `💵 **Currency & Tipping Etiquette in ${destination}**:\n\n` +
      `• **Tipping Culture**: Many countries include service charges in the bill. Rounding up to the nearest bill or leaving 5-10% for exceptional table service is common.\n` +
      `• **Cash Essentials**: While credit cards are widely accepted in hotels and malls, street food vendors and small transport operators frequently require local cash.\n` +
      `• **ATM Selection**: Withdraw cash from physical bank branches rather than third-party standalone ATMs for maximum security and lower fees.`;
  }

  // 6. Safety, Scams & Emergency
  if (q.includes('safe') || q.includes('safety') || q.includes('scam') || q.includes('emergency') || q.includes('police') || q.includes('hospital') || q.includes('danger') || q.includes('night')) {
    if (cityProfile) {
      return `🛡️ **Safety & Security Briefing for ${cityProfile.city}**:\n\n` +
        `• **Safety Assessment**: ${cityProfile.safety}\n` +
        `• **General Advice**: Stay aware of your surroundings in crowded tourist landmarks.\n` +
        `• **Emergency Action**: Keep digital scans of your passport on cloud storage and hotel business card in your wallet.`;
    }
    return `🛡️ **Safety & Security Advisory for ${destination}**:\n\n` +
      `• **General Safety**: Stick to well-lit main avenues during night walks and verify authorized taxi credentials before boarding.\n` +
      `• **Emergency Number**: Most international destinations route through **112** or **911**.\n` +
      `• **Valuables**: Keep high-value jewelry and original passport in your hotel safe; carry a digital copy or color photocopy while exploring.\n` +
      `• **Scam Awareness**: Be cautious of unsolicited street guides, friendship bracelet sellers, or overly persistent strangers offering unofficial tours.`;
  }

  // 7. Packing & Weather
  if (q.includes('pack') || q.includes('weather') || q.includes('wear') || q.includes('clothes') || q.includes('rain') || q.includes('cold') || q.includes('hot') || q.includes('shoes')) {
    return `🎒 **Packing & Dress Code Recommendations for ${destination}**:\n\n` +
      `• **Footwear**: High-comfort walking sneakers are non-negotiable—most itineraries involve 10,000 to 18,000 steps per day across stone, stairs, and pavement.\n` +
      `• **Layering**: Bring light layers (cardigan, light rain jacket) to adjust between air-conditioned interiors and outdoor conditions.\n` +
      `• **Sacred Sites Dress Code**: Shoulders and knees should be covered when visiting cathedrals, temples, or mosques.\n` +
      `• **Tech Essentials**: A 10,000mAh+ power bank and universal travel plug adapter should stay in your daypack at all times.`;
  }

  // 8. SIM cards, Wi-Fi & Internet
  if (q.includes('wifi') || q.includes('sim') || q.includes('internet') || q.includes('data') || q.includes('phone') || q.includes('esim')) {
    return `📶 **Connectivity & Internet Guide for ${destination}**:\n\n` +
      `• **Best Option (e-SIM)**: If your smartphone supports e-SIM, purchasing a data plan online (e.g. Airalo, Holafly, Nomad) before flying provides instant internet upon touchdown.\n` +
      `• **Airport Physical SIM**: Available at arrival terminal kiosks; make sure your phone is carrier-unlocked.\n` +
      `• **Offline Maps**: In Google Maps, tap your profile → *Offline Maps* → *Select Your Own Map* and download the full city grid so GPS works even with zero cellular signal!`;
  }

  // 9. Hidden Gems & Photography
  if (q.includes('photo') || q.includes('hidden') || q.includes('gem') || q.includes('view') || q.includes('sunset') || q.includes('secret') || q.includes('viewpoint')) {
    return `📸 **Scenic Viewpoints & Hidden Gems for ${destination}**:\n\n` +
      `• **Golden Hour Timing**: Arrive 45 minutes before sunset for the best lighting conditions and fewest crowds.\n` +
      `• **Early Morning Walks**: Major iconic landmarks are virtually empty between 07:00 AM and 08:30 AM before tourist tour buses arrive.\n` +
      `• **Rooftop Terraces**: Look for public library, museum, or department store rooftop observatories—they often offer panoramic skyline views for free or the price of a coffee!`;
  }

  // 10. Default Smart Contextual Response
  return `✨ **Itinera Field Advisor Recommendation for ${destination}**:\n\n` +
    `Regarding your inquiry on **"${userQuery}"**:\n\n` +
    `When traveling in ${destination}, the key to an unforgettable journey is striking a harmonious balance between structured discovery and relaxed spontaneity. ` +
    `Plan your morning stops for major landmarks before peak crowds, keep a flexible 2-hour window in the afternoon for neighborhood wandering, and enjoy the evening atmosphere.\n\n` +
    `💡 *Need more specifics? You can ask me about:*\n` +
    `• **"How do I use the metro / transit?"**\n` +
    `• **"What are the dining customs and tipping etiquette?"**\n` +
    `• **"Show my Day 1 itinerary schedule"**\n` +
    `• **"Essential local phrases to know"**`;
}
