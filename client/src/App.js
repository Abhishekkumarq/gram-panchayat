import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './LanguageContext';
import socketService from './socketService';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Certificates from './components/Certificates';
import Taxes from './components/Taxes';
import Complaints from './components/Complaints';
import Schemes from './components/Schemes';
import Funds from './components/Funds';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import Breadcrumb from './components/Breadcrumb';
import Footer from './components/Footer';
import Applications from './components/Applications';
import Documents from './components/Documents';
import GramMitra from './components/GramMitra';
import ModernHeader from './components/ModernHeader';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    socketService.connect();
    return () => {};
  }, []);

  const PrivateRoute = ({ children, hideBreadcrumb = false, hideHeader = false }) => {
    return user ? (
      <>
        {!hideHeader && <ModernHeader user={user} setUser={setUser} />}
        {!hideBreadcrumb && <Breadcrumb />}
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </>
    ) : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return user && (user.role === 'admin' || user.role === 'officer') ? (
      <main id="main-content">
        {children}
      </main>
    ) : <Navigate to="/dashboard" />;
  };

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            {/* Dashboard has its own full header, skip ModernHeader and Breadcrumb */}
            <Route path="/dashboard" element={
              <PrivateRoute hideBreadcrumb={true} hideHeader={true}>
                <Dashboard user={user} setUser={setUser} />
              </PrivateRoute>
            } />
            <Route path="/certificates" element={<PrivateRoute><Certificates user={user} /></PrivateRoute>} />
            <Route path="/taxes" element={<PrivateRoute><Taxes user={user} /></PrivateRoute>} />
            <Route path="/complaints" element={<PrivateRoute><Complaints user={user} /></PrivateRoute>} />
            <Route path="/schemes" element={<PrivateRoute><Schemes user={user} /></PrivateRoute>} />
            <Route path="/funds" element={<PrivateRoute><Funds user={user} /></PrivateRoute>} />
            <Route path="/applications" element={<PrivateRoute><Applications user={user} /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Documents user={user} /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
          {user && <GramMitra />}
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
