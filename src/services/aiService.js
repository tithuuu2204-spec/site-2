import { EXPERIENCES } from '../data/seedExperiences';

const API_URL = '/api/plan-trip';

export const aiService = {
  async generateTrip(params) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("API planner unavailable, using local fallback generator");
    }
    
    return this.localFallbackPlan(params);
  },

  localFallbackPlan(params) {
    // Generate a basic realistic JSON structure locally
    const dest = params.destination || params.fromCity || 'Destination';
    const days = parseInt(params.tripDays) || 3;
    const baseCost = params.budget === 'Luxury' ? 15000 : params.budget === 'Premium' ? 8000 : params.budget === 'Standard' ? 4000 : 2000;
    
    const itinerary = [];
    for(let i=1; i<=days; i++) {
      itinerary.push({
        day: `Day ${i}`,
        date: new Date(new Date(params.startDate || new Date()).getTime() + (i-1)*86400000).toISOString(),
        title: i === 1 ? `Arrival in ${dest} & Local Exploration` : i === days ? `Final Sightseeing & Departure` : `Exploring the heart of ${dest}`,
        activities: [
          { time: '10:00 AM', type: 'Attraction', title: `Morning visit to famous spot in ${dest}`, description: 'Start your day exploring the local heritage.', duration: '2 hrs', estimatedCost: baseCost * 0.1 },
          { time: '01:00 PM', type: 'Food', title: `Authentic Local Lunch`, description: 'Enjoy regional delicacies at a highly rated local restaurant.', duration: '1 hr', estimatedCost: baseCost * 0.2 },
          { time: '04:00 PM', type: i === 2 && params.experienceId ? 'Experience' : 'Attraction', title: params.experienceId ? EXPERIENCES.find(e => e.id === params.experienceId)?.title || 'Main Experience' : 'Evening Sightseeing', description: 'The highlight of your day.', duration: '3 hrs', estimatedCost: baseCost * 0.4, highlight: i === 2 }
        ]
      });
    }

    return {
      tripTitle: `${days}-Day ${params.pace || 'Balanced'} Trip to ${dest}`,
      summary: `A carefully curated itinerary matching your preferences for ${dest}, balancing popular attractions with hidden gems.`,
      fromCity: params.fromCity || 'Your location',
      toCity: dest,
      totalEstimatedCost: baseCost * days * (parseInt(params.travelers) || 1),
      costBreakdown: {
        transport: baseCost * 0.5,
        hotel: baseCost * days * 0.4,
        food: baseCost * days * 0.3,
        activities: baseCost * days * 0.3,
      },
      days: itinerary
    };
  }
};
