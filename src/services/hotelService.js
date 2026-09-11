import { HOTELS } from '../data/seedHotels';

export const INTEGRATION_STATUS = 'MOCK - Ready for API';

export const hotelService = {
  async getHotels(city, budget) {
    try {
      const query = new URLSearchParams({ city: city || '' }).toString();
      const res = await fetch(`/api/hotels?${query}`);
      if (res.ok) return await res.json();
    } catch (err) {}
    
    // Fallback to mock data
    let results = [...HOTELS];
    if (city) {
      results = results.filter(h => h.city.toLowerCase() === city.toLowerCase());
    }
    return results;
  },

  async getHotelById(id) {
    return HOTELS.find(h => h.id === id) || null;
  }
};
