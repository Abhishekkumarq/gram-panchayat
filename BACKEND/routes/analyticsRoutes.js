const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/authMiddleware');

// Simple in-memory cache — recompute every 5 minutes
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

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
      grievData,
      priorityData,
      fundData,
      schemeData,
      vitalData,
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

      // Grievances by category
      db.collection('grievances').aggregate([
        { $group: {
          _id: '$complaint_category',
          pending:    { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'pending'] }, 1, 0] } },
          inprogress: { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'in progress'] }, 1, 0] } },
          resolved:   { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'resolved'] }, 1, 0] } },
          rejected:   { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'rejected'] }, 1, 0] } },
        }},
        { $project: { _id: 0, category: '$_id', pending: 1, 'in progress': '$inprogress', resolved: 1, rejected: 1 } }
      ]).toArray(),

      // Grievance priority
      db.collection('grievances').aggregate([
        { $group: { _id: { $toLower: '$priority' }, value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } }
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

      // Scheme applications by category
      db.collection('scheme_applications').aggregate([
        { $group: {
          _id: { $ifNull: ['$scheme_category', 'Other'] },
          approved:     { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'approved'] }, 1, 0] } },
          pending:      { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'pending'] }, 1, 0] } },
          rejected:     { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'rejected'] }, 1, 0] } },
          submitted:    { $sum: { $cond: [{ $eq: [{ $toLower: '$status' }, 'submitted'] }, 1, 0] } },
        }},
        { $project: { _id: 0, category: '$_id', approved: 1, pending: 1, rejected: 1, submitted: 1 } }
      ]).toArray(),

      // Births by year
      db.collection('birth_certificates').aggregate([
        { $match: { date_of_birth: { $exists: true } } },
        { $project: { year: { $substr: ['$date_of_birth', 0, 4] } } },
        { $group: { _id: '$year', births: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, year: '$_id', births: 1, deaths: { $literal: 0 } } }
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

      // Grievance KPI
      db.collection('grievances').countDocuments({ status: 'Pending' }),

      // Scheme KPI
      db.collection('scheme_applications').countDocuments({ status: 'approved' }),

      // Totals
      Promise.all([
        db.collection('citizens').estimatedDocumentCount(),
        db.collection('households').estimatedDocumentCount(),
        db.collection('birth_certificates').estimatedDocumentCount(),
      ])
    ]);

    const result = {
      kpis: {
        totalCitizens:   totals[0],
        totalHouseholds: totals[1],
        taxCollected:    taxKPI[0]?.collected || 0,
        taxPending:      taxKPI[0]?.pending   || 0,
        openGrievances:  grievKPI,
        approvedSchemes: schemeKPI,
        totalBirths:     totals[2],
        totalDeaths:     0,
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
