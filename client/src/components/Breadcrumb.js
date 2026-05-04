import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbLabels = {
    dashboard: 'Dashboard',
    schemes: 'Schemes',
    certificates: 'Certificates',
    complaints: 'Complaints',
    taxes: 'Taxes',
    funds: 'Funds',
    applications: 'My Applications',
    documents: 'My Documents',
    admin: 'Admin Dashboard',
    about: 'About Us',
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/dashboard" className="breadcrumb-link">
            🏠 Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = breadcrumbLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={routeTo} className="breadcrumb-item">
              <span className="breadcrumb-separator">/</span>
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
