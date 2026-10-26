import React, { useState } from 'react';

const Header = ({ activePage, setActivePage, session, adminSession, onLogout, onAdminLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = Boolean(session || adminSession);

  const handleNavClick = (page, anchor) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="main-header">
      <div className="nav-container">
        <div className="brand-logo" onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'home')}>
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <span className="brand-name">ALETHEIA</span>
            <span className="brand-sub">
              {adminSession ? 'ADMIN COMMAND OVERSEER' : session ? 'OFFICER DASHBOARD' : activePage === 'login' ? 'PORTAL LOGIN' : activePage === 'register' ? 'PORTAL REGISTRATION' : 'CASEMIND AI'}
            </span>
          </div>
        </div>

        {/* Hide HOME, VISION, ABOUT US links when logged in */}
        {!isLoggedIn && (
          <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <a
              onClick={() => handleNavClick('home')}
              className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
            >
              HOME
            </a>
            <a
              onClick={() => handleNavClick('home', 'vision')}
              className="nav-link"
            >
              VISION
            </a>
            <a
              onClick={() => handleNavClick('home', 'about')}
              className="nav-link"
            >
              ABOUT US
            </a>
          </nav>
        )}

        {!isLoggedIn ? (
          <div className="nav-actions">
            {activePage !== 'login' && (
              <button
                onClick={() => handleNavClick('login')}
                className="btn btn-outline btn-login-magenta"
              >
                LOGIN
              </button>
            )}
            {activePage !== 'register' && (
              <button
                onClick={() => handleNavClick('register')}
                className="btn btn-outline"
              >
                REGISTER
              </button>
            )}
          </div>
        ) : (
          <div className="nav-actions">
            <div className="user-badge" style={{ borderColor: adminSession ? 'var(--neon-magenta)' : 'var(--neon-green)' }}>
              <span className="pulse-dot" style={{ background: adminSession ? 'var(--neon-magenta)' : 'var(--neon-green)' }}></span>
              <span>{adminSession ? `Admin_ID: ${adminSession.admin_id}` : `Ajex_ID: ${session.ajex_id}`}</span>
            </div>
            <button onClick={adminSession ? onAdminLogout : onLogout} className="btn btn-outline btn-sm btn-login-magenta">
              LOGOUT
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <button
            className="hamburger-menu"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
