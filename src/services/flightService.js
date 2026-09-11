import { getMockFlights, CITY_AIRPORTS } from '../data/seedFlights';

export const INTEGRATION_STATUS = 'MOCK - Ready for API';

export const flightService = {
  async searchFlights(fromCity, toCity, date, passengers = 1) {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockFlights(fromCity, toCity, date, passengers);
  },
  
  getAirports() {
    return Object.keys(CITY_AIRPORTS).map(city => ({
      city,
      ...CITY_AIRPORTS[city]
    }));
  }
};
