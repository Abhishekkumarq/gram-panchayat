import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api';
import { useLanguage } from '../LanguageContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await auth.login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(!showAdminLogin);
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="auth-layout">
      {/* Top Govt Header */}
      <div className="auth-layout-top">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
          alt="Emblem of India"
          className="auth-layout-top-emblem"
        />
        <span className="auth-layout-top-text">
          Gram Panchayat E-Governance Portal
        </span>
      </div>

      {/* Login Form */}
      <div className="auth-layout-body">
        <div className="auth-card">
          <div className="auth-card-header">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India Emblem"
              className="auth-emblem"
            />
            <p className="auth-portal-hindi">ग्राम पंचायत पोर्टल</p>
            <h1>Gram Panchayat Portal</h1>
            <h2>{t('login')}</h2>
            <p className="auth-subtitle">Enter your registered credentials to access the portal</p>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">{t('email')} / Phone</label>
              <input
                id="email"
                type="text"
                placeholder="Enter email or 10-digit phone number"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t('password')}</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>
            <button type="submit">{t('login')} →</button>
          </form>

          <button onClick={handleAdminLogin} className="admin-toggle">
            {showAdminLogin ? 'Switch to Citizen Login' : 'Login as Officer / Admin'}
          </button>

          <p>{t('dontHaveAccount')} <Link to="/register">{t('register')}</Link></p>
        </div>
      </div>

      {/* Bottom Govt Footer */}
      <div className="auth-layout-footer">
        © {new Date().getFullYear()} Government of India | Ministry of Panchayati Raj | All Rights Reserved
      </div>
    </div>
  );
}

export default Login;
