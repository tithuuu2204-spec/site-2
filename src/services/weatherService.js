export const INTEGRATION_STATUS = 'REAL - Open-Meteo (Free)';

const CITY_COORDS = {
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
  'Amritsar': { lat: 31.6340, lng: 74.8723 },
  'Delhi': { lat: 28.6139, lng: 77.2090 }
};

export const weatherService = {
  async getCurrentWeather(city) {
    const coords = CITY_COORDS[city];
    if (!coords) return null;
    
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true`);
      if (res.ok) {
        const data = await res.json();
        return {
          temperature: data.current_weather.temperature,
          description: this.getWeatherDescription(data.current_weather.weathercode),
          tip: this.getTravelRecommendation(data.current_weather.weathercode, data.current_weather.temperature)
        };
      }
    } catch (err) {
      console.error("Weather API failed", err);
    }
    return null;
  },

  getWeatherDescription(code) {
    const codes = {
      0: 'Clear sky',
      1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return codes[code] || 'Unknown';
  },

  getTravelRecommendation(code, temp) {
    if (temp > 35) return 'Very hot. Stay hydrated and avoid afternoon sun.';
    if (code >= 61 && code <= 65) return 'Rainy. Carry an umbrella or raincoat.';
    if (temp < 15) return 'Cold weather. Carry a jacket.';
    return 'Perfect weather for exploring!';
  }
};
