/**
 * Seed script: clears all collections and imports all CSV data.
 * Run: node seedCSVData.js
 *
 * Place these CSV files in BACKEND/data/ before running:
 *   citizens.csv, birth_certificates.csv, scheme_applications.csv,
 *   properties.csv, tax_records.csv
 * (gram_sabha_meetings, death_certificates, fund_allocation,
 *  households, grievances are already written to data/ by Claude)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('./model/user');
const Certificate = require('./model/certificate');
const Complaint = require('./model/complaint');
const Tax = require('./model/tax');
const Fund = require('./model/fund');
const Scheme = require('./model/scheme');
const SchemeApplication = require('./model/schemeApplication');
const GramSabha = require('./model/gramSabha');
const Household = require('./model/household');
const Property = require('./model/property');

// ── CSV helpers ───────────────────────────────────────────────────────────────
function readCSV(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  ${filename} not found in data/ folder – skipping`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n').map(l => l.replace(/\r/g, ''));
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = splitCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (values[i] || '').trim(); });
    return obj;
  });
}

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(cur); cur = ''; continue; }
    cur += ch;
  }
  result.push(cur);
  return result;
}

// ── Mappings ──────────────────────────────────────────────────────────────────
function mapComplaintCategory(cat) {
  const m = { Drainage: 'drainage', Road: 'road', Electricity: 'electricity', Water: 'water', Sanitation: 'sanitation' };
  return m[cat] || 'other';
}
function mapComplaintStatus(s) {
  if (s === 'In Progress') return 'in-progress';
  if (s === 'Resolved') return 'resolved';
  return 'pending';
}
function mapPriority(p) {
  if (p === 'Urgent') return 'high';
  if (p === 'High') return 'high';
  if (p === 'Low') return 'low';
  return 'medium';
}
function mapCertStatus(s) {
  if (s === 'Issued' || s === 'Approved') return 'approved';
  if (s === 'Pending') return 'pending';
  return 'approved';
}
function mapTaxStatus(s) { return s === 'Paid' ? 'paid' : 'pending'; }
function mapTaxType(t) { return t.includes('Water') ? 'water' : 'property'; }
function mapFundCategory(dept) {
  const m = {
    'Sanitation': 'sanitation', 'Solid Waste Management': 'sanitation',
    'Road Development': 'infrastructure', 'Infrastructure': 'infrastructure',
    'Healthcare': 'health',
    'Education': 'education',
    'Social Welfare': 'welfare', 'Women and Child Welfare': 'welfare', 'Rural Employment': 'welfare',
  };
  return m[dept] || 'other';
}
function mapSchemeType(cat) {
  if (cat === 'Agriculture') return 'subsidy';
  if (cat === 'Insurance') return 'insurance';
  if (cat === 'Education') return 'scholarship';
  if (cat === 'Employment') return 'employment';
  return 'welfare';
}
function mapAppStatus(s) {
  if (s === 'Approved' || s === 'Active') return 'approved';
  if (s === 'Rejected') return 'rejected';
  if (s === 'Pending') return 'submitted';
  return 'submitted';
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB:', mongoose.connection.name);

  // Clear all collections
  await Promise.all([
    User.deleteMany({}), Certificate.deleteMany({}), Complaint.deleteMany({}),
    Tax.deleteMany({}), Fund.deleteMany({}), Scheme.deleteMany({}),
    SchemeApplication.deleteMany({}), GramSabha.deleteMany({}),
    Household.deleteMany({}), Property.deleteMany({})
  ]);
  console.log('🗑️  Cleared all collections');

  // ── 1. Admin user ────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('Admin@123', 10);
  await User.create({
    name: 'Admin', email: 'admin@rampurkalan.gov.in',
    password: adminPass, phone: '9000000000', role: 'admin',
    address: 'Gram Panchayat Office, Rampur Kalan, Ludhiana, Punjab', ward: '0'
  });
  console.log('👤 Admin created  →  admin@rampurkalan.gov.in / Admin@123');

  // ── 2. Citizens ──────────────────────────────────────────────────────────
  const citizenRows = readCSV('citizens.csv');
  const userIdMap = {}; // csvId → MongoDB ObjectId
  let created = 0;

  for (const row of citizenRows) {
    try {
      const hashedPw = await bcrypt.hash(row.phone || 'Pass@1234', 10);
      const user = await User.create({
        name: row.name,
        email: row.email,
        password: hashedPw,
        phone: row.phone,
        role: 'citizen',
        address: `${row.village}, ${row.district}, ${row.state}`,
        ward: row.ward_number,
        income: Number(row.income) || 0,
        familySize: Number(row.age) || undefined,
        createdAt: row.registration_date ? new Date(row.registration_date) : new Date()
      });
      userIdMap[row.user_id] = user._id;
      created++;
    } catch (e) {
      // duplicate email or other error – skip
    }
  }
  console.log(`👥 Citizens created: ${created} / ${citizenRows.length}`);

  // ── 3. Birth Certificates ────────────────────────────────────────────────
  const birthRows = readCSV('birth_certificates.csv');
  let bCount = 0;
  for (const r of birthRows) {
    const uid = userIdMap[r.user_id];
    if (!uid) continue;
    try {
      await Certificate.create({
        userId: uid,
        type: 'birth',
        status: mapCertStatus(r.certificate_status),
        certificateNumber: `BC-${r.certificate_id}`,
        applicationData: {
          name: r.name, dateOfBirth: r.date_of_birth,
          placeOfBirth: r.place_of_birth, registrationDate: r.registration_date
        },
        issuedDate: r.registration_date ? new Date(r.registration_date) : null,
        createdAt: r.registration_date ? new Date(r.registration_date) : new Date()
      });
      bCount++;
    } catch (e) {}
  }
  console.log(`📜 Birth Certificates: ${bCount}`);

  // ── 4. Death Certificates ────────────────────────────────────────────────
  const deathRows = readCSV('death_certificates.csv');
  let dCount = 0;
  for (const r of deathRows) {
    const uid = userIdMap[r.deceased_user_id];
    if (!uid) continue;
    try {
      await Certificate.create({
        userId: uid,
        type: 'death',
        status: mapCertStatus(r.certificate_status),
        certificateNumber: `DC-${r.certificate_id}`,
        applicationData: {
          dateOfDeath: r.date_of_death, causeOfDeath: r.cause_of_death,
          placeOfDeath: r.place_of_death, registrationDate: r.registration_date
        },
        issuedDate: r.registration_date ? new Date(r.registration_date) : null,
        createdAt: r.registration_date ? new Date(r.registration_date) : new Date()
      });
      dCount++;
    } catch (e) {}
  }
  console.log(`💀 Death Certificates: ${dCount}`);

  // ── 5. Grievances / Complaints ───────────────────────────────────────────
  const grievRows = readCSV('grievances.csv');
  let gCount = 0;
  for (const r of grievRows) {
    const uid = userIdMap[r.user_id];
    if (!uid) continue;
    try {
      await Complaint.create({
        userId: uid,
        title: r.complaint_type,
        description: r.description,
        category: mapComplaintCategory(r.complaint_category),
        priority: mapPriority(r.priority),
        status: mapComplaintStatus(r.status),
        department: r.complaint_category,
        location: `Ward ${r.ward_number}, ${r.village}`,
        createdAt: r.submitted_date ? new Date(r.submitted_date) : new Date()
      });
      gCount++;
    } catch (e) {}
  }
  console.log(`📢 Grievances: ${gCount}`);

  // ── 6. Fund Allocations ──────────────────────────────────────────────────
  const fundRows = readCSV('fund_allocation.csv');
  let fCount = 0;
  for (const r of fundRows) {
    try {
      await Fund.create({
        ward: r.ward_number,
        year: Number(r.financial_year),
        category: mapFundCategory(r.department),
        allocated: Number(r.fund_allocated),
        spent: Number(r.fund_used),
        description: `${r.department} — ${r.fund_source}`,
        updatedAt: r.last_updated ? new Date(r.last_updated) : new Date()
      });
      fCount++;
    } catch (e) {}
  }
  console.log(`💰 Fund Records: ${fCount}`);

  // ── 7. Gram Sabha Meetings ───────────────────────────────────────────────
  const gsRows = readCSV('gram_sabha_meetings.csv');
  let gsCount = 0;
  for (const r of gsRows) {
    try {
      await GramSabha.create({
        meetingId: Number(r.meeting_id),
        wardNumber: Number(r.ward_number),
        meetingTitle: r.meeting_title,
        meetingDate: new Date(r.meeting_date),
        meetingLocation: r.meeting_location,
        agenda: r.agenda,
        meetingDurationMinutes: Number(r.meeting_duration_minutes),
        status: r.status
      });
      gsCount++;
    } catch (e) {}
  }
  console.log(`🏛️  Gram Sabha Meetings: ${gsCount}`);

  // ── 8. Schemes (from unique names in scheme_applications.csv) ────────────
  const appRows = readCSV('scheme_applications.csv');
  const schemeNameMap = {};
  const uniqueSchemes = [...new Map(appRows.map(r => [r.scheme_name, r])).values()];
  for (const r of uniqueSchemes) {
    if (!r.scheme_name) continue;
    try {
      const s = await Scheme.create({
        name: r.scheme_name,
        description: `Government scheme: ${r.scheme_name}`,
        type: mapSchemeType(r.scheme_category),
        benefits: `Benefits under ${r.scheme_name}`,
        applicationProcess: 'Apply via Panchayat Office or Common Service Center',
        isActive: true
      });
      schemeNameMap[r.scheme_name] = s._id;
    } catch (e) {}
  }
  console.log(`🎯 Schemes created: ${Object.keys(schemeNameMap).length}`);

  // ── 9. Scheme Applications ───────────────────────────────────────────────
  let saCount = 0;
  for (const r of appRows) {
    const uid = userIdMap[r.user_id];
    const sid = schemeNameMap[r.scheme_name];
    if (!uid || !sid) continue;
    try {
      await SchemeApplication.create({
        userId: uid, schemeId: sid,
        status: mapAppStatus(r.status),
        applicationData: {
          applicationType: r.application_type,
          enrollmentDate: r.enrollment_date
        },
        approvalDate: r.enrollment_date ? new Date(r.enrollment_date) : null,
        createdAt: r.application_date ? new Date(r.application_date) : new Date()
      });
      saCount++;
    } catch (e) {}
  }
  console.log(`📋 Scheme Applications: ${saCount}`);

  // ── 10. Tax Records ──────────────────────────────────────────────────────
  const taxRows = readCSV('tax_records.csv');
  let tCount = 0;
  for (const r of taxRows) {
    if (!r.user_id) continue;
    const uid = userIdMap[r.user_id];
    if (!uid) continue;
    try {
      await Tax.create({
        userId: uid,
        taxType: mapTaxType(r.tax_type),
        amount: Number(r.amount_due) || 0,
        year: Number(r.tax_year),
        status: mapTaxStatus(r.payment_status),
        paymentDate: r.payment_date && r.payment_date !== '' ? new Date(r.payment_date) : null,
        receiptNumber: r.transaction_id && r.transaction_id !== '' ? r.transaction_id : undefined,
        propertyDetails: {
          propertyId: r.property_id, amountDue: Number(r.amount_due),
          amountPaid: Number(r.amount_paid), paymentMethod: r.payment_method
        }
      });
      tCount++;
    } catch (e) {}
  }
  console.log(`💳 Tax Records: ${tCount}`);

  // ── 11. Households ───────────────────────────────────────────────────────
  const hhRows = readCSV('households.csv');
  let hhCount = 0;
  for (const r of hhRows) {
    const uid = userIdMap[r.head_user_id];
    try {
      await Household.create({
        householdId: Number(r.household_id),
        headUserId: uid || undefined,
        csvUserId: Number(r.head_user_id),
        wardNumber: Number(r.ward_number),
        houseType: r.house_type,
        familySize: Number(r.family_size)
      });
      hhCount++;
    } catch (e) {}
  }
  console.log(`🏠 Households: ${hhCount}`);

  // ── 12. Properties ───────────────────────────────────────────────────────
  const propRows = readCSV('properties.csv');
  let pCount = 0;
  for (const r of propRows) {
    const uid = userIdMap[r.owner_user_id];
    try {
      await Property.create({
        propertyId: Number(r.property_id),
        ownerUserId: uid || undefined,
        csvOwnerId: Number(r.owner_user_id),
        wardNumber: Number(r.ward_number),
        landType: r.land_type,
        landAreaAcres: parseFloat(r.land_area_acres),
        pricePerAcre: Number(r.price_per_acre),
        estimatedValue: Number(r.estimated_value)
      });
      pCount++;
    } catch (e) {}
  }
  console.log(`🏡 Properties: ${pCount}`);

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n✅ SEEDING COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Admin Login:');
  console.log('   Email:    admin@rampurkalan.gov.in');
  console.log('   Password: Admin@123');
  console.log('🔑 Citizen Login (any citizen):');
  console.log('   Email:    <from citizens.csv email column>');
  console.log('   Password: <phone number from citizens.csv>');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
