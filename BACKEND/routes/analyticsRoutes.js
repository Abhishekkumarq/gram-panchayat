const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/analytics/summary
router.get('/summary', authenticate, async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const [citizens, households, taxes, grievances, schemes, funds, births, properties] =
      await Promise.all([
        db.collection('citizens').find({}).toArray(),
        db.collection('households').find({}).toArray(),
        db.collection('tax_records').find({}).toArray(),
        db.collection('grievances').find({}).toArray(),
        db.collection('scheme_applications').find({}).toArray(),
        db.collection('funds').find({}).toArray(),
        db.collection('birth_certificates').find({}).toArray(),
        db.collection('properties').find({}).toArray(),
      ]);

    // ── KPIs ──
    const taxCollected = taxes
      .filter(t => t.payment_status === 'Paid')
      .reduce((s, t) => s + parseFloat(t.amount_paid || 0), 0);
    const taxPending = taxes
      .filter(t => t.payment_status === 'Pending')
      .reduce((s, t) => s + parseFloat(t.amount_due || 0), 0);
    const openGrievances  = grievances.filter(g => g.status === 'Pending').length;
    const approvedSchemes = schemes.filter(s => s.status === 'Approved').length;

    // ── Gender distribution ──
    const genderMap = {};
    citizens.forEach(c => {
      const g = c.gender || 'Unknown';
      genderMap[g] = (genderMap[g] || 0) + 1;
    });
    const genderData = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

    // ── Age distribution ──
    const ageBuckets = {};
    citizens.forEach(c => {
      const age = parseInt(c.age || 0);
      const bucket = `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9}`;
      ageBuckets[bucket] = (ageBuckets[bucket] || 0) + 1;
    });
    const ageData = Object.entries(ageBuckets)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([range, count]) => ({ range, count }));

    // ── Grievances by category ──
    const grievMap = {};
    grievances.forEach(g => {
      const key = g.complaint_category || g.category || 'Other';
      if (!grievMap[key]) grievMap[key] = { category: key, Pending: 0, 'In Progress': 0, Resolved: 0, Rejected: 0 };
      const st = g.status || 'Pending';
      grievMap[key][st] = (grievMap[key][st] || 0) + 1;
    });
    const grievData = Object.values(grievMap);

    // ── Grievance priority ──
    const priorityMap = {};
    grievances.forEach(g => {
      const p = g.priority || 'Medium';
      priorityMap[p] = (priorityMap[p] || 0) + 1;
    });
    const priorityData = Object.entries(priorityMap).map(([name, value]) => ({ name, value }));

    // ── Fund allocation by department ──
    const fundMap = {};
    funds.forEach(f => {
      const dept = f.department || f.category || 'Other';
      if (!fundMap[dept]) fundMap[dept] = { department: dept, allocated: 0, used: 0 };
      fundMap[dept].allocated += parseFloat(f.fund_allocated || f.allocated || 0);
      fundMap[dept].used      += parseFloat(f.fund_used || f.spent || 0);
    });
    const fundData = Object.values(fundMap);

    // ── Scheme applications by category ──
    const schemeMap = {};
    schemes.forEach(s => {
      const key = s.scheme_category || s.schemeId || 'Other';
      if (!schemeMap[key]) schemeMap[key] = { category: key, Approved: 0, Pending: 0, Rejected: 0, 'Under Review': 0 };
      const st = s.status || 'Pending';
      schemeMap[key][st] = (schemeMap[key][st] || 0) + 1;
    });
    const schemeData = Object.values(schemeMap);

    // ── Births by year ──
    const vitalMap = {};
    births.forEach(b => {
      const raw = b.date_of_birth || b.dateOfBirth || '';
      const year = raw ? raw.toString().split('-')[0] : null;
      if (year && year.length === 4) {
        if (!vitalMap[year]) vitalMap[year] = { year, births: 0, deaths: 0 };
        vitalMap[year].births++;
      }
    });
    const vitalData = Object.values(vitalMap).sort((a, b) => a.year - b.year);

    // ── House type ──
    const houseMap = {};
    households.forEach(h => {
      const ht = h.house_type || h.houseType || 'Other';
      houseMap[ht] = (houseMap[ht] || 0) + 1;
    });
    const houseData = Object.entries(houseMap).map(([name, value]) => ({ name, value }));

    // ── Property value by land type ──
    const propMap = {};
    properties.forEach(p => {
      const lt = p.land_type || p.landType || 'Other';
      if (!propMap[lt]) propMap[lt] = { type: lt, value: 0 };
      propMap[lt].value += parseFloat(p.estimated_value || p.estimatedValue || 0);
    });
    const propData = Object.values(propMap);

    // ── Occupation avg income (top 8) ──
    const occMap = {};
    citizens.forEach(c => {
      const occ = c.occupation || 'Other';
      const inc = parseFloat(c.income || c.annual_income || 0);
      if (!occMap[occ]) occMap[occ] = { total: 0, count: 0 };
      occMap[occ].total += inc;
      occMap[occ].count++;
    });
    const occData = Object.entries(occMap)
      .map(([name, d]) => ({ name, avgIncome: Math.round(d.total / d.count) }))
      .sort((a, b) => b.avgIncome - a.avgIncome)
      .slice(0, 8);

    res.json({
      kpis: {
        totalCitizens:    citizens.length,
        totalHouseholds:  households.length,
        taxCollected,
        taxPending,
        openGrievances,
        approvedSchemes,
        totalBirths:      births.length,
        totalDeaths:      0,
      },
      genderData,
      ageData,
      grievData,
      priorityData,
      fundData,
      schemeData,
      vitalData,
      houseData,
      propData,
      occData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
