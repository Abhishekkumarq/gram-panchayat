import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { funds } from '../api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../LanguageContext';
import './Service.css';

function Funds({ user }) {
  const [fundData, setFundData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetchFunds();
  }, [year]);

  const fetchFunds = async () => {
    setRefreshing(true);
    try {
      const [fundsData, analyticsData] = await Promise.all([
        funds.getAll({ year }),
        funds.getAnalytics({ year })
      ]);
      setFundData(fundsData.data);
      setAnalytics(analyticsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const categoryData = analytics?.byCategory ? Object.keys(analytics.byCategory).map(key => ({
    name: key,
    allocated: analytics.byCategory[key].allocated,
    spent: analytics.byCategory[key].spent
  })) : [];

  const wardData = analytics?.byWard ? Object.keys(analytics.byWard).map(key => ({
    name: key,
    allocated: analytics.byWard[key].allocated,
    spent: analytics.byWard[key].spent
  })) : [];

  return (
    <div className="service-page">
      <div className="svc-page-header">
        <div className="svc-page-header-inner">
          <div>
            <p className="svc-breadcrumb"><Link to="/dashboard">Home</Link> / {t('funds')}</p>
            <h1 className="svc-page-title">{t('fundTransparency')}</h1>
            <p className="svc-page-subtitle">Ward-wise budget allocation, expenditure and utilisation data</p>
          </div>
        </div>
      </div>

      <div className="service-content">
        <div className="year-selector">
          <label>{t('selectYear')}: </label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        {analytics && (
          <div className="analytics-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{t('totalAllocated')}</h3>
                <p className="stat-value">₹{analytics.totalAllocated?.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>{t('totalSpent')}</h3>
                <p className="stat-value">₹{analytics.totalSpent?.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>{t('utilizationRate')}</h3>
                <p className="stat-value">{analytics.utilizationRate}%</p>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>{t('budgetByCategory')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="allocated" fill="#8884d8" name={t('allocated')} />
                    <Bar dataKey="spent" fill="#82ca9d" name={t('spent')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>{t('wardWiseAllocation')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wardData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="allocated" fill="#0088FE" name={t('allocated')} />
                    <Bar dataKey="spent" fill="#00C49F" name={t('spent')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="list-section">
          <h3>{t('detailedFundAllocation')}</h3>
          {fundData.length === 0 ? (
            <p>{t('noFundData')} {year}</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{t('ward')}</th>
                    <th>{t('category')}</th>
                    <th>{t('allocated')}</th>
                    <th>{t('spent')}</th>
                    <th>{t('remaining')}</th>
                    <th>{t('utilization')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fundData.map((fund) => (
                    <tr key={fund._id}>
                      <td>{fund.ward}</td>
                      <td>{fund.category}</td>
                      <td>₹{fund.allocated.toLocaleString()}</td>
                      <td>₹{fund.spent.toLocaleString()}</td>
                      <td>₹{(fund.allocated - fund.spent).toLocaleString()}</td>
                      <td>{((fund.spent / fund.allocated) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Funds;
