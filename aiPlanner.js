import fetch from 'node-fetch';

/**
 * AI Trip Planner Integration
 * Tries Gemini API if key is available, else falls back to a realistic local generation.
 */

export async function generateTripPlan(params) {
  const { destination, tripDays, budget, travelers, interests, fromCity } = params;
  
  const dest = destination || fromCity || 'Destination';
  const days = parseInt(tripDays) || 3;
  const numTravelers = parseInt(travelers) || 2;
  const isLuxury = budget === 'Luxury' || budget === 'Premium';
  const baseCost = isLuxury ? 10000 : 3000;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.length > 5) {
    try {
      const prompt = `Create a ${days}-day detailed travel itinerary for ${dest} for ${numTravelers} people. 
      Budget level: ${budget}. Interests: ${interests?.join(', ') || 'General'}.
      Return ONLY a raw JSON object with this exact structure (no markdown, no backticks):
      {
        "tripTitle": "A catchy title",
        "summary": "A 2 sentence summary",
        "fromCity": "${fromCity}",
        "toCity": "${dest}",
        "totalEstimatedCost": number,
        "costBreakdown": { "transport": number, "hotel": number, "food": number, "activities": number },
        "days": [
          {
            "day": "Day 1",
            "date": "2024-10-01",
            "title": "Day title",
            "activities": [
              { "time": "10:00 AM", "type": "Attraction", "title": "Name", "description": "Desc", "duration": "2 hrs", "estimatedCost": 500, "highlight": false }
            ]
          }
        ]
      }`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        let text = data.candidates[0].content.parts[0].text;
        // Clean markdown
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
      }
    } catch (err) {
      console.error("Gemini API generation failed, falling back to local algorithm", err);
    }
  }

  // Local Algorithmic Fallback
  return fallbackPlan(dest, days, baseCost, numTravelers, params);
}

function fallbackPlan(dest, days, baseCost, numTravelers, params) {
  const startDate = params.startDate ? new Date(params.startDate) : new Date();
  
  const itinerary = [];
  for(let i=1; i<=days; i++) {
    const curDate = new Date(startDate.getTime() + (i-1)*86400000);
    itinerary.push({
      day: `Day ${i}`,
      date: curDate.toISOString(),
      title: i === 1 ? `Arrival in ${dest}` : i === days ? `Final Sightseeing & Departure` : `Exploring ${dest}`,
      activities: [
        { time: '09:00 AM', type: 'Attraction', title: `Morning at ${dest} Landmark`, description: 'Start the day exploring a famous local spot.', duration: '2.5 hrs', estimatedCost: baseCost * 0.15, highlight: false },
        { time: '01:00 PM', type: 'Food', title: `Lunch at highly rated restaurant`, description: 'Taste local authentic cuisine.', duration: '1 hr', estimatedCost: baseCost * 0.2, highlight: false },
        { time: '03:30 PM', type: 'Experience', title: `Guided Local Experience`, description: 'Immerse yourself in the local culture.', duration: '3 hrs', estimatedCost: baseCost * 0.4, highlight: i === 2 }
      ]
    });
  }

  const perPersonCost = baseCost * days;
  const totalCost = perPersonCost * numTravelers;

  return {
    tripTitle: `${days}-Day Trip to ${dest}`,
    summary: `A carefully curated itinerary for ${dest} matching your budget and interests.`,
    fromCity: params.fromCity || 'Origin',
    toCity: dest,
    totalEstimatedCost: totalCost,
    costBreakdown: {
      transport: totalCost * 0.2,
      hotel: totalCost * 0.4,
      food: totalCost * 0.2,
      activities: totalCost * 0.2,
    },
    days: itinerary
  };
}
