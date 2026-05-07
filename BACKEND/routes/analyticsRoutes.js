const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/authMiddleware');

// Simple in-memory cache — recompute every 5 minutes
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

// Capitalize first letter helper used in pipeline via JS post-processing
function capitalize(s) {
  if (!s) return 'Unknown';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

router.get('/summary', authenticate, async (req, res) => {
  try {
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
      return res.json(cache);
    }

    const db = mongoose.connection.db;

    // Run all aggregations in parallel
    const [
      genderData,
      ageData,
      grievDataRaw,
      priorityDataRaw,
      fundData,
      schemeDataRaw,
      birthData,
      deathData,
      houseData,
      propData,
      occData,
      taxKPI,
      grievKPI,
      schemeKPI,
      totals,
    ] = await Promise.all([

      // Gender distribution
      db.collection('citizens').aggregate([
        { $group: { _id: '$gender', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } }
      ]).toArray(),

      // Age buckets
      db.collection('citizens').aggregate([
        { $match: { age: { $exists: true } } },
        { $bucket: {
          groupBy: { $toInt: '$age' },
          boundaries: [0,10,20,30,40,50,60,70,80,90,100],
          default: '90+',
          output: { count: { $sum: 1 } }
        }},
        { $project: { _id: 0, range: { $concat: [{ $toString: '$_id' }, '-', { $toString: { $add: ['$_id', 9] } }] }, count: 1 } }
      ]).toArray(),

      // Grievances by category — use capitalized field names to match chart dataKeys
      db.collection('grievances').aggregate([
        { $group: {
          _id: '$complaint_category',
          Pending:      { $sum: { $cond: [{ $in: [{ $toLower: '$status' }, ['pending']] }, 1, 0] } },
          InProgress:   { $sum: { $cond: [{ $in: [{ $toLower: '$status' }, ['in progress', 'inprogress', 'in-progress']] }, 1, 0] } },
          Resolved:     { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'resolved'] }, 1, 0] } },
          Rejected:     { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'rejected'] }, 1, 0] } },
        }},
        { $project: { _id: 0, category: '$_id', Pending: 1, 'In Progress': '$InProgress', Resolved: 1, Rejected: 1 } }
      ]).toArray(),

      // Grievance priority — normalize to Title Case
      db.collection('grievances').aggregate([
        { $group: { _id: { $toLower: '$priority' }, value: { $sum: 1 } } },
        { $project: { _id: 0, name: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'high'] },   then: 'High' },
              { case: { $eq: ['$_id', 'medium'] }, then: 'Medium' },
              { case: { $eq: ['$_id', 'low'] },    then: 'Low' },
            ],
            default: '$_id'
          }
        }, value: 1 } }
      ]).toArray(),

      // Fund by department
      db.collection('funds').aggregate([
        { $group: {
          _id: { $ifNull: ['$department', '$category'] },
          allocated: { $sum: { $toDouble: { $ifNull: ['$fund_allocated', '$allocated', 0] } } },
          used:      { $sum: { $toDouble: { $ifNull: ['$fund_used', '$spent', 0] } } }
        }},
        { $project: { _id: 0, department: '$_id', allocated: 1, used: 1 } }
      ]).toArray(),

      // Scheme applications by category — capitalized keys to match chart
      db.collection('scheme_applications').aggregate([
        { $group: {
          _id: { $ifNull: ['$scheme_category', 'Other'] },
          Approved:     { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'approved'] }, 1, 0] } },
          Pending:      { $sum: { $cond: [{ $in: [{ $toLower: '$status' }, ['pending', 'submitted']] }, 1, 0] } },
          UnderReview:  { $sum: { $cond: [{ $in: [{ $toLower: '$status' }, ['under-review', 'under review']] }, 1, 0] } },
          Rejected:     { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'rejected'] }, 1, 0] } },
        }},
        { $project: { _id: 0, category: '$_id', Approved: 1, Pending: 1, 'Under Review': '$UnderReview', Rejected: 1 } }
      ]).toArray(),

      // Births by year — from certificates collection (actual Mongoose data)
      db.collection('certificates').aggregate([
        { $match: { type: 'birth' } },
        { $group: { _id: { $year: '$createdAt' }, births: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, year: { $toString: '$_id' }, births: 1 } }
      ]).toArray(),

      // Deaths by year — from certificates collection
      db.collection('certificates').aggregate([
        { $match: { type: 'death' } },
        { $group: { _id: { $year: '$createdAt' }, deaths: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, year: { $toString: '$_id' }, deaths: 1 } }
      ]).toArray(),

      // House type
      db.collection('households').aggregate([
        { $group: { _id: { $ifNull: ['$house_type', 'Other'] }, value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } }
      ]).toArray(),

      // Property value by land type
      db.collection('properties').aggregate([
        { $group: {
          _id: { $ifNull: ['$land_type', 'Other'] },
          value: { $sum: { $toDouble: { $ifNull: ['$estimated_value', 0] } } }
        }},
        { $project: { _id: 0, type: '$_id', value: 1 } }
      ]).toArray(),

      // Occupation avg income (top 8)
      db.collection('citizens').aggregate([
        { $group: {
          _id: { $ifNull: ['$occupation', 'Other'] },
          avgIncome: { $avg: { $toDouble: { $ifNull: ['$income', '$annual_income', 0] } } },
        }},
        { $sort: { avgIncome: -1 } },
        { $limit: 8 },
        { $project: { _id: 0, name: '$_id', avgIncome: { $round: ['$avgIncome', 0] } } }
      ]).toArray(),

      // Tax KPIs
      db.collection('tax_records').aggregate([
        { $group: {
          _id: null,
          collected: { $sum: { $cond: [{ $eq: ['$payment_status', 'Paid'] }, { $toDouble: { $ifNull: ['$amount_paid', 0] } }, 0] } },
          pending:   { $sum: { $cond: [{ $eq: ['$payment_status', 'Pending'] }, { $toDouble: { $ifNull: ['$amount_due', 0] } }, 0] } },
        }}
      ]).toArray(),

      // Grievance KPI — open (pending/in-progress)
      db.collection('grievances').countDocuments({
        status: { $in: ['Pending', 'pending', 'In Progress', 'in progress'] }
      }),

      // Scheme KPI — approved applications
      db.collection('scheme_applications').countDocuments({ status: 'approved' }),

      // Totals
      Promise.all([
        db.collection('citizens').estimatedDocumentCount(),
        db.collection('households').estimatedDocumentCount(),
        db.collection('certificates').countDocuments({ type: 'birth' }),
        db.collection('certificates').countDocuments({ type: 'death' }),
      ])
    ]);

    // Merge births + deaths into unified vitalData array
    const vitalMap = {};
    for (const b of birthData)  vitalMap[b.year] = { year: b.year, births: b.births, deaths: 0 };
    for (const d of deathData) {
      if (vitalMap[d.year]) vitalMap[d.year].deaths = d.deaths;
      else vitalMap[d.year] = { year: d.year, births: 0, deaths: d.deaths };
    }
    const vitalData = Object.values(vitalMap).sort((a, b) => a.year.localeCompare(b.year));

    // Fix grievData: ensure 'In Progress' key exists (some MongoDB versions drop the alias)
    const grievData = grievDataRaw.map(row => ({
      ...row,
      'In Progress': row['In Progress'] || 0,
    }));

    // Fix schemeData: ensure all keys exist
    const schemeData = schemeDataRaw.map(row => ({
      ...row,
      'Under Review': row['Under Review'] || 0,
    }));

    const priorityData = priorityDataRaw;

    const result = {
      kpis: {
        totalCitizens:   totals[0],
        totalHouseholds: totals[1],
        taxCollected:    taxKPI[0]?.collected || 0,
        taxPending:      taxKPI[0]?.pending   || 0,
        openGrievances:  grievKPI,
        approvedSchemes: schemeKPI,
        totalBirths:     totals[2],
        totalDeaths:     totals[3],
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
    };

    cache = result;
    cacheTime = Date.now();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
