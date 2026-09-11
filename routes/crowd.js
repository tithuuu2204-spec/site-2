'use strict';

const express = require('express');
const { getCollection } = require('../db');

const router = express.Router();

// ── City metadata ─────────────────────────────────────────────────────────────
const CITY_PROFILES = {
  ahmedabad: {
    peakMonths: [10, 11, 1],         // Oct, Nov, Jan (Navratri, winter)
    highSeasonMonths: [12, 2, 3],
    peakWeekdays: [5, 6, 0],         // Fri, Sat, Sun
    baseScore: 55,
    alternatives: ['Vadodara', 'Surat', 'Kutch'],
    bestTimeDescription: 'Early mornings on weekdays, avoiding Navratri (October) for lower crowds',
  },
  jaipur: {
    peakMonths: [10, 11, 12, 1, 2],
    highSeasonMonths: [3],
    peakWeekdays: [5, 6, 0],
    baseScore: 65,
    alternatives: ['Bundi', 'Chittorgarh', 'Pushkar'],
    bestTimeDescription: 'Weekday mornings before 9 AM; avoid winter weekends and Holi festival',
  },
  udaipur: {
    peakMonths: [10, 11, 12, 1, 2],
    highSeasonMonths: [3, 9],
    peakWeekdays: [5, 6, 0],
    baseScore: 60,
    alternatives: ['Kumbhalgarh', 'Bundi', 'Nathdwara'],
    bestTimeDescription: 'Early mornings at the ghats; avoid weekends and the November full moon',
  },
  varanasi: {
    peakMonths: [10, 11, 12, 1, 2, 3],
    highSeasonMonths: [4],
    peakWeekdays: [5, 6, 0, 1],      // also Monday (Shiva day)
    baseScore: 70,
    alternatives: ['Prayagraj', 'Bodhgaya', 'Sarnath'],
    bestTimeDescription: 'Ganga Aarti is always crowded; visit ghats at dawn (5–6 AM) on weekdays',
  },
  goa: {
    peakMonths: [11, 12, 1, 2],
    highSeasonMonths: [10, 3],
    peakWeekdays: [5, 6, 0],
    baseScore: 60,
    alternatives: ['Gokarna', 'Murudeshwar', 'Tarkarli'],
    bestTimeDescription: 'South Goa beaches are far less crowded than Baga/Calangute; visit on weekdays',
  },
  delhi: {
    peakMonths: [10, 11, 12, 1, 2],
    highSeasonMonths: [3, 9],
    peakWeekdays: [5, 6, 0],
    baseScore: 75,
    alternatives: ['Agra', 'Mathura', 'Vrindavan'],
    bestTimeDescription: 'Heritage sites before 8 AM; avoid Diwali and Republic Day weekends',
  },
  mumbai: {
    peakMonths: [10, 11, 12, 1, 2],
    highSeasonMonths: [3, 9],
    peakWeekdays: [5, 6, 0],
    baseScore: 80,
    alternatives: ['Alibaug', 'Lonavala', 'Karjat'],
    bestTimeDescription: 'South Mumbai sites on weekday mornings; Marine Drive at dusk on any weekday',
  },
  manali: {
    peakMonths: [5, 6, 7, 8],
    highSeasonMonths: [12, 1, 4],    // snow season also busy
    peakWeekdays: [5, 6, 0],
    baseScore: 65,
    alternatives: ['Kasol', 'Tirthan Valley', 'Spiti Valley'],
    bestTimeDescription: 'Shoulder months (April/September) offer quieter roads and lower hotel prices',
  },
  rishikesh: {
    peakMonths: [9, 10, 11, 2, 3, 4],
    highSeasonMonths: [1],
    peakWeekdays: [5, 6, 0],
    baseScore: 60,
    alternatives: ['Haridwar', 'Mussoorie', 'Lansdowne'],
    bestTimeDescription: 'Visit Monday–Thursday for rafting without weekend crowds',
  },
  kochi: {
    peakMonths: [10, 11, 12, 1, 2],
    highSeasonMonths: [8, 9],        // Onam
    peakWeekdays: [5, 6, 0],
    baseScore: 55,
    alternatives: ['Munnar', 'Alleppey', 'Thekkady'],
    bestTimeDescription: 'Fort Kochi mornings on weekdays before cruise ship tourists arrive',
  },
};

