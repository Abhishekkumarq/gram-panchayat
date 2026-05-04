import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../api';
import { useLanguage } from '../LanguageContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', aadhar: ''
  });
  const [error, setError]         = useState('');
  const [aadharError, setAadharError] = useState('');
  const [success, setSuccess]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAadhar = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    setFormData({ ...formData, aadhar: digits });
    if (digits.length > 0 && digits.length < 12) {
      setAadharError('Aadhaar number must be exactly 12 digits.');
    } else {
      setAadharError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.aadhar && formData.aadhar.length !== 12) {
      setAadharError('Aadhaar number must be exactly 12 digits.');
      return;
    }
    setError('');
    try {
      await auth.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-layout">
      {/* Top Header */}
      <div className="auth-layout-top">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
          alt="Emblem of India"
          className="auth-layout-top-emblem"
        />
        <span className="auth-layout-top-text">Gram Panchayat E-Governance Portal</span>
      </div>

      {/* Form */}
      <div className="auth-layout-body">
        <div className="auth-card">
          <div className="auth-card-header">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India Emblem"
              className="auth-emblem"
            />
            <p className="auth-portal-hindi">नागरिक पंजीकरण</p>
            <h1>Gram Panchayat Portal</h1>
            <h2>{t('register')}</h2>
            <p className="auth-subtitle">Create your citizen account to access all online services</p>
          </div>

          {error   && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">
              <label>{t('fullName')} *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email + Phone in one row */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('email')}</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t('phone')} *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  maxLength={10}
                  onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>{t('password')} *</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
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

            {/* Aadhaar */}
            <div className="form-group">
              <label>{t('aadharNumber')} *</label>
              <input
                type="text"
                placeholder="12-digit Aadhaar number"
                value={formData.aadhar}
                onChange={e => handleAadhar(e.target.value)}
                maxLength={12}
                required
              />
              {aadharError && <p className="field-error">{aadharError}</p>}
              {formData.aadhar.length === 12 && (
                <p className="field-success">✓ Valid Aadhaar number</p>
              )}
            </div>

            <button type="submit">{t('register')} →</button>
          </form>

          <p>{t('alreadyHaveAccount')} <Link to="/login">{t('login')}</Link></p>
        </div>
      </div>

      {/* Footer */}
      <div className="auth-layout-footer">
        © {new Date().getFullYear()} Government of India | All Rights Reserved
      </div>
    </div>
  );
}

export default Register;
