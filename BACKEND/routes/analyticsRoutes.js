const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { authenticate } = require('../middleware/authMiddleware');

const DATA_DIR = 'D:\\webdata';

function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return resolve([]);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// GET /api/analytics/summary — all data for charts
router.get('/summary', authenticate, async (req, res) => {
  try {
    const [citizens, households, taxes, grievances, schemes, funds, births, deaths, properties] =
      await Promise.all([
        readCSV('citizens.csv'),
        readCSV('households.csv'),
        readCSV('tax_records.csv'),
        readCSV('grievances.csv'),
        readCSV('scheme_applications.csv'),
        readCSV('fund_allocation.csv'),
        readCSV('birth_certificates.csv'),
        readCSV('death_certificates.csv'),
        readCSV('properties.csv'),
      ]);

    // KPIs
    const taxCollected = taxes
      .filter(t => t.payment_status === 'Paid')
      .reduce((s, t) => s + parseFloat(t.amount_paid || 0), 0);
    const taxPending = taxes
      .filter(t => t.payment_status === 'Pending')
      .reduce((s, t) => s + parseFloat(t.amount_due || 0), 0);
    const openGrievances = grievances.filter(g => g.status === 'Pending').length;
    const approvedSchemes = schemes.filter(s => s.status === 'Approved').length;

    // Gender distribution
    const genderMap = {};
    citizens.forEach(c => {
      genderMap[c.gender] = (genderMap[c.gender] || 0) + 1;
    });
    const genderData = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

    // Age distribution (buckets of 10)
    const ageBuckets = {};
    citizens.forEach(c => {
      const age = parseInt(c.age || 0);
      const bucket = `${Math.floor(age / 10) * 10}-${Math.floor(age / 10) * 10 + 9}`;
      ageBuckets[bucket] = (ageBuckets[bucket] || 0) + 1;
    });
    const ageData = Object.entries(ageBuckets)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([range, count]) => ({ range, count }));

    // Grievances by category & status
    const grievMap = {};
    grievances.forEach(g => {
      const key = g.complaint_category;
      if (!grievMap[key]) grievMap[key] = { category: key, Pending: 0, 'In Progress': 0, Resolved: 0, Rejected: 0 };
      grievMap[key][g.status] = (grievMap[key][g.status] || 0) + 1;
    });
    const grievData = Object.values(grievMap);

    // Grievance priority
    const priorityMap = {};
    grievances.forEach(g => {
      priorityMap[g.priority] = (priorityMap[g.priority] || 0) + 1;
    });
    const priorityData = Object.entries(priorityMap).map(([name, value]) => ({ name, value }));

    // Fund allocation vs used by department
    const fundMap = {};
    funds.forEach(f => {
      const dept = f.department;
      if (!fundMap[dept]) fundMap[dept] = { department: dept, allocated: 0, used: 0 };
      fundMap[dept].allocated += parseFloat(f.fund_allocated || 0);
      fundMap[dept].used += parseFloat(f.fund_used || 0);
    });
    const fundData = Object.values(fundMap);

    // Scheme applications by category & status
    const schemeMap = {};
    schemes.forEach(s => {
      const key = s.scheme_category;
      if (!schemeMap[key]) schemeMap[key] = { category: key, Approved: 0, Pending: 0, Rejected: 0, 'Under Review': 0 };
      schemeMap[key][s.status] = (schemeMap[key][s.status] || 0) + 1;
    });
    const schemeData = Object.values(schemeMap);

    // Births vs Deaths by year
    const vitalMap = {};
    births.forEach(b => {
      const year = b.date_of_birth ? b.date_of_birth.split('-')[0] : null;
      if (year) {
        if (!vitalMap[year]) vitalMap[year] = { year, births: 0, deaths: 0 };
        vitalMap[year].births++;
      }
    });
    deaths.forEach(d => {
      const year = d.date_of_death ? d.date_of_death.split('-')[0] : null;
      if (year) {
        if (!vitalMap[year]) vitalMap[year] = { year, births: 0, deaths: 0 };
        vitalMap[year].deaths++;
      }
    });
    const vitalData = Object.values(vitalMap).sort((a, b) => a.year - b.year);

    // House type distribution
    const houseMap = {};
    households.forEach(h => {
      houseMap[h.house_type] = (houseMap[h.house_type] || 0) + 1;
    });
    const houseData = Object.entries(houseMap).map(([name, value]) => ({ name, value }));

    // Property value by land type
    const propMap = {};
    properties.forEach(p => {
      const lt = p.land_type;
      if (!propMap[lt]) propMap[lt] = { type: lt, value: 0 };
      propMap[lt].value += parseFloat(p.estimated_value || 0);
    });
    const propData = Object.values(propMap);

    // Occupation income (top 8 occupations avg income)
    const occMap = {};
    citizens.forEach(c => {
      const occ = c.occupation || 'Other';
      const inc = parseFloat(c.income || 0);
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
        totalCitizens: citizens.length,
        totalHouseholds: households.length,
        taxCollected,
        taxPending,
        openGrievances,
        approvedSchemes,
        totalBirths: births.length,
        totalDeaths: deaths.length,
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
