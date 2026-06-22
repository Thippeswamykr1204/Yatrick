import { config } from '@/config/env.js';
import { ExternalApiError } from '@/utils/errors.js';
import logger from '../utils/logger.js';
import {
  AIGeneratedTrip,
  AIGenerateInput,
  AIOptimizedBudget,
  AIItineraryDay,
  AIChatMessage,
} from '@/types/ai.types.js';
import { ITrip } from '@/models/Trip.js';

// ==================== RETRY MECHANISM ====================

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 4,
  delayMs = 1000
): Promise<any> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if ((response.status === 429 || response.status === 503) && retries > 0) {
        logger.warn(`Gemini rate limited. Retrying in ${delayMs}ms. Retries left: ${retries}`);
        await sleep(delayMs);
        return fetchWithRetry(url, options, retries - 1, delayMs * 2);
      }
      const errorBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0 && error instanceof Error && !error.message.includes('Gemini API error')) {
      logger.warn(`Gemini request failed. Retrying in ${delayMs}ms. Retries left: ${retries}`);
      await sleep(delayMs);
      return fetchWithRetry(url, options, retries - 1, delayMs * 2);
    }
    throw error;
  }
}

// ==================== HOTEL SANITIZER ====================

function sanitizeHotels(hotels: any[] = []): AIGeneratedTrip['hotels'] {
  return hotels.map((hotel) => {
    const tier: 'Budget' | 'Mid-Range' | 'Luxury' =
      hotel.tier === 'Luxury'
        ? 'Luxury'
        : hotel.tier === 'Mid-Range'
        ? 'Mid-Range'
        : 'Budget';

    return {
      name: hotel.name || 'Hotel',

      tier,

      estimatedCostPerNightUSD: Number(
        hotel.estimatedCostPerNightUSD ??
        hotel.costPerNight ??
        hotel.pricePerNight ??
        hotel.nightlyRate ??
        1000
      ),

      rating: Math.min(
        5,
        Math.max(
          0,
          Number(hotel.rating ?? 4)
        )
      ),

      address: hotel.address || '',

      amenities: Array.isArray(hotel.amenities)
        ? hotel.amenities
        : [],
    };
  });
}

// ==================== GEMINI CALLER ====================

async function callGemini(prompt: string): Promise<string> {
  const apiKey = config.gemini.apiKey;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  const data = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new ExternalApiError('Empty response from Gemini API');
  }

  return text;
}

async function callGeminiChat(
  prompt: string,
  history: AIChatMessage[] = []
): Promise<string> {
  const apiKey = config.gemini.apiKey;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    ...history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
    { role: 'user', parts: [{ text: prompt }] },
  ];

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
    },
  };

  const data = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new ExternalApiError('Empty response from Gemini API');
  }

  return text;
}

// ==================== ITINERARY GENERATION ====================

export const generateItinerary = async (
  input: AIGenerateInput
): Promise<AIGeneratedTrip> => {
  const { destination, durationDays, budgetTier, interests } = input;

  const budgetGuidance = {
    Low: 'budget-friendly, hostels/dharamshalas, street food/dhabas, free/cheap attractions under ₹1500/day',
    Medium: 'mid-range hotels, local restaurants, mix of paid/free activities ₹3000-6000/day',
    High: 'luxury hotels, fine dining, premium experiences, over ₹10000/day',
  };

  const prompt = `
You are an expert Indian travel planner. Generate a detailed ${durationDays}-day travel itinerary for ${destination}.

Traveler profile:
- Budget: ${budgetTier} (${budgetGuidance[budgetTier]})
- Interests: ${interests.length > 0 ? interests.join(', ') : 'general sightseeing'}
- Duration: ${durationDays} days

IMPORTANT: All costs must be in Indian Rupees (INR). Use realistic Indian market rates.

Return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation - just raw JSON:
{
  "itinerary": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "title": "Activity name",
          "description": "2-3 sentence description with practical tips",
          "estimatedCostUSD": 500,
          "timeOfDay": "Morning",
          "location": "Specific address or area"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "tier": "Budget",
      "estimatedCostPerNightUSD": 1200,
      "rating": 4.2,
      "address": "Hotel address",
      "amenities": ["WiFi", "Breakfast", "AC"]
    }
  ],
  "estimatedBudget": {
    "transport": 3000,
    "accommodation": 8400,
    "food": 4500,
    "activities": 3000,
    "total": 18900
  },
  "packingList": [
    {
      "item": "Aadhaar Card / Passport",
      "category": "Documents",
      "isPacked": false,
      "weatherRelevant": false
    }
  ]
}

Requirements:
- Generate exactly ${durationDays} days
- Each day has 3-4 activities across Morning, Afternoon, Evening
- Generate 3 hotels: one Budget, one Mid-Range, one Luxury
- ALL amounts are in Indian Rupees (INR) — realistic Indian prices
- Budget tier pricing guide:
  * Low: hotels ₹500-1500/night, activities ₹50-300 each, food ₹200-500/day total
  * Medium: hotels ₹2000-5000/night, activities ₹300-1000 each, food ₹500-1500/day total
  * High: hotels ₹8000-25000/night, activities ₹1000-5000 each, food ₹2000-5000/day total
- estimatedBudget.total must equal sum of transport + accommodation + food + activities
- Packing list: 15-20 items, India-specific (include Aadhaar/ID, weather-appropriate clothing)
- timeOfDay must be exactly "Morning", "Afternoon", or "Evening"
- tier must be exactly "Budget", "Mid-Range", or "Luxury"
- category must be exactly "Documents", "Clothing", "Gear", "Toiletries", or "Other"
`.trim();

  try {
    logger.info(`Generating itinerary for ${destination} (${durationDays} days, ${budgetTier})`);
    const rawText = await callGemini(prompt);

    let parsed: AIGeneratedTrip;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new ExternalApiError('Gemini returned invalid JSON');
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    if (!parsed.itinerary || !parsed.hotels || !parsed.estimatedBudget || !parsed.packingList) {
      throw new ExternalApiError('Gemini response missing required fields');
    }

    parsed.hotels = sanitizeHotels(parsed.hotels);

    logger.info(`Generated Hotels: ${JSON.stringify(parsed.hotels)}`);
    logger.info(`Itinerary generated successfully for ${destination}`);
    return parsed;
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    logger.error('Error generating itinerary:', error);
    throw new ExternalApiError('Failed to generate itinerary. Please try again.');
  }
};