// ── Crowd calculation ─────────────────────────────────────────────────────────
function calcCrowdScore(cityKey, db) {
  const profile = CITY_PROFILES[cityKey];
  if (!profile) return { score: 50, level: 'moderate' };

  const now = new Date();
  const month = now.getMonth() + 1;
  const dow = now.getDay();

  let score = profile.baseScore;

  // Season adjustment
  if (profile.peakMonths.includes(month)) score += 20;
  else if (profile.highSeasonMonths.includes(month)) score += 10;
  else score -= 10; // off-peak

  // Day of week adjustment
  if (profile.peakWeekdays.includes(dow)) score += 10;
  else score -= 5;

  // Booking pressure for experiences in this city
  const cityExp = db.experiences.filter(
    (e) => e.city.toLowerCase() === cityKey && e.approvalStatus === 'approved'
  );
  const capacityRatio =
    cityExp.length > 0
      ? cityExp.reduce((sum, e) => {
          const used = (e.capacity - e.spotsRemaining) / Math.max(e.capacity, 1);
          return sum + used;
        }, 0) / cityExp.length
      : 0;
  score += Math.round(capacityRatio * 15);

  score = Math.max(0, Math.min(100, score));

  let level;
  if (score < 30) level = 'low';
  else if (score < 55) level = 'moderate';
  else if (score < 75) level = 'busy';
  else level = 'very-busy';

  return { score, level };
}

function crowdResponse(cityKey, db) {
  const profile = CITY_PROFILES[cityKey] || {
    alternatives: [],
    bestTimeDescription: 'Visit early morning on weekdays for the best experience.',
  };
  const { score, level } = calcCrowdScore(cityKey, db);

  const descriptions = {
    low: 'Great time to visit! Minimal crowds and easy access to all attractions.',
    moderate: 'Manageable crowd levels. Popular spots may have short queues.',
    busy: 'Expect significant crowds at main attractions. Book tickets in advance.',
    'very-busy': 'Extremely crowded. Consider visiting off-peak spots or rescheduling.',
  };

  return {
    crowdLevel: level,
    score,
    description: descriptions[level],
    bestTimeToVisit: profile.bestTimeDescription,
    alternatives: profile.alternatives,
    peakMonths: profile.peakMonths,
    timestamp: new Date().toISOString(),
  };
}

// ── GET /api/crowd/destination/:city ─────────────────────────────────────────
router.get('/destination/:city', (req, res) => {
  try {
    const cityKey = req.params.city.toLowerCase().replace(/\s+/g, '');
    const db = require('../db').readDB();
    const data = crowdResponse(cityKey, db);
    res.json({ success: true, city: req.params.city, ...data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate crowd data' });
  }
});

// ── GET /api/crowd/experience/:id ─────────────────────────────────────────────
router.get('/experience/:id', (req, res) => {
  try {
    const experiences = getCollection('experiences');
    const exp = experiences.find((e) => e.id === req.params.id);
    if (!exp) return res.status(404).json({ error: 'Experience not found' });

    const capacityUsed = (exp.capacity - exp.spotsRemaining) / exp.capacity;
    const baseScore = Math.round(capacityUsed * 80);

    const db = require('../db').readDB();
    const cityKey = exp.city.toLowerCase().replace(/\s+/g, '');
    const { score: cityScore } = calcCrowdScore(cityKey, db);

    const finalScore = Math.min(100, Math.round((baseScore * 0.7) + (cityScore * 0.3)));
    let level;
    if (finalScore < 30) level = 'low';
    else if (finalScore < 55) level = 'moderate';
    else if (finalScore < 75) level = 'busy';
    else level = 'very-busy';

    res.json({
      success: true,
      experienceId: exp.id,
      title: exp.title,
      spotsRemaining: exp.spotsRemaining,
      capacity: exp.capacity,
      bookingPercentage: Math.round(capacityUsed * 100),
      crowdLevel: level,
      score: finalScore,
      recommendation:
        exp.spotsRemaining < 5
          ? '🔥 Only a few spots left! Book now to secure your place.'
          : exp.spotsRemaining < 20
          ? '⚡ Filling up fast. Book soon to avoid missing out.'
          : '✅ Good availability. Book at your convenience.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate crowd data' });
  }
});

// ── GET /api/crowd/alternatives/:city ────────────────────────────────────────
router.get('/alternatives/:city', (req, res) => {
  try {
    const cityKey = req.params.city.toLowerCase().replace(/\s+/g, '');
    const db = require('../db').readDB();
    const { score, level, alternatives } = crowdResponse(cityKey, db);

    const altDetails = alternatives.map((altCity) => {
      const altKey = altCity.toLowerCase().replace(/\s+/g, '');
      const altProfile = CITY_PROFILES[altKey];
      const { score: altScore, level: altLevel } = altProfile
        ? calcCrowdScore(altKey, db)
        : { score: 35, level: 'low' };
      return {
        city: altCity,
        crowdLevel: altLevel,
        score: altScore,
        why: altProfile
          ? altProfile.bestTimeDescription
          : 'A quieter, less-visited alternative nearby.',
      };
    });

    res.json({
      success: true,
      requestedCity: req.params.city,
      requestedCrowdLevel: level,
      requestedCrowdScore: score,
      alternatives: altDetails.sort((a, b) => a.score - b.score),
      message:
        level === 'low' || level === 'moderate'
          ? `${req.params.city} is not very crowded right now — a great time to visit!`
          : `${req.params.city} is ${level} right now. Consider these quieter alternatives:`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alternatives' });
  }
});

module.exports = router;
