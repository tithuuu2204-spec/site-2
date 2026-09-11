export const CITY_AIRPORTS = {
  'Ahmedabad': { code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl' },
  'Jaipur': { code: 'JAI', name: 'Jaipur Intl Airport' },
  'Udaipur': { code: 'UDR', name: 'Maharana Pratap Airport' },
  'Varanasi': { code: 'VNS', name: 'Lal Bahadur Shastri Intl' },
  'Goa': { code: 'GOI', name: 'Dabolim Airport' },
  'Amritsar': { code: 'ATQ', name: 'Sri Guru Ram Dass Jee Intl' },
  'Delhi': { code: 'DEL', name: 'Indira Gandhi Intl' },
  'Mumbai': { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl' },
  'Bengaluru': { code: 'BLR', name: 'Kempegowda Intl' },
  'Kochi': { code: 'COK', name: 'Cochin Intl' }
};

export const getMockFlights = (fromCity, toCity, date, passengers = 1) => {
  const from = CITY_AIRPORTS[fromCity] || { code: fromCity.substring(0,3).toUpperCase(), name: `${fromCity} Airport` };
  const to = CITY_AIRPORTS[toCity] || { code: toCity.substring(0,3).toUpperCase(), name: `${toCity} Airport` };

  // Generate a random base price based on a seed to keep it consistent
  const basePrice = 3500 + Math.floor(Math.random() * 4000);

  return [
    {
      id: `fl-${Date.now()}-1`,
      airline: 'IndiGo',
      airlineCode: '6E',
      flightNumber: `6E-${Math.floor(Math.random() * 900) + 100}`,
      from: from.code,
      to: to.code,
      departure: '08:30',
      arrival: '10:15',
      duration: '1h 45m',
      stops: 0,
      price: basePrice * passengers,
      seatsAvailable: 12,
      class: 'Economy'
    },
    {
      id: `fl-${Date.now()}-2`,
      airline: 'Air India',
      airlineCode: 'AI',
      flightNumber: `AI-${Math.floor(Math.random() * 900) + 100}`,
      from: from.code,
      to: to.code,
      departure: '14:20',
      arrival: '16:10',
      duration: '1h 50m',
      stops: 0,
      price: (basePrice + 800) * passengers,
      seatsAvailable: 5,
      class: 'Economy'
    },
    {
      id: `fl-${Date.now()}-3`,
      airline: 'Vistara',
      airlineCode: 'UK',
      flightNumber: `UK-${Math.floor(Math.random() * 900) + 100}`,
      from: from.code,
      to: to.code,
      departure: '18:45',
      arrival: '22:30',
      duration: '3h 45m',
      stops: 1,
      price: (basePrice - 500) * passengers,
      seatsAvailable: 24,
      class: 'Economy'
    }
  ];
};
