import { validateAndCleanItinerary } from '@/lib/schemaValidator';
import { getMockItinerary } from '@/lib/mockItinerary';

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-3.8-flash',
  'gemini-1.5-pro'
];

async function callGeminiWithFallback(apiKey, systemInstructions, userPrompt) {
  let lastError = null;

  for (const modelId of GEMINI_MODELS) {
    try {
      console.log(`Calling Official Gemini API with model: ${modelId}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemInstructions}\n\nUser Request: "${userPrompt}"` }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) return content;
      } else {
        const errText = await response.text();
        console.warn(`Gemini model ${modelId} failed (${response.status}): ${errText}`);
        lastError = new Error(`Gemini API Error (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.warn(`Error calling Gemini model ${modelId}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to return a response.');
}

export async function POST(req) {
  let userPrompt = '';
  let companionType = 'Solo Traveler';
  let preferences = { pace: 'Balanced', dietary: 'None', interests: [] };

  try {
    const body = await req.json();
    userPrompt = body.prompt || '';
    companionType = body.companionType || 'Solo Traveler';
    if (body.preferences && typeof body.preferences === 'object') {
      preferences = {
        pace: body.preferences.pace || 'Balanced',
        dietary: body.preferences.dietary || 'None',
        interests: Array.isArray(body.preferences.interests) ? body.preferences.interests : []
      };
    }

    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      return Response.json(
        { success: false, error: 'Prompt is required. Please describe your travel plans.' },
        { status: 400 }
      );
    }

    const headerKey = req.headers.get('x-gemini-key');
    const geminiKey = headerKey || body.apiKey || process.env.GEMINI_API_KEY;

    const dietaryInstruction = preferences.dietary && preferences.dietary !== 'None'
      ? `CRITICAL DIETARY REQUIREMENT: The user strictly follows a "${preferences.dietary}" diet. ALL food stops, dining recommendations, and meal highlights MUST be strictly ${preferences.dietary}-friendly.`
      : '';

    const paceInstruction = preferences.pace === 'Relaxed'
      ? 'TRAVEL PACE: Relaxed. Include only 2-3 stops per day with spacious time windows.'
      : preferences.pace === 'Packed'
      ? 'TRAVEL PACE: Fast-Paced / Packed. Include 4-5 energetic stops per day covering extensive ground.'
      : 'TRAVEL PACE: Balanced. Include 3-4 well-paced stops per day.';

    const interestsInstruction = preferences.interests && preferences.interests.length > 0
      ? `CORE INTERESTS: Heavily prioritize stops matching: ${preferences.interests.join(', ')}.`
      : '';

    const systemInstructions = `
You are an elite Autonomous AI Travel Agent.
You do not just provide a basic schedule; you autonomously formulate an end-to-end master travel dossier based on the user's destination, companion party, pace, and interests.
Your plan MUST include:
1. Hand-picked accommodations (Luxury, Boutique, Value) suited to the traveler's party.
2. Iconic curated dining & food scene (breakfast spots, legendary local lunches, must-visit dinner reservations, signature dishes).
3. Strategic AI Agent intelligence (route rationale, transit hacks, reservation warnings).
4. Realistic day-by-day activity blueprint with morning, afternoon, and evening flows.

USER TRAVEL CUSTOMIZATIONS:
- Companion Type: "${companionType}"
- ${paceInstruction}
- ${dietaryInstruction}
- ${interestsInstruction}

REQUIRED SCHEMAS & FEATURES:
1. Include "companionType": "${companionType}".
2. Include "preferences": ${JSON.stringify(preferences)}.
3. Estimate total budget per person in USD (estimatedBudgetPerPax, budgetBreakdown: stay, food, activities):
   - CRITICAL BUDGET CALCULATION: Accurately calculate the budget by multiplying the exact duration in days by realistic destination daily rates:
     * High-cost western / east-asian capitals (Tokyo, Paris, New York, London, Zurich): $180 - $260 / person / day.
     * Mid-tier European / developed cities (Rome, Barcelona, Berlin, Madrid): $140 - $190 / person / day.
     * Emerging / tropical / South Asian destinations (Goa, Kerala, Bali, Thailand, Vietnam): $55 - $90 / person / day.
   - Adjust for companion party: Solo (+15% single supplement), Couple (+5% romantic dining), Family with Kids (-10% family rate), Group of Friends (-15% shared rooms/villas).
   - Divide total into breakdown: stay (~45%), food (~35%), activities (~20%).
4. Provide "accommodations": Array of 3 distinct hotel/stay options (Luxury, Boutique, Value):
   - Each with: name, type, area, priceRange, rating (e.g. "4.8"), description, bestFor, amenities (array of 3-4 strings), bookingTip.
5. Provide "curatedDining": Array of 4-5 hand-selected restaurants and culinary gems:
   - Each with: name, cuisine, area, mealType, priceRange (per person), rating, signatureDishes (array of 2-3 specific local dishes), ambiance, reservationTip.
6. Provide "agentNotes": Object containing:
   - "rationale": Why this route and sequence was chosen.
   - "transitAdvice": Local transportation protocol (metro cards, scooters, ride apps, walking tips).
   - "safetyAndScams": Practical local safety and common tourist trap warnings.
   - "reservationAlerts": Specific tickets or dinner reservations requiring advance booking.
7. If user requests an unrealistically low budget (under $30/day in Asia or under $65/day in Europe/US), set isBudgetTooLow: true and budgetWarning string.
8. Provide a "weatherAdvisor" object (bestSeason, averageTemp, packingTip).
9. Provide a destination & weather tailored "packingChecklist" object (documents, clothing, electronics, essentials).

Required JSON Schema:
{
  "tripTitle": "Catchy title for the trip",
  "destination": "City, Country",
  "duration": "X Days",
  "summary": "Short 2-sentence summary",
  "companionType": "${companionType}",
  "preferences": {
    "pace": "${preferences.pace}",
    "dietary": "${preferences.dietary}",
    "interests": ${JSON.stringify(preferences.interests)}
  },
  "estimatedBudgetPerPax": "$XXX / person",
  "budgetBreakdown": {
    "stay": "$XXX",
    "food": "$XXX",
    "activities": "$XXX"
  },
  "accommodations": [
    {
      "id": "acc-1",
      "name": "Hotel / Resort Name",
      "type": "Luxury Resort | Boutique Hotel | Smart Value Stay",
      "area": "Neighborhood / District",
      "priceRange": "$XXX - $XXX / night",
      "rating": "4.8",
      "description": "Why the agent picked this stay",
      "bestFor": "Target audience",
      "amenities": ["Amenity 1", "Amenity 2", "Amenity 3"],
      "bookingTip": "Specific insider booking advice"
    }
  ],
  "curatedDining": [
    {
      "id": "rest-1",
      "name": "Restaurant / Café Name",
      "cuisine": "Cuisine style",
      "area": "Neighborhood",
      "mealType": "Lunch & Dinner | Breakfast & Brunch | Evening Dining",
      "priceRange": "$XX - $XX / person",
      "rating": "4.8",
      "signatureDishes": ["Dish 1", "Dish 2", "Dish 3"],
      "ambiance": "Atmosphere description",
      "reservationTip": "Reservation guideline"
    }
  ],
  "agentNotes": {
    "rationale": "Strategic explanation of itinerary flow",
    "transitAdvice": "Best way to commute locally",
    "safetyAndScams": "Scam or safety watchouts",
    "reservationAlerts": "Tickets/slots to book in advance"
  },
  "weatherAdvisor": {
    "bestSeason": "Best season",
    "averageTemp": "Avg temp",
    "packingTip": "Packing tip"
  },
  "packingChecklist": {
    "documents": ["Item 1", "Item 2"],
    "clothing": ["Item 1", "Item 2"],
    "electronics": ["Item 1", "Item 2"],
    "essentials": ["Item 1", "Item 2"]
  },
  "isBudgetTooLow": false,
  "budgetWarning": null,
  "days": [
    {
      "dayNumber": 1,
      "title": "Theme for Day 1",
      "stops": [
        {
          "id": "stop-1-1",
          "title": "Place / Activity Name",
          "time": "09:00 AM - 11:30 AM",
          "description": "2-3 sentences explaining what to do here",
          "category": "Sightseeing | Food | Culture | Relaxation | Shopping | Adventure",
          "location": "Landmark / Area",
          "estimatedCost": "$15 - $25"
        }
      ]
    }
  ]
}

Return ONLY raw JSON object.
`;

    let responseText = null;

    // Call Official Google Gemini API
    if (geminiKey && geminiKey.trim().length > 10 && !geminiKey.includes('your_gemini_api_key')) {
      try {
        responseText = await callGeminiWithFallback(geminiKey, systemInstructions, userPrompt);
      } catch (err) {
        console.warn('Gemini API call failed, using zero-crash fallback engine:', err.message);
      }
    }

    if (!responseText) {
      console.warn('Gemini API key missing or API call failed. Returning zero-crash fallback mock data.');
      const mockData = getMockItinerary(userPrompt || 'Custom Trip', null, companionType, preferences);
      return Response.json({ success: true, data: mockData });
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedJSON = JSON.parse(cleanedText);
    const validatedItinerary = validateAndCleanItinerary(parsedJSON);
    validatedItinerary.isMock = false;

    return Response.json({
      success: true,
      data: validatedItinerary
    });

  } catch (error) {
    console.error('API Generation Error:', error.message);
    const mockData = getMockItinerary(userPrompt || 'Custom Trip', null, companionType, preferences);
    return Response.json({
      success: true,
      data: mockData,
      warning: `AI generation notice: ${error.message}`
    });
  }
}
