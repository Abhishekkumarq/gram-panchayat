import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area
} from 'recharts';
import { analytics } from '../api';
import './Analytics.css';

const COLORS = {
  navy:    '#003087',
  saffron: '#FF6600',
  green:   '#138808',
  amber:   '#FF8C00',
  red:     '#CC0000',
  blue:    '#0066CC',
  purple:  '#6A0DAD',
  teal:    '#008080',
};

const PIE_PALETTE = [COLORS.navy, COLORS.saffron, COLORS.green, COLORS.amber, COLORS.blue, COLORS.purple, COLORS.teal];

const STATUS_COLORS = {
  Pending:        COLORS.amber,
  'In Progress':  COLORS.blue,
  Resolved:       COLORS.green,
  Rejected:       COLORS.red,
  Approved:       COLORS.green,
  'Under Review': COLORS.saffron,
};

const PRIORITY_COLORS = { High: COLORS.red, Medium: COLORS.amber, Low: COLORS.green };

const fmt  = n => Number(n || 0).toLocaleString('en-IN');
const fmtL = n => `₹${(n / 100000).toFixed(1)}L`;

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      {label && <p className="an-tt-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number' ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ── Chart Card ── */
function ChartCard({ title, children }) {
  return (
    <div className="an-card">
      <h4 className="an-card-title">{title}</h4>
      {children}
    </div>
  );
}

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="an-modal-overlay" onClick={onClose}>
      <div className="an-modal" onClick={e => e.stopPropagation()}>
        <div className="an-modal-header">
          <h3>{title}</h3>
          <button className="an-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="an-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ── KPI Card ── */
function KpiCard({ title, value, color, onClick }) {
  return (
    <div className="an-kpi" style={{ borderLeft: `4px solid ${color}` }} onClick={onClick}>
      <div className="an-kpi-label">{title}</div>
      <div className="an-kpi-value" style={{ color }}>{value}</div>
      {onClick && <div className="an-kpi-hint">Click to view chart →</div>}
    </div>
  );
}

/* ── Modal chart content per KPI ── */
function KpiChart({ id, data }) {
  const { genderData, ageData, grievData, priorityData, houseData, vitalData, schemeData, fundData, propData } = data;
  const grievStatuses  = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  const schemeStatuses = ['Approved', 'Pending', 'Rejected', 'Under Review'];

  if (id === 'citizens') return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={ageData} margin={{ left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Citizens" fill={COLORS.navy} radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (id === 'households') return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={houseData} dataKey="value" nameKey="name"
             cx="50%" cy="50%" outerRadius={120} innerRadius={60}
             paddingAngle={3}
             label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
             labelLine={false}>
          {houseData.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  if (id === 'taxCollected' || id === 'taxPending') return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={fundData} margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
        <XAxis dataKey="department" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
        <Tooltip content={<CustomTooltip />} formatter={v => `₹${fmt(v)}`} />
        <Legend />
        <Bar dataKey="allocated" name="Allocated" fill={COLORS.navy}  radius={[3,3,0,0]} />
        <Bar dataKey="used"      name="Used"      fill={COLORS.green} radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (id === 'grievances') return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={grievData} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
          <XAxis dataKey="category" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {grievStatuses.map(s => (
            <Bar key={s} dataKey={s} fill={STATUS_COLORS[s]} radius={[2,2,0,0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={priorityData} dataKey="value" nameKey="name"
               cx="50%" cy="50%" outerRadius={65} innerRadius={35}
               paddingAngle={3}
               label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
               labelLine={false}>
            {priorityData.map((d, i) => <Cell key={i} fill={PRIORITY_COLORS[d.name] || PIE_PALETTE[i]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );

  if (id === 'schemes') return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={schemeData} margin={{ left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
        <XAxis dataKey="category" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {schemeStatuses.map(s => (
          <Bar key={s} dataKey={s} stackId="a" fill={STATUS_COLORS[s]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  if (id === 'births') return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={vitalData} margin={{ left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="births" name="Births" stroke={COLORS.green} strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="deaths" name="Deaths" stroke={COLORS.red}   strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  if (id === 'deaths') return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={vitalData} margin={{ left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="deaths" name="Deaths" fill="#FDEAEA" stroke={COLORS.red} strokeWidth={2} />
        <Area type="monotone" dataKey="births" name="Births" fill="#EBF7EB" stroke={COLORS.green} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return null;
}

/* ══════════════════════════════════════════
   MAIN ANALYTICS COMPONENT
══════════════════════════════════════════ */
export default function Analytics() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [modal, setModal]     = useState(null); // { id, title }

  useEffect(() => {
    analytics.getSummary()
      .then(r => { setData(r.data); setLoading(false); })
      .catch(e => { setError(e.response?.data?.error || 'Failed to load analytics data'); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="an-skeleton-wrap">
      <div className="an-skeleton-kpis">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="an-skeleton-kpi skeleton" />)}
      </div>
      <div className="an-skeleton-charts">
        {[1,2,3,4,5,6].map(i => <div key={i} className="an-skeleton-chart skeleton" />)}
      </div>
    </div>
  );
  if (error)   return <div className="an-error">⚠ {error}</div>;
  if (!data)   return null;

  const { kpis, genderData, ageData, grievData, priorityData, fundData, schemeData, vitalData, houseData, propData, occData } = data;
  const grievStatuses  = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  const schemeStatuses = ['Approved', 'Pending', 'Rejected', 'Under Review'];

  const openModal = (id, title) => setModal({ id, title });
  const closeModal = () => setModal(null);

  return (
    <div className="an-wrapper">

      {/* ── KPI Cards (no icons, clickable) ── */}
      <div className="an-kpi-row">
        <KpiCard title="Total Citizens"      value={fmt(kpis.totalCitizens)}   color={COLORS.navy}    onClick={() => openModal('citizens',     'Citizen Age Distribution')} />
        <KpiCard title="Households"          value={fmt(kpis.totalHouseholds)} color={COLORS.purple}  onClick={() => openModal('households',   'Household Types')} />
        <KpiCard title="Tax Collected"       value={fmtL(kpis.taxCollected)}   color={COLORS.green}   onClick={() => openModal('taxCollected', 'Fund Allocation by Department')} />
        <KpiCard title="Tax Pending"         value={fmtL(kpis.taxPending)}     color={COLORS.amber}   onClick={() => openModal('taxPending',   'Fund Allocation by Department')} />
        <KpiCard title="Open Grievances"     value={fmt(kpis.openGrievances)}  color={COLORS.red}     onClick={() => openModal('grievances',   'Grievances — Category & Priority')} />
        <KpiCard title="Approved Schemes"    value={fmt(kpis.approvedSchemes)} color={COLORS.saffron} onClick={() => openModal('schemes',      'Scheme Applications by Category')} />
        <KpiCard title="Birth Certificates"  value={fmt(kpis.totalBirths)}     color={COLORS.teal}    onClick={() => openModal('births',       'Births vs Deaths by Year')} />
        <KpiCard title="Death Certificates"  value={fmt(kpis.totalDeaths)}     color={COLORS.blue}    onClick={() => openModal('deaths',       'Deaths vs Births Trend')} />
      </div>

      {/* ── Modal popup ── */}
      {modal && (
        <Modal title={modal.title} onClose={closeModal}>
          <KpiChart id={modal.id} data={data} />
        </Modal>
      )}

      {/* ── Row 1: Gender | Age ── */}
      <div className="an-grid-2">
        <ChartCard title="Gender Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name"
                   cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                   paddingAngle={3}
                   label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                   labelLine={false}>
                {genderData.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Age Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ageData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Citizens" fill={COLORS.navy} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 2: Grievances by Category ── */}
      <ChartCard title="Grievances by Category & Status">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={grievData} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {grievStatuses.map(s => (
              <Bar key={s} dataKey={s} fill={STATUS_COLORS[s]} radius={[2,2,0,0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Row 3: Priority | Household Types ── */}
      <div className="an-grid-2">
        <ChartCard title="Grievance Priority">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name"
                   cx="50%" cy="50%" innerRadius={65} outerRadius={100}
                   paddingAngle={3}
                   label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                   labelLine={false}>
                {priorityData.map((d, i) => <Cell key={i} fill={PRIORITY_COLORS[d.name] || PIE_PALETTE[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Household Types">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={houseData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Households" radius={[3,3,0,0]}>
                {houseData.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 4: Fund Allocation ── */}
      <ChartCard title="Fund Allocation vs Used by Department (₹)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={fundData} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip content={<CustomTooltip />} formatter={v => `₹${fmt(v)}`} />
            <Legend />
            <Bar dataKey="allocated" name="Allocated" fill={COLORS.navy}  radius={[3,3,0,0]} />
            <Bar dataKey="used"      name="Used"      fill={COLORS.green} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Row 5: Scheme Applications ── */}
      <ChartCard title="Scheme Applications by Category">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={schemeData} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {schemeStatuses.map(s => (
              <Bar key={s} dataKey={s} stackId="a" fill={STATUS_COLORS[s]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Row 6: Births vs Deaths | Occupation Income ── */}
      <div className="an-grid-2">
        <ChartCard title="Births vs Deaths by Year">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={vitalData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="births" name="Births" stroke={COLORS.green} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="deaths" name="Deaths" stroke={COLORS.red}   strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg Income by Occupation (₹)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={occData} layout="vertical" margin={{ left: 60, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip content={<CustomTooltip />} formatter={v => `₹${fmt(v)}`} />
              <Bar dataKey="avgIncome" name="Avg Income" fill={COLORS.saffron} radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 7: Property Value ── */}
      <ChartCard title="Property Estimated Value by Land Type (₹)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={propData} margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E8F5" />
            <XAxis dataKey="type" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} />
            <Tooltip content={<CustomTooltip />} formatter={v => `₹${fmt(v)}`} />
            <Bar dataKey="value" name="Estimated Value" radius={[3,3,0,0]}>
              {propData.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}
