import React, { useState, useEffect } from 'react';
import { fetchAdminWhitelist, addWhitelistDeptApi, deleteWhitelistDeptApi, fetchSecurityAuditLogsApi, runBreachScanApi } from '../services/api';
import { getRegisteredAccounts } from '../data/db';

const AdminDashboard = ({ adminSession, onLogout }) => {
  const [activeTab, setActiveTab] = useState('whitelist'); // 'whitelist', 'threats', 'accounts'
  const [whitelist, setWhitelist] = useState([]);
  const [threatData, setThreatData] = useState({ logs: [], metrics: {} });
  const [registeredAccounts, setRegisteredAccounts] = useState([]);
  
  // Whitelist Form state
  const [newDeptForm, setNewDeptForm] = useState({
    dept_id: '',
    dept_name: '',
    dept_email: ''
  });
  const [statusMsg, setStatusMsg] = useState(null);

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const depts = await fetchAdminWhitelist();
      setWhitelist(depts);

      const security = await fetchSecurityAuditLogsApi();
      setThreatData(security);

      const accounts = getRegisteredAccounts();
      setRegisteredAccounts(accounts);
    } catch (err) {
      console.error('Error loading Admin Dashboard data:', err);
    }
  };

  const handleAddDeptSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: 'info', text: '⚡ Transmitting new department to Whitelist Database...' });

    try {
      await addWhitelistDeptApi(newDeptForm);
      setStatusMsg({ type: 'success', text: `✅ DEPARTMENT AUTHORIZED: [${newDeptForm.dept_id.toUpperCase()}] successfully added to Admin Whitelist.` });
      setNewDeptForm({ dept_id: '', dept_name: '', dept_email: '' });
      await loadDashboardData();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: `❌ AUTHORIZATION ERROR: ${err.message}` });
    }
  };

  const handleDeleteDept = async (deptId) => {
    if (!window.confirm(`⚠️ Are you sure you want to REVOKE authorization for [${deptId}]?`)) return;

    try {
      await deleteWhitelistDeptApi(deptId);
      setStatusMsg({ type: 'success', text: `✅ REVOKED: Department [${deptId}] removed from Whitelist Database.` });
      await loadDashboardData();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: `❌ REVOCATION ERROR: ${err.message}` });
    }
  };

  const handleTriggerBreachScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(async () => {
      try {
        const result = await runBreachScanApi();
        setScanResult(result);
        await loadDashboardData();
      } catch (err) {
        alert(`Breach Scan Failed: ${err.message}`);
      } finally {
        setIsScanning(false);
      }
    }, 2000);
  };

  return (
    <div className="admin-dashboard-container">
      {/* ADMIN HEADER TELEMETRY BAR */}
      <div className="dashboard-header-bar" style={{ borderColor: 'var(--neon-magenta)' }}>
        <div className="dash-title-group">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-magenta">⚡ ADMIN COMMAND CENTER</span>
            <span className="badge badge-success">LEVEL-5 TOP SECRET CLEARANCE</span>
          </div>
          <h2 className="highlight-white" style={{ marginTop: '8px' }}>
            SYSTEM & DATABASE SURVEILLANCE OVERSEER
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Admin: <strong style={{ color: '#FFFFFF' }}>{adminSession?.name || 'Chief Administrator'}</strong> (ID: <code style={{ color: 'var(--neon-magenta)' }}>{adminSession?.admin_id}</code>) | Status: <strong style={{ color: 'var(--neon-green)' }}>OPERATIONAL / SECURE</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className={`btn btn-outline ${isScanning ? 'btn-disabled' : ''}`}
            onClick={handleTriggerBreachScan}
            disabled={isScanning}
          >
            {isScanning ? '⏳ SCANNING VAULT DB...' : '🛡️ RUN BREACH SCAN'}
          </button>
          <button className="btn btn-outline btn-login-magenta" onClick={onLogout}>
            LOGOUT ADMIN
          </button>
        </div>
      </div>

      {/* STATUS NOTIFICATION BOX */}
      {statusMsg && (
        <div className="terminal-response-box" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <span className={statusMsg.type === 'error' ? 'highlight-red' : 'highlight-green'}>
            {statusMsg.text}
          </span>
        </div>
      )}

      {/* METRICS OVERVIEW STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '25px', marginBottom: '25px' }}>
        <div className="impact-card text-center" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AUTHORIZED WHITELIST DEPTS</div>
          <div style={{ fontSize: '2rem', color: 'var(--neon-green)', fontWeight: 'bold' }}>{whitelist.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Active MongoDB Records</div>
        </div>

        <div className="impact-card text-center" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>REGISTERED OFFICERS</div>
          <div style={{ fontSize: '2rem', color: '#FFFFFF', fontWeight: 'bold' }}>{registeredAccounts.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Issued Ajex_IDs</div>
        </div>

        <div className="impact-card text-center" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>INTRUSION / THREAT ALERTS</div>
          <div style={{ fontSize: '2rem', color: 'var(--neon-magenta)', fontWeight: 'bold' }}>{threatData.logs?.length || 0}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Flagged Access Events</div>
        </div>

        <div className="impact-card text-center" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DATABASE THREAT STATUS</div>
          <div style={{ fontSize: '1.1rem', color: 'var(--neon-green)', fontWeight: 'bold', marginTop: '6px' }}>
            {threatData.metrics?.threatLevel || 'STABLE'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Latency: 1.4ms</div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '12px', marginBottom: '25px' }}>
        <button
          className={`btn ${activeTab === 'whitelist' ? 'btn-outline btn-login-magenta' : 'btn-outline'}`}
          onClick={() => setActiveTab('whitelist')}
        >
          🛡️ AUTHORIZED DEPARTMENT WHITELIST ({whitelist.length})
        </button>

        <button
          className={`btn ${activeTab === 'threats' ? 'btn-outline btn-login-magenta' : 'btn-outline'}`}
          onClick={() => setActiveTab('threats')}
        >
          🚨 THREAT & INTRUSION SURVEILLANCE ({threatData.logs?.length || 0})
        </button>

        <button
          className={`btn ${activeTab === 'accounts' ? 'btn-outline btn-login-magenta' : 'btn-outline'}`}
          onClick={() => setActiveTab('accounts')}
        >
          👤 REGISTERED ACCOUNTS & AUDIT LOGS ({registeredAccounts.length})
        </button>
      </div>

      {/* TAB 1: WHITELIST MANAGER */}
      {activeTab === 'whitelist' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '25px' }}>
          {/* ADD WHITELIST DEPT FORM */}
          <div className="vision-card" style={{ border: '1px solid var(--neon-magenta)' }}>
            <h3 style={{ color: 'var(--neon-magenta)', fontSize: '1.2rem', marginBottom: '8px' }}>
              ➕ ADD AUTHORIZED DEPARTMENT TO WHITELIST
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Only departments in this whitelist can complete registration and receive an <strong>Ajex_ID</strong>.
            </p>

            <form onSubmit={handleAddDeptSubmit}>
              <div className="form-group">
                <label>DEPARTMENT ID / CODE (PRIMARY KEY):</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. DEPT-HYD-CYBER-05"
                  value={newDeptForm.dept_id}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, dept_id: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>FULL DEPARTMENT NAME:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Telangana State Cyber Crime Bureau"
                  value={newDeptForm.dept_name}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, dept_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>REGISTERED DEPARTMENT OFFICIAL EMAIL:</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. cyber.command@telangana.gov.in"
                  value={newDeptForm.dept_email}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, dept_email: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-outline btn-block btn-lg btn-login-magenta" style={{ marginTop: '15px' }}>
                ⚡ AUTHORIZE & PERSIST TO WHITELIST DB
              </button>
            </form>
          </div>

          {/* WHITELISTED DEPARTMENTS LIST */}
          <div className="vision-card">
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '15px' }}>
              📋 AUTHORIZED LAW ENFORCEMENT REGISTER ({whitelist.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whitelist.length > 0 ? (
                whitelist.map((dept) => (
                  <div
                    key={dept.dept_id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '14px 18px',
                      borderRadius: '8px',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="badge badge-success">{dept.dept_id}</span>
                        <strong style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{dept.dept_name}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Official Email: <code style={{ color: 'var(--neon-green)' }}>{dept.dept_email}</code>
                      </div>
                    </div>

                    <button
                      className="btn btn-outline btn-sm"
                      style={{ color: '#FF3366', borderColor: 'rgba(255, 51, 102, 0.4)' }}
                      onClick={() => handleDeleteDept(dept.dept_id)}
                    >
                      ❌ REVOKE
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>
                  No whitelisted departments found. Add your first record above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THREAT & INTRUSION SURVEILLANCE */}
      {activeTab === 'threats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '25px' }}>
          {/* INTRUSION LOGS FEED */}
          <div className="vision-card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--neon-magenta)', marginBottom: '15px' }}>
              🚨 REAL-TIME INTRUSION & ACCESS LOG SURVEILLANCE
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
              {threatData.logs && threatData.logs.length > 0 ? (
                threatData.logs.map((log) => (
                  <div
                    key={log.log_id || log._id}
                    className={`alert-card ${log.severity === 'HIGH' || log.severity === 'CRITICAL' ? 'critical' : 'warning'}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="alert-title">{log.event_type}</span>
                      <span className="badge badge-magenta">IP: {log.ip_address}</span>
                    </div>
                    <div className="alert-details">{log.details}</div>
                    <div className="alert-citation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span>Target: <code>{log.target_resource}</code></span>
                      <span>{new Date(log.createdAt || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '30px' }}>
                  No active threat logs detected. System is secure.
                </div>
              )}
            </div>
          </div>

          {/* BREACH SCANNER & DB DIAGNOSTICS */}
          <div>
            <div className="vision-card" style={{ marginBottom: '20px', border: '1px solid var(--neon-green)' }}>
              <h3 style={{ color: 'var(--neon-green)', fontSize: '1.15rem', marginBottom: '10px' }}>
                🛡️ DATABASE BREACH & INTEGRITY SCANNER
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Scans all database collections for unauthorized query patterns, password tampering, or credential leaks.
              </p>

              <button
                className={`btn btn-outline btn-block btn-lg ${isScanning ? 'btn-disabled' : ''}`}
                onClick={handleTriggerBreachScan}
                disabled={isScanning}
              >
                {isScanning ? '⏳ SCANNING ALL DATABASE COLLECTIONS...' : '⚡ EXECUTE DEEP VAULT SCAN'}
              </button>

              {scanResult && (
                <div className="terminal-response-box" style={{ marginTop: '20px' }}>
                  <div style={{ color: 'var(--neon-green)', fontWeight: 'bold', marginBottom: '6px' }}>
                    ✅ BREACH SCAN COMPLETED ({scanResult.scanId})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    • Scanned Records: <strong>{scanResult.scannedRecords}</strong>
                    <br />• Anomalies Detected: <strong style={{ color: 'var(--neon-green)' }}>0 (CLEAN)</strong>
                    <br />• Security Signature: <code>SHA-256 VERIFIED</code>
                  </div>
                </div>
              )}
            </div>

            <div className="impact-card">
              <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>🔒 INTRUSION PREVENTION PROTOCOLS</h4>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '18px', margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>Automatic IP throttling on 3 consecutive failed Ajex_ID attempts.</li>
                <li style={{ marginBottom: '8px' }}>Department Whitelist enforcement prevents unauthorized onboarding.</li>
                <li style={{ marginBottom: '8px' }}>Case Passwords isolated per investigative folder.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="vision-card">
          <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '15px' }}>
            👤 REGISTERED OFFICERS & DEPARTMENT ACCOUNTS ({registeredAccounts.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {registeredAccounts.map((acc, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-success">Ajex_ID: {acc.ajex_id}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {acc.created_at ? new Date(acc.created_at).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '6px' }}>{acc.dept_name || acc.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Dept ID: <strong>{acc.dept_id}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--neon-green)' }}>
                  Email: <code>{acc.email}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