// ==================== DAY REGENERATION ====================

export const regenerateDay = async (
  trip: ITrip,
  dayNumber: number,
  userFeedback: string
): Promise<AIItineraryDay> => {
  const budgetPricing = {
    Low: 'activities ₹50-300 each, use public transport',
    Medium: 'activities ₹300-1000 each, mix of auto/cab',
    High: 'activities ₹1000-5000 each, private cab/luxury',
  };

  const prompt = `
You are an expert Indian travel planner. Regenerate Day ${dayNumber} of a trip to ${trip.destination}.

Trip context:
- Destination: ${trip.destination}
- Budget: ${trip.budgetTier} (${budgetPricing[trip.budgetTier]})
- Interests: ${trip.interests.join(', ')}
- Total duration: ${trip.durationDays} days
- User feedback: "${userFeedback}"

Current Day ${dayNumber} activities:
${JSON.stringify(trip.itinerary.find((d) => d.dayNumber === dayNumber)?.activities || [], null, 2)}

IMPORTANT: All costs must be in Indian Rupees (INR). Use realistic Indian market rates.

Return ONLY a valid JSON object with NO markdown, NO backticks - just raw JSON:
{
  "dayNumber": ${dayNumber},
  "activities": [
    {
      "title": "Activity name",
      "description": "2-3 sentence description with practical tips",
      "estimatedCostUSD": 500,
      "timeOfDay": "Morning",
      "location": "Specific address or area"
    }
  ]
}

Requirements:
- Generate 3-4 activities for Day ${dayNumber}
- Address user feedback: "${userFeedback}"
- Activities must be different from current Day ${dayNumber}
- ALL costs in Indian Rupees (INR)
- Match budget tier ${trip.budgetTier} pricing
- timeOfDay must be exactly "Morning", "Afternoon", or "Evening"
`.trim();

  try {
    logger.info(`Regenerating day ${dayNumber} for trip ${trip._id}`);
    const rawText = await callGemini(prompt);

    let parsed: AIItineraryDay;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new ExternalApiError('Invalid JSON from Gemini');
      parsed = JSON.parse(jsonMatch[0]);
    }

    if (!parsed.activities || !Array.isArray(parsed.activities)) {
      throw new ExternalApiError('Invalid day structure from Gemini');
    }

    logger.info(`Day ${dayNumber} regenerated successfully`);
    return parsed;
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    logger.error('Error regenerating day:', error);
    throw new ExternalApiError('Failed to regenerate day. Please try again.');
  }
};

// ==================== BUDGET OPTIMIZER ====================

