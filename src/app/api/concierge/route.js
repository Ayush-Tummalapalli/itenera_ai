import { generateSmartConciergeAnswer } from '@/lib/conciergeKnowledge';

const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-3.8-flash',
  'gemini-1.5-pro'
];

async function callGeminiChat(apiKey, systemInstructions, contents) {
  let lastError = null;

  for (const modelId of GEMINI_MODELS) {
    try {
      console.log(`Calling Gemini Concierge with model: ${modelId}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s fast failover

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemInstructions }]
              },
              ...contents
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 900
            }
          })
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const err = await response.text();
        console.warn(`Gemini concierge model ${modelId} failed (${response.status}):`, err);
        lastError = new Error(`Gemini API Error: ${err}`);
      }
    } catch (err) {
      console.warn(`Error in concierge model ${modelId}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini concierge models failed.');
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages = [], destination = 'Destination', tripContext = {} } = body;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      return Response.json({ success: false, error: 'A message is required.' }, { status: 400 });
    }

    // Support key passed from client header, body, or server env
    const headerKey = req.headers.get('x-gemini-key');
    const geminiKey = headerKey || body.apiKey || process.env.GEMINI_API_KEY;

    // Convert client chat history to Gemini format
    const geminiContents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    let scheduleSummary = '';
    if (tripContext.days && Array.isArray(tripContext.days)) {
      scheduleSummary = tripContext.days.map(d => 
        `Day ${d.dayNumber} (${d.title}): ` + (d.stops ? d.stops.join(' -> ') : 'Sightseeing')
      ).join('\n');
    }

    const systemInstructions = `
You are the Itinera AI Travel Concierge—an exceptionally knowledgeable, warm, and sophisticated personal travel guide.
The traveler is currently planning or exploring "${destination}".

TRIP CONTEXT:
- Title: ${tripContext.title || destination + ' Itinerary'}
- Companion: ${tripContext.companionType || 'Solo Traveler'}
- Estimated Budget: ${tripContext.estimatedBudgetPerPax || 'Moderate'}
- Preferences: Pace: ${tripContext.preferences?.pace || 'Balanced'}, Dietary: ${tripContext.preferences?.dietary || 'None'}
${scheduleSummary ? `\nSCHEDULE STOPS:\n${scheduleSummary}\n` : ''}

INSTRUCTIONS:
1. Provide concise, highly actionable, expert travel advice directly addressing the user's question.
2. Structure your reply cleanly using bold headings, concise bullet points, and practical tips.
3. If asked about their itinerary or stops, reference the schedule provided above accurately.
4. Keep the tone sophisticated, culturally respectful, encouraging, and clear.
`;

    let reply = null;

    if (geminiKey && geminiKey.trim().length > 10 && !geminiKey.includes('your_gemini_api_key')) {
      try {
        reply = await callGeminiChat(geminiKey, systemInstructions, geminiContents);
      } catch (err) {
        console.warn('Gemini live chat call failed, switching to smart knowledge engine:', err.message);
      }
    }

    // High-intelligence contextual fallback engine
    if (!reply) {
      reply = generateSmartConciergeAnswer(lastMessage.content, destination, tripContext);
    }

    return Response.json({
      success: true,
      reply: reply,
      isLiveAI: Boolean(geminiKey && geminiKey.trim().length > 10 && !geminiKey.includes('your_gemini_api_key'))
    });

  } catch (error) {
    console.error('Concierge route error:', error);
    return Response.json({
      success: true,
      reply: generateSmartConciergeAnswer('travel advice', 'your destination', {})
    });
  }
}
