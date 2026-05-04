import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taxes } from '../api';
import { useLanguage } from '../LanguageContext';
import './Service.css';

/* ── Income Tax slabs FY 2024-25 (New Regime) ── */
const calcIncomeTax = (income) => {
  const slabs = [
    { limit: 300000,  rate: 0    },
    { limit: 600000,  rate: 0.05 },
    { limit: 900000,  rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity,rate: 0.30 },
  ];
  let tax = 0, prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.limit) - prev;
    tax += taxable * slab.rate;
    prev = slab.limit;
  }
  const cess = tax * 0.04;
  return { tax: Math.round(tax), cess: Math.round(cess), total: Math.round(tax + cess) };
};

/* ── GST calculation ── */
const calcGST = (amount, rate) => {
  const gst = (amount * rate) / 100;
  return { cgst: gst / 2, sgst: gst / 2, total: gst, payable: amount + gst };
};

function Taxes({ user }) {
  const [myTaxes, setMyTaxes]           = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcTab, setCalcTab]           = useState('property');
  const [calcData, setCalcData]         = useState({ propertyArea: '', propertyType: 'residential' });
  const [propertyResult, setPropertyResult] = useState(null);
  const [incomeData, setIncomeData]     = useState({ income: '', regime: 'new' });
  const [incomeResult, setIncomeResult] = useState(null);
  const [gstData, setGstData]           = useState({ amount: '', rate: '18' });
  const [gstResult, setGstResult]       = useState(null);
  const [payingId, setPayingId]         = useState(null);
  const [msg, setMsg]                   = useState({ text: '', ok: true });
  const { t } = useLanguage();
  const isAdmin = user && (user.role === 'admin' || user.role === 'officer');

  useEffect(() => { fetchTaxes(); }, []);

  const fetchTaxes = async () => {
    try {
      const { data } = isAdmin ? await taxes.getAll() : await taxes.getMy();
      setMyTaxes(data);
    } catch (err) { console.error(err); }
  };

  const handlePropertyCalc = async () => {
    if (!calcData.propertyArea) return;
    try {
      const { data } = await taxes.calculate({ taxType: 'property', ...calcData });
      setPropertyResult(data.amount);
    } catch { setMsg({ text: 'Calculation failed. Please check the values.', ok: false }); }
  };

  const handleIncomeCalc = () => {
    const income = Number(incomeData.income);
    if (!income || income <= 0) return;
    setIncomeResult(calcIncomeTax(income));
  };

  const handleGstCalc = () => {
    const amount = Number(gstData.amount);
    if (!amount || amount <= 0) return;
    setGstResult(calcGST(amount, Number(gstData.rate)));
  };

  const handlePayment = async (taxId) => {
    setPayingId(taxId);
    try {
      await taxes.pay(taxId);
      setMsg({ text: 'Tax payment successful! Receipt has been generated.', ok: true });
      fetchTaxes();
    } catch { setMsg({ text: 'Payment failed. Please try again.', ok: false }); }
    setPayingId(null);
    setTimeout(() => setMsg({ text: '', ok: true }), 5000);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="service-page">
      <div className="svc-page-header">
        <div className="svc-page-header-inner">
          <div>
            <p className="svc-breadcrumb"><Link to="/dashboard">Home</Link> / {t('taxPayment')}</p>
            <h1 className="svc-page-title">{t('taxPayment')}</h1>
            <p className="svc-page-subtitle">Pay property tax, income tax, GST, vehicle tax and other government dues online</p>
          </div>
          {!isAdmin && (
            <button className={`svc-header-action ${showCalculator ? 'cancel' : ''}`} onClick={() => { setShowCalculator(!showCalculator); setPropertyResult(null); setIncomeResult(null); setGstResult(null); }}>
              {showCalculator ? t('cancel') : t('taxCalculator')}
            </button>
          )}
        </div>
      </div>

      <div className="service-content">
        {msg.text && (
          <div style={{ background: msg.ok ? '#EBF7EB' : '#FDEAEA', color: msg.ok ? '#0A4D0A' : '#7A0000', padding: '0.75rem 1rem', borderLeft: `4px solid ${msg.ok ? '#138808' : '#CC0000'}`, borderRadius: 3, marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {msg.text}
          </div>
        )}

        {!isAdmin && showCalculator && (
          <div className="list-section" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>Tax Calculator</h3>
            <div className="calc-wrapper">

              {/* Sidebar tabs */}
              <div className="calc-tabs">
                {[
                  { id: 'property', label: 'Property Tax',  sub: 'Municipal / Panchayat' },
                  { id: 'income',   label: 'Income Tax',    sub: 'FY 2024-25 New Regime' },
                  { id: 'gst',      label: 'GST Calculator', sub: 'Goods & Services Tax'  },
                ].map(tab => (
                  <button key={tab.id}
                    className={`calc-tab ${calcTab === tab.id ? 'active' : ''}`}
                    onClick={() => { setCalcTab(tab.id); setPropertyResult(null); setIncomeResult(null); setGstResult(null); }}>
                    {tab.label}
                    <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 400, color: calcTab === tab.id ? '#888' : '#999', marginTop: 2 }}>{tab.sub}</span>
                  </button>
                ))}
              </div>

              {/* ── Property Tax ── */}
              {calcTab === 'property' && (
                <div className="calc-panel">
                  <p className="calc-panel-title">Property Tax Calculator</p>
                  <p className="calc-panel-sub">Estimate your annual Gram Panchayat property tax</p>
                  <div className="calc-fields">
                    <div className="calc-field">
                      <label>Property Area (sq. ft.) *</label>
                      <input type="number" placeholder="e.g. 1200" min="1"
                        value={calcData.propertyArea}
                        onChange={e => setCalcData({ ...calcData, propertyArea: e.target.value })} />
                    </div>
                    <div className="calc-field">
                      <label>Property Type</label>
                      <select value={calcData.propertyType} onChange={e => setCalcData({ ...calcData, propertyType: e.target.value })}>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>
                  </div>
                  <button className="calc-btn" onClick={handlePropertyCalc}>Calculate Tax</button>
                  {propertyResult !== null && (
                    <div className="calc-result">
                      <div className="calc-result-row total"><span>Annual Property Tax</span><strong>₹{Number(propertyResult).toLocaleString('en-IN')}</strong></div>
                      <p className="calc-result-note">Estimated amount. Actual tax may vary based on municipal assessment.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Income Tax ── */}
              {calcTab === 'income' && (
                <div className="calc-panel">
                  <p className="calc-panel-title">Income Tax Estimator</p>
                  <p className="calc-panel-sub">New Tax Regime — FY 2024-25</p>
                  <div className="calc-note">
                    Slabs: Up to ₹3L — 0% &nbsp;|&nbsp; ₹3L–6L — 5% &nbsp;|&nbsp; ₹6L–9L — 10% &nbsp;|&nbsp; ₹9L–12L — 15% &nbsp;|&nbsp; ₹12L–15L — 20% &nbsp;|&nbsp; Above ₹15L — 30%. For Old Regime visit <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer">incometax.gov.in ↗</a>
                  </div>
                  <div className="calc-fields" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="calc-field">
                      <label>Annual Income (₹) *</label>
                      <input type="number" placeholder="e.g. 800000" min="0"
                        value={incomeData.income}
                        onChange={e => setIncomeData({ ...incomeData, income: e.target.value })} />
                    </div>
                  </div>
                  <button className="calc-btn" onClick={handleIncomeCalc}>Calculate Tax</button>
                  {incomeResult && (
                    <div className="calc-result">
                      <div className="calc-result-row"><span>Income Tax</span><strong>₹{incomeResult.tax.toLocaleString('en-IN')}</strong></div>
                      <div className="calc-result-row"><span>Health & Education Cess (4%)</span><strong>₹{incomeResult.cess.toLocaleString('en-IN')}</strong></div>
                      <div className="calc-result-row total"><span>Total Tax Payable</span><strong>₹{incomeResult.total.toLocaleString('en-IN')}</strong></div>
                      <p className="calc-result-note">Estimate only. Deductions under 80C, HRA etc. not considered.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── GST ── */}
              {calcTab === 'gst' && (
                <div className="calc-panel">
                  <p className="calc-panel-title">GST Calculator</p>
                  <p className="calc-panel-sub">Calculate CGST + SGST on goods and services</p>
                  <div className="calc-fields">
                    <div className="calc-field">
                      <label>Base Amount (₹) *</label>
                      <input type="number" placeholder="e.g. 10000" min="0"
                        value={gstData.amount}
                        onChange={e => setGstData({ ...gstData, amount: e.target.value })} />
                    </div>
                    <div className="calc-field">
                      <label>GST Rate</label>
                      <select value={gstData.rate} onChange={e => setGstData({ ...gstData, rate: e.target.value })}>
                        <option value="5">5% — Essential goods</option>
                        <option value="12">12% — Standard goods</option>
                        <option value="18">18% — Services / most goods</option>
                        <option value="28">28% — Luxury goods</option>
                      </select>
                    </div>
                  </div>
                  <button className="calc-btn" onClick={handleGstCalc}>Calculate GST</button>
                  {gstResult && (
                    <div className="calc-result">
                      <div className="calc-result-row"><span>Base Amount</span><strong>₹{Number(gstData.amount).toLocaleString('en-IN')}</strong></div>
                      <div className="calc-result-row"><span>CGST ({gstData.rate / 2}%)</span><strong>₹{gstResult.cgst.toLocaleString('en-IN')}</strong></div>
                      <div className="calc-result-row"><span>SGST ({gstData.rate / 2}%)</span><strong>₹{gstResult.sgst.toLocaleString('en-IN')}</strong></div>
                      <div className="calc-result-row total"><span>Total Payable (incl. GST)</span><strong>₹{gstResult.payable.toLocaleString('en-IN')}</strong></div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        <div className="list-section">
          <h3>{isAdmin ? t('allTaxRecords') : t('myTaxRecords')}</h3>
          {myTaxes.length === 0 ? (
            <div className="no-results">{t('noTaxRecords')}</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    {isAdmin && <th>{t('citizenLabel')}</th>}
                    <th>Tax Type</th>
                    <th>Year</th>
                    <th>{t('amount')}</th>
                    <th>{t('status')}</th>
                    <th>Receipt No.</th>
                    {!isAdmin && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {myTaxes.map((tax, i) => (
                    <tr key={tax._id}>
                      <td>{i + 1}</td>
                      {isAdmin && <td><strong>{tax.userId?.name || '—'}</strong><br /><span style={{ fontSize: '0.75rem', color: '#888' }}>{tax.userId?.email}</span></td>}
                      <td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{tax.taxType}</td>
                      <td>{tax.year}</td>
                      <td style={{ fontWeight: 700, color: '#003087' }}>₹{Number(tax.amount).toLocaleString('en-IN')}</td>
                      <td><span className={`status ${tax.status}`}>{tax.status}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{tax.receiptNumber || '—'}</td>
                      {!isAdmin && (
                        <td>
                          {tax.status === 'pending' ? (
                            <button
                              className="pay-btn"
                              style={{ margin: 0 }}
                              disabled={payingId === tax._id}
                              onClick={() => handlePayment(tax._id)}
                            >
                              {payingId === tax._id ? 'Processing…' : t('payNow')}
                            </button>
                          ) : (
                            <span style={{ color: '#138808', fontSize: '0.82rem', fontWeight: 600 }}>Paid</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Government Tax Portals */}
        <div className="list-section">
          <h3>Government Tax Portals</h3>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Pay other central and state government taxes through official portals. These links redirect to secure government websites.
          </p>
          <div className="tax-portals-grid">
            {[
              {
                name: 'Income Tax',
                desc: 'File ITR, pay advance tax, check refund status',
                tag: 'Central Govt',
                url: 'https://www.incometax.gov.in',
                color: '#003087',
              },
              {
                name: 'GST Portal',
                desc: 'File GST returns, pay GST, check GSTIN',
                tag: 'Central Govt',
                url: 'https://www.gst.gov.in',
                color: '#138808',
              },
              {
                name: 'TDS / TCS',
                desc: 'View Form 26AS, TDS certificates and traces',
                tag: 'TRACES',
                url: 'https://www.tdscpc.gov.in',
                color: '#6A1B9A',
              },
              {
                name: 'Vehicle Tax',
                desc: 'Pay road tax, renew vehicle registration',
                tag: 'Parivahan',
                url: 'https://parivahan.gov.in',
                color: '#E65100',
              },
              {
                name: 'Customs Duty',
                desc: 'Pay import/export customs duty online',
                tag: 'ICEGATE',
                url: 'https://www.icegate.gov.in',
                color: '#00695C',
              },
              {
                name: 'Bharat Kosh',
                desc: 'Pay miscellaneous government fees and dues',
                tag: 'Govt of India',
                url: 'https://bharatkosh.gov.in',
                color: '#B71C1C',
              },
            ].map(portal => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tax-portal-card"
                style={{ borderLeftColor: portal.color }}
              >
                <div className="tax-portal-top">
                  <span className="tax-portal-tag" style={{ background: portal.color }}>{portal.tag}</span>
                  <span className="tax-portal-ext">&#8599;</span>
                </div>
                <h4 className="tax-portal-name">{portal.name}</h4>
                <p className="tax-portal-desc">{portal.desc}</p>
                <span className="tax-portal-link" style={{ color: portal.color }}>Visit Portal →</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Taxes;