export const optimizeBudget = async (
  trip: ITrip,
  targetBudgetINR: number
): Promise<AIOptimizedBudget> => {
  const prompt = `
You are an expert Indian travel budget optimizer. Analyze this trip and suggest ways to reduce cost.

Trip details:
- Destination: ${trip.destination}
- Duration: ${trip.durationDays} days
- Budget tier: ${trip.budgetTier}
- Current estimated budget (in INR): ${JSON.stringify(trip.estimatedBudget)}
- Current hotels: ${JSON.stringify(trip.hotels)}
- User target budget: ₹${targetBudgetINR}

IMPORTANT: All amounts must be in Indian Rupees (INR).

Return ONLY a valid JSON object with NO markdown, NO backticks - just raw JSON:
{
  "originalBudget": {
    "transport": 3000,
    "accommodation": 8400,
    "food": 4500,
    "activities": 3000,
    "total": 18900
  },
  "optimizedBudget": {
    "transport": 2000,
    "accommodation": 4500,
    "food": 2500,
    "activities": 1500,
    "total": 10500
  },
  "savings": 8400,
  "suggestions": {
    "hotels": [
      {
        "name": "Budget Hotel Name",
        "tier": "Budget",
        "estimatedCostPerNightUSD": 800,
        "rating": 3.8,
        "address": "Hotel address",
        "amenities": ["WiFi", "AC"]
      }
    ],
    "activityAdjustments": [
      "Visit government museums on free entry days",
      "Use state bus (KSRTC/MSRTC) instead of private taxis to save ₹1500"
    ],
    "generalTips": [
      "Book train tickets 60 days in advance on IRCTC for Tatkal savings",
      "Eat at local dhabas and thali restaurants instead of tourist hotels"
    ]
  }
}

Requirements:
- optimizedBudget total must be at or under ₹${targetBudgetINR}
- ALL amounts in Indian Rupees (INR)
- Suggest 2-3 cheaper hotel alternatives (Budget tier), costs in INR
- List 3-5 specific India-relevant activity cost reductions
- List 3-5 India-specific money-saving tips (IRCTC, dhabas, state buses etc)
- savings = originalBudget.total - optimizedBudget.total
`.trim();

  try {
    logger.info(`Optimizing budget for trip ${trip._id}, target: ₹${targetBudgetINR}`);
    const rawText = await callGemini(prompt);

    let parsed: AIOptimizedBudget;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new ExternalApiError('Invalid JSON from Gemini');
      parsed = JSON.parse(jsonMatch[0]);
    }

    logger.info(`Budget optimized: saved ₹${parsed.savings}`);
    return parsed;
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    logger.error('Error optimizing budget:', error);
    throw new ExternalApiError('Failed to optimize budget. Please try again.');
  }
};

// ==================== AI TRIP ASSISTANT ====================

export const chatWithAssistant = async (
  trip: ITrip,
  userMessage: string,
  history: AIChatMessage[] = []
): Promise<string> => {
  const systemContext = `
You are a knowledgeable Indian travel assistant for a trip to ${trip.destination}.

Trip context:
- Destination: ${trip.destination}
- Duration: ${trip.durationDays} days
- Budget: ${trip.budgetTier}
- Interests: ${trip.interests.join(', ')}
- Itinerary days planned: ${trip.itinerary.length}
- Status: ${trip.status}

Answer questions helpfully and concisely based on this specific trip context.
Provide practical, actionable India-specific advice — mention train routes, local transport,
food recommendations, safety tips, best time to visit attractions.
Keep answers under 200 words unless detail is specifically requested.
Always provide costs in Indian Rupees (INR).
`;

  const contextualMessage = `${systemContext}\n\nUser question: ${userMessage}`;

  try {
    logger.info(`AI chat for trip ${trip._id}: "${userMessage.substring(0, 50)}..."`);
    const response = await callGeminiChat(contextualMessage, history);
    return response;
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    logger.error('Error in AI chat:', error);
    throw new ExternalApiError('AI assistant unavailable. Please try again.');
  }
};

// ==================== PACKING LIST GENERATOR ====================

export const generatePackingList = async (
  trip: ITrip
): Promise<Array<{
  item: string;
  category: 'Documents' | 'Clothing' | 'Gear' | 'Toiletries' | 'Other';
  isPacked: boolean;
  weatherRelevant: boolean;
}>> => {
  const activities = trip.itinerary
    .flatMap((day) => day.activities)
    .map((a) => a.title)
    .join(', ');

  const prompt = `
You are an Indian travel packing expert. Generate a weather-aware packing list for this trip.

Trip details:
- Destination: ${trip.destination}
- Duration: ${trip.durationDays} days
- Budget: ${trip.budgetTier}
- Interests: ${trip.interests.join(', ')}
- Planned activities: ${activities || 'General sightseeing'}

Return ONLY a valid JSON array with NO markdown, NO backticks - just raw JSON:
[
  {
    "item": "Aadhaar Card / Passport",
    "category": "Documents",
    "isPacked": false,
    "weatherRelevant": false
  }
]

Requirements:
- Generate 20-25 items total
- Cover all categories: Documents (3-4), Clothing (6-8), Gear (4-5), Toiletries (4-5), Other (2-3)
- Documents must include: Aadhaar/Passport, travel tickets, hotel booking printouts
- Mark weatherRelevant: true for climate-specific items (monsoon gear, woollens for hills etc)
- Include activity-specific gear based on planned activities
- India-specific items: hand sanitizer, ORS packets, mosquito repellent if needed
- category must be exactly "Documents", "Clothing", "Gear", "Toiletries", or "Other"
- All isPacked start as false
`.trim();

  try {
    logger.info(`Generating packing list for trip ${trip._id}`);
    const rawText = await callGemini(prompt);

    let parsed: any[];
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new ExternalApiError('Invalid JSON from Gemini');
      parsed = JSON.parse(jsonMatch[0]);
    }

    if (!Array.isArray(parsed)) {
      throw new ExternalApiError('Packing list must be an array');
    }

    logger.info(`Packing list generated: ${parsed.length} items`);
    return parsed;
  } catch (error) {
    if (error instanceof ExternalApiError) throw error;
    logger.error('Error generating packing list:', error);
    throw new ExternalApiError('Failed to generate packing list. Please try again.');
  }
};