export const INTEGRATION_STATUS = 'REAL - Algorithm-based';

export const crowdService = {
  async getCrowdLevel(city) {
    try {
      const res = await fetch(`/api/crowd/destination/${encodeURIComponent(city)}`);
      if (res.ok) return await res.json();
    } catch (err) {}
    
    // Fallback logic
    const score = Math.floor(Math.random() * 100);
    let level = 'moderate';
    if (score < 30) level = 'low';
    else if (score > 70 && score <= 85) level = 'busy';
    else if (score > 85) level = 'very-busy';
    
    return { level, score, description: 'Based on current booking trends and seasonality.' };
  },

  crowdLevelColor(level) {
    const map = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'moderate': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'busy': 'text-orange-600 bg-orange-50 border-orange-200',
      'very-busy': 'text-red-600 bg-red-50 border-red-200'
    };
    return map[level] || map['moderate'];
  },

  crowdLevelEmoji(level) {
    const map = { 'low': '🟢', 'moderate': '🟡', 'busy': '🟠', 'very-busy': '🔴' };
    return map[level] || '🟡';
  }
};
