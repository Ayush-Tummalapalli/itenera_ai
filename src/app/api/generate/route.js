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
You are an expert travel planner assistant.
Generate a realistic, day-by-day travel itinerary based on the user request in JSON format.

USER TRAVEL CUSTOMIZATIONS:
- Companion Type: "${companionType}"
- ${paceInstruction}
- ${dietaryInstruction}
- ${interestsInstruction}

REQUIRED SCHEMAS & FEATURES:
1. Include "companionType": "${companionType}".
2. Include "preferences": ${JSON.stringify(preferences)}.
3. Estimate total budget per person in USD (estimatedBudgetPerPax, budgetBreakdown: stay, food, activities).
4. If user requests an unrealistically low budget (under $30/day), set isBudgetTooLow: true and budgetWarning string.
5. Provide a "weatherAdvisor" object (bestSeason, averageTemp, packingTip).
6. Provide a destination & weather tailored "packingChecklist" object:
   - "documents": Array of strings (e.g., ["Passport & Visas", "Travel Insurance Policy"])
   - "clothing": Array of strings (e.g., ["Linen shirts", "Walking sneakers", "Swimwear"])
   - "electronics": Array of strings (e.g., ["Universal Adapter", "Power Bank", "Camera Charger"])
   - "essentials": Array of strings (e.g., ["High SPF Sunscreen", "Bug Spray", "Refillable Bottle"])

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
