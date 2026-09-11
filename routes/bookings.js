import express from 'express';
import { readDB, writeDB } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
  const db = readDB();
  const booking = {
    id: `bk-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  db.bookings = db.bookings || [];
  db.bookings.push(booking);
  writeDB(db);
  
  res.status(201).json(booking);
});

router.get('/user/:userId', authMiddleware, (req, res) => {
  const db = readDB();
  const userBookings = (db.bookings || []).filter(b => b.userId === req.params.userId);
  res.json(userBookings);
});

router.put('/:id/cancel', authMiddleware, (req, res) => {
  const db = readDB();
  const idx = (db.bookings || []).findIndex(b => b.id === req.params.id);
  
  if (idx > -1) {
    db.bookings[idx].status = 'cancelled';
    writeDB(db);
    res.json(db.bookings[idx]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

export default router;
