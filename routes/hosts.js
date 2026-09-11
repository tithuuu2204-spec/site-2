'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getCollection, upsertItem, readDB, writeDB } = require('../db');

const router = express.Router();

// ── POST /api/hosts/register ──────────────────────────────────────────────────
router.post('/register', (req, res) => {
  try {
    const {
      userId,
      displayName,
      email,
      phone,
      bio,
      city,
      state,
      specialties,
      languages,
      // KYC fields
      panNumber,
      aadharNumber,
      gstNumber,
      bankAccountName,
      bankAccountNumber,
      bankIfsc,
      photoURL,
      idProofType,
      idProofNumber,
    } = req.body;

    if (!userId || !displayName || !email || !phone) {
      return res.status(400).json({ error: 'userId, displayName, email, and phone are required' });
    }

    const existing = getCollection('hosts').find((h) => h.userId === userId);
    if (existing) {
      return res.status(409).json({ error: 'Host profile already exists', host: existing });
    }

    const host = {
      id: `host-${uuidv4()}`,
      userId,
      displayName,
      email,
      phone,
      bio: bio || '',
      city: city || '',
      state: state || '',
      specialties: specialties || [],
      languages: languages || ['English', 'Hindi'],
      photoURL: photoURL || null,
      // KYC (mock: stored but NOT shown publicly)
      kyc: {
        panNumber: panNumber || null,
        aadharNumber: aadharNumber ? `XXXX-XXXX-${aadharNumber.slice(-4)}` : null, // mask
        gstNumber: gstNumber || null,
        bankAccountName: bankAccountName || null,
        bankAccountNumber: bankAccountNumber ? `XXXX${bankAccountNumber.slice(-4)}` : null,
        bankIfsc: bankIfsc || null,
        idProofType: idProofType || null,
        idProofNumber: idProofNumber || null,
      },
      verificationStatus: 'pending',
      identityVerified: false,
      gstVerified: !!gstNumber,
      trustScore: 70,
      rating: 0,
      reviewCount: 0,
      totalBookings: 0,
      totalRevenue: 0,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    upsertItem('hosts', host);
    const { kyc, ...publicHost } = host;
    res.status(201).json({ success: true, host: publicHost, message: 'Host registration received. Verification takes 2-3 business days.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register host' });
  }
});

// ── GET /api/hosts/:hostId ────────────────────────────────────────────────────
router.get('/:hostId', (req, res) => {
  try {
    const host = getCollection('hosts').find(
      (h) => h.id === req.params.hostId || h.userId === req.params.hostId
    );
    if (!host) return res.status(404).json({ error: 'Host not found' });

    const { kyc, ...publicHost } = host;
    res.json({ success: true, host: publicHost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch host' });
  }
});

// ── GET /api/hosts/:hostId/events ─────────────────────────────────────────────
router.get('/:hostId/events', (req, res) => {
  try {
    const experiences = getCollection('experiences').filter(
      (e) =>
        (e.hostId === req.params.hostId) &&
        e.approvalStatus === 'approved'
    );
    res.json({ success: true, count: experiences.length, experiences });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch host events' });
  }
});

// ── GET /api/hosts/:hostId/stats ──────────────────────────────────────────────
router.get('/:hostId/stats', (req, res) => {
  try {
    const host = getCollection('hosts').find(
      (h) => h.id === req.params.hostId || h.userId === req.params.hostId
    );
    if (!host) return res.status(404).json({ error: 'Host not found' });

    const experiences = getCollection('experiences').filter(
      (e) => e.hostId === req.params.hostId
    );

    const bookings = getCollection('bookings').filter(
      (b) => b.hostId === req.params.hostId
    );

    const totalRevenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const totalRating =
      experiences.reduce((sum, e) => sum + (e.rating || 0) * (e.reviewCount || 0), 0);
    const totalReviews = experiences.reduce((sum, e) => sum + (e.reviewCount || 0), 0);
    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : 0;

    res.json({
      success: true,
      stats: {
        totalEvents: experiences.length,
        approvedEvents: experiences.filter((e) => e.approvalStatus === 'approved').length,
        pendingEvents: experiences.filter((e) => e.approvalStatus === 'pending').length,
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
        totalRevenue,
        avgRating: Number(avgRating),
        totalReviews,
        trustScore: host.trustScore,
        verificationStatus: host.verificationStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch host stats' });
  }
});

// ── PUT /api/hosts/:hostId/verify ─────────────────────────────────────────────
router.put('/:hostId/verify', (req, res) => {
  try {
    const db = readDB();
    const idx = db.hosts.findIndex(
      (h) => h.id === req.params.hostId || h.userId === req.params.hostId
    );
    if (idx === -1) return res.status(404).json({ error: 'Host not found' });

    const { identityVerified, gstVerified } = req.body;

    db.hosts[idx] = {
      ...db.hosts[idx],
      identityVerified: identityVerified !== undefined ? identityVerified : db.hosts[idx].identityVerified,
      gstVerified: gstVerified !== undefined ? gstVerified : db.hosts[idx].gstVerified,
      verificationStatus: 'verified',
      trustScore: Math.min(100, (db.hosts[idx].trustScore || 70) + 15),
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    writeDB(db);
    const { kyc, ...publicHost } = db.hosts[idx];
    res.json({ success: true, host: publicHost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify host' });
  }
});

module.exports = router;
