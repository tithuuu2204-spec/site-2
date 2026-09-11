'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getCollection, upsertItem, deleteItem } = require('../db');

const router = express.Router();

// ── GET /api/users/profile/:uid ───────────────────────────────────────────────
router.get('/profile/:uid', (req, res) => {
  try {
    const user = getCollection('users').find((u) => u.uid === req.params.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Strip sensitive fields
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ── POST /api/users/profile ───────────────────────────────────────────────────
router.post('/profile', (req, res) => {
  try {
    const {
      uid,
      email,
      displayName,
      photoURL,
      phone,
      bio,
      homeCity,
      interests,
      preferredLanguage,
      notificationsEnabled,
    } = req.body;

    if (!uid) return res.status(400).json({ error: 'uid is required' });

    const existing = getCollection('users').find((u) => u.uid === uid);

    const user = {
      ...(existing || {}),
      uid,
      email: email || (existing && existing.email) || '',
      displayName: displayName || (existing && existing.displayName) || '',
      photoURL: photoURL || (existing && existing.photoURL) || null,
      phone: phone || (existing && existing.phone) || null,
      bio: bio || (existing && existing.bio) || '',
      homeCity: homeCity || (existing && existing.homeCity) || '',
      interests: interests || (existing && existing.interests) || [],
      preferredLanguage: preferredLanguage || 'en',
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
      role: (existing && existing.role) || 'traveler',
      createdAt: (existing && existing.createdAt) || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    upsertItem('users', user, 'uid');
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save user profile' });
  }
});

// ── GET /api/users/favorites/:uid ────────────────────────────────────────────
router.get('/favorites/:uid', (req, res) => {
  try {
    const favorites = getCollection('favorites').filter((f) => f.userId === req.params.uid);
    const experienceIds = favorites.map((f) => f.experienceId);

    // Enrich with experience data
    const experiences = getCollection('experiences').filter((e) =>
      experienceIds.includes(e.id)
    );

    res.json({ success: true, favorites, experiences });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// ── POST /api/users/favorites ─────────────────────────────────────────────────
router.post('/favorites', (req, res) => {
  try {
    const { userId, experienceId } = req.body;
    if (!userId || !experienceId) {
      return res.status(400).json({ error: 'userId and experienceId are required' });
    }

    const existing = getCollection('favorites').find(
      (f) => f.userId === userId && f.experienceId === experienceId
    );
    if (existing) {
      return res.status(409).json({ error: 'Already in favorites', favorite: existing });
    }

    const favorite = {
      id: `fav-${uuidv4()}`,
      userId,
      experienceId,
      createdAt: new Date().toISOString(),
    };

    upsertItem('favorites', favorite);
    res.status(201).json({ success: true, favorite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// ── DELETE /api/users/favorites/:id ──────────────────────────────────────────
router.delete('/favorites/:id', (req, res) => {
  try {
    const removed = deleteItem('favorites', req.params.id);
    if (!removed) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
