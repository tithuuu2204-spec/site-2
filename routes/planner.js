import express from 'express';
import { generateTripPlan } from '../aiPlanner.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const itinerary = await generateTripPlan(req.body);
    res.json(itinerary);
  } catch (error) {
    console.error("AI Planner Error:", error);
    res.status(500).json({ error: 'Failed to generate itinerary', details: error.message });
  }
});

export default router;
