import React, { useState } from 'react';

const AdminRegisterPage = ({ onAdminLoginSuccess, setActivePage, onSelectRole }) => {
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    adminId: `ADMIN-SYS-0${Math.floor(2 + Math.random() * 8)}`,
    provisioningKey: '',
    password: '',
    confirmPassword: ''
  });
  const [statusMsg, setStatusMsg] = useState(null);

  const handleAdminRegisterSubmit = (e) => {
    e.preventDefault();

    if (adminForm.password !== adminForm.confirmPassword) {
      setStatusMsg({ type: 'error', text: '❌ PASSWORD MISMATCH: Passwords do not match.' });
      return;
    }

    if (adminForm.provisioningKey.trim() !== 'MASTER-CLEARANCE-2026' && adminForm.provisioningKey.trim() !== 'admin123') {
      setStatusMsg({
        type: 'error',
        text: '❌ AUTHORIZATION DENIED: Invalid Master Provisioning Key. Only authorized system administrators can provision new admin clearings.'
      });
      return;
    }

    const newAdmin = {
      admin_id: adminForm.adminId,
      name: adminForm.name,
      email: adminForm.email,
      role: 'SYSTEM_ADMIN',
      clearance: 'LEVEL-5 TOP SECRET'
    };

    setStatusMsg({ type: 'success', text: `✅ MASTER PROVISIONING GRANTED: Admin ID [${adminForm.adminId}] provisioned successfully!` });

    setTimeout(() => {
      onAdminLoginSuccess(newAdmin);
    }, 1200);
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
              🏢 DEPARTMENT ONBOARDING
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm btn-login-magenta"
              style={{ flex: 1 }}
            >
              🛡️ ADMIN PROVISIONING
            </button>
          </div>

          <div className="auth-box-header text-center">
            <div className="terminal-tag" style={{ borderColor: 'var(--neon-magenta)', color: 'var(--neon-magenta)' }}>
              🛡️ MASTER CLEARANCE PROVISIONING
            </div>
            <h2>ADMINISTRATOR PROVISIONING</h2>
            <p className="motto-subtext">"DATABASE INTEGRITY & SURVEILLANCE OVERSEER"</p>
            <p>Provision a new System Administrator with Level-5 Security Clearance</p>
          </div>

          <div className="auth-box-body">
            <form onSubmit={handleAdminRegisterSubmit}>
              <div style={{ background: 'rgba(255, 0, 128, 0.08)', border: '1px solid rgba(255, 0, 128, 0.3)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.78rem', color: '#FFFFFF' }}>
                <span style={{ color: 'var(--neon-magenta)', fontWeight: 'bold' }}>💡 MASTER PROVISIONING KEY:</span>
                <br />Demo Provisioning Key: <code style={{ color: 'var(--neon-yellow)' }}>MASTER-CLEARANCE-2026</code>
              </div>

              <div className="form-group">
                <label>ADMIN FULL NAME / OFFICER DESIGNATION:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chief Inspector R. S. Mehta"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>ADMIN OFFICIAL EMAIL:</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin.sec@aletheia.gov.in"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>MASTER PROVISIONING KEY (CLEARANCE VERIFICATION):</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="MASTER-CLEARANCE-2026"
                  value={adminForm.provisioningKey}
                  onChange={(e) => setAdminForm({ ...adminForm, provisioningKey: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>SET MASTER ADMIN PASSWORD:</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  minLength={6}
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>CONFIRM MASTER ADMIN PASSWORD:</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  minLength={6}
                  value={adminForm.confirmPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-outline btn-block btn-lg btn-login-magenta" style={{ marginTop: '20px' }}>
                ⚡ PROVISION ADMIN CLEARANCE
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
              <span>Already have Admin Credentials? </span>
              <a onClick={() => setActivePage('login')} className="highlight-magenta" style={{ cursor: 'pointer' }}>
                Login to Admin Command
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminRegisterPage;
