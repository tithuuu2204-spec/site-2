import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = readDB();
  let results = db.experiences || [];
  
  // Basic filtering
  const { city, category } = req.query;
  if (city) results = results.filter(e => e.city.toLowerCase() === city.toLowerCase());
  if (category) results = results.filter(e => e.category === category);
  
  res.json(results);
});

router.post('/', (req, res) => {
  const db = readDB();
  const newExp = {
    id: `exp-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  db.experiences = db.experiences || [];
  db.experiences.push(newExp);
  writeDB(db);
  
  res.status(201).json(newExp);
});

router.get('/:id', (req, res) => {
  const db = readDB();
  const exp = (db.experiences || []).find(e => e.id === req.params.id);
  if (exp) res.json(exp);
  else res.status(404).json({ error: 'Not found' });
});

router.post('/:id/view', (req, res) => {
  // Mock view increment
  res.json({ success: true });
});

export default router;
