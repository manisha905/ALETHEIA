import React, { useState } from 'react';
import { loginAdminApi } from '../services/api';

const AdminLoginPage = ({ onAdminLoginSuccess, setActivePage, onSelectRole }) => {
  const [adminForm, setAdminForm] = useState({
    adminId: '',
    password: ''
  });
  const [statusMsg, setStatusMsg] = useState(null);

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: 'info', text: '⚡ VERIFYING MASTER ADMIN CLEARANCE...' });

    try {
      const adminData = await loginAdminApi(adminForm.adminId, adminForm.password);
      setStatusMsg({ type: 'success', text: '✅ ADMIN AUTHORIZATION GRANTED: Unlocking System Security & Database Surveillance Overseer...' });
      
      setTimeout(() => {
        onAdminLoginSuccess(adminData);
        setStatusMsg(null);
      }, 600);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `❌ ADMIN AUTHENTICATION DENIED: ${err.message}`
      });
    }
  };

  return (
    <main className="section-padding">
      <div className="container">
        <div className="page-auth-box" style={{ borderColor: 'var(--neon-magenta)' }}>
          {/* ROLE SELECTOR TOP BANNER */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              onClick={() => onSelectRole('dept')}
            >
              🏢 DEPARTMENT OFFICER LOGIN
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm btn-login-magenta"
              style={{ flex: 1 }}
            >
              🛡️ ADMIN COMMAND LOGIN
            </button>
          </div>

          <div className="auth-box-header text-center">
            <div className="terminal-tag" style={{ borderColor: 'var(--neon-magenta)', color: 'var(--neon-magenta)' }}>
              🛡️ MASTER ADMIN SECURITY CLEARANCE
            </div>
            <h2>ADMINISTRATOR LOGIN</h2>
            <p className="motto-subtext">"DATABASE INTEGRITY & SURVEILLANCE OVERSEER"</p>
            <p>Enter your <strong>Admin ID</strong> and Master Password to manage database security & intrusion logs</p>
          </div>

          <div className="auth-box-body">
            <form onSubmit={handleAdminLoginSubmit}>
              <div style={{ background: 'rgba(255, 0, 128, 0.08)', border: '1px solid rgba(255, 0, 128, 0.3)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.78rem', color: '#FFFFFF' }}>
                <span style={{ color: 'var(--neon-magenta)', fontWeight: 'bold' }}>💡 DEMO MASTER ADMIN CREDENTIALS:</span>
                <br />Admin ID: <code style={{ color: 'var(--neon-yellow)' }}>ADMIN-SYS-01</code> | Master Password: <code style={{ color: 'var(--neon-yellow)' }}>admin123</code>
              </div>

              <div className="form-group">
                <label>ADMIN ID / SECURITY CODE:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ADMIN-SYS-01"
                  value={adminForm.adminId}
                  onChange={(e) => setAdminForm({ ...adminForm, adminId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>MASTER ADMIN PASSWORD:</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-outline btn-block btn-lg btn-login-magenta" style={{ marginTop: '20px' }}>
                🔓 AUTHENTICATE ADMIN COMMAND
              </button>
            </form>

            {statusMsg && (
              <div className="terminal-response-box" style={{ marginTop: '15px' }}>
                <span className={statusMsg.type === 'error' ? 'highlight-red' : 'highlight-green'}>
                  {statusMsg.text}
                </span>
              </div>
            )}

            <div className="auth-footer-link text-center" style={{ marginTop: '25px' }}>
              <span>Need to onboard a new Department? </span>
              <a onClick={() => setActivePage('register')} className="highlight-green" style={{ cursor: 'pointer' }}>
                Go to Registration Portal
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginPage;
