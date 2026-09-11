import { RESTAURANTS } from '../data/seedRestaurants';

export const INTEGRATION_STATUS = 'MOCK - Ready for API';

export const restaurantService = {
  async getRestaurants(city) {
    try {
      const res = await fetch(`/api/restaurants?city=${encodeURIComponent(city || '')}`);
      if (res.ok) return await res.json();
    } catch (err) {}
    
    let results = [...RESTAURANTS];
    if (city) {
      results = results.filter(r => r.city.toLowerCase() === city.toLowerCase());
    }
    return results;
  }
};
