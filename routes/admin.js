'use strict';

const express = require('express');
const { readDB, writeDB, getCollection } = require('../db');

const router = express.Router();

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  try {
    const db = readDB();

    const experiences = db.experiences || [];
    const bookings = db.bookings || [];
    const users = db.users || [];
    const hosts = db.hosts || [];

    const totalRevenue = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyBookings = bookings.filter(
      (b) => new Date(b.createdAt) >= thisMonth
    );
    const monthlyRevenue = monthlyBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const categoryBreakdown = {};
    experiences.forEach((e) => {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + 1;
    });

    const cityBreakdown = {};
    experiences.forEach((e) => {
      cityBreakdown[e.city] = (cityBreakdown[e.city] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalExperiences: experiences.length,
        approvedExperiences: experiences.filter((e) => e.approvalStatus === 'approved').length,
        pendingExperiences: experiences.filter((e) => e.approvalStatus === 'pending').length,
        rejectedExperiences: experiences.filter((e) => e.approvalStatus === 'rejected').length,
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
        cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
        totalUsers: users.length,
        totalHosts: hosts.length,
        verifiedHosts: hosts.filter((h) => h.verificationStatus === 'verified').length,
        pendingHosts: hosts.filter((h) => h.verificationStatus === 'pending').length,
        totalRevenue,
        monthlyRevenue,
        monthlyBookings: monthlyBookings.length,
        categoryBreakdown,
        cityBreakdown,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// ── GET /api/admin/pending-listings ──────────────────────────────────────────
router.get('/pending-listings', (req, res) => {
  try {
    const experiences = getCollection('experiences').filter(
      (e) => e.approvalStatus === 'pending'
    );
    res.json({ success: true, count: experiences.length, experiences });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending listings' });
  }
});

// ── PUT /api/admin/listings/:id/approve ──────────────────────────────────────
router.put('/listings/:id/approve', (req, res) => {
  try {
    const db = readDB();
    const idx = db.experiences.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Experience not found' });

    db.experiences[idx] = {
      ...db.experiences[idx],
      approvalStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: req.body.adminId || 'admin',
      rejectionReason: null,
    };

    writeDB(db);
    res.json({ success: true, experience: db.experiences[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve listing' });
  }
});

// ── PUT /api/admin/listings/:id/reject ───────────────────────────────────────
router.put('/listings/:id/reject', (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'Rejection reason is required' });

    const db = readDB();
    const idx = db.experiences.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Experience not found' });

    db.experiences[idx] = {
      ...db.experiences[idx],
      approvalStatus: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: req.body.adminId || 'admin',
      rejectionReason: reason,
    };

    writeDB(db);
    res.json({ success: true, experience: db.experiences[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject listing' });
  }
});

// ── GET /api/admin/pending-hosts ──────────────────────────────────────────────
router.get('/pending-hosts', (req, res) => {
  try {
    const hosts = getCollection('hosts').filter(
      (h) => h.verificationStatus === 'pending'
    );
    res.json({ success: true, count: hosts.length, hosts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending hosts' });
  }
});

// ── PUT /api/admin/hosts/:hostId/verify ───────────────────────────────────────
router.put('/hosts/:hostId/verify', (req, res) => {
  try {
    const db = readDB();
    const idx = db.hosts.findIndex(
      (h) => h.id === req.params.hostId || h.userId === req.params.hostId
    );
    if (idx === -1) return res.status(404).json({ error: 'Host not found' });

    db.hosts[idx] = {
      ...db.hosts[idx],
      verificationStatus: 'verified',
      identityVerified: true,
      gstVerified: !!db.hosts[idx].kyc?.gstNumber,
      trustScore: Math.min(100, (db.hosts[idx].trustScore || 70) + 20),
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

// ── PUT /api/admin/hosts/:hostId/reject ───────────────────────────────────────
router.put('/hosts/:hostId/reject', (req, res) => {
  try {
    const { reason } = req.body;

    const db = readDB();
    const idx = db.hosts.findIndex(
      (h) => h.id === req.params.hostId || h.userId === req.params.hostId
    );
    if (idx === -1) return res.status(404).json({ error: 'Host not found' });

    db.hosts[idx] = {
      ...db.hosts[idx],
      verificationStatus: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason || 'Documents insufficient',
      updatedAt: new Date().toISOString(),
    };

    writeDB(db);
    const { kyc, ...publicHost } = db.hosts[idx];
    res.json({ success: true, host: publicHost });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject host verification' });
  }
});

// ── GET /api/admin/bookings ───────────────────────────────────────────────────
router.get('/bookings', (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const bookings = getCollection('bookings')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get('/users', (req, res) => {
  try {
    const users = getCollection('users').map(({ passwordHash, ...u }) => u);
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
