import React, { useState, useEffect } from 'react';
import CaseDetailView from './CaseDetailView';
import { getCases, createNewCase } from '../data/db';
import { fetchAllCasesApi, createCaseApi } from '../services/api';

const OfficerDashboard = ({ session, onLogout }) => {
  const [allCases, setAllCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [passwordGateCase, setPasswordGateCase] = useState(null);

  // Form states
  const [newCaseForm, setNewCaseForm] = useState({
    case_id: `CASE-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '',
    case_password: '',
    description: '',
    status: 'ACTIVE INVESTIGATION'
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState(null);

  // Cross agency search states
  const [searchCaseId, setSearchCaseId] = useState('');
  const [searchCasePassword, setSearchCasePassword] = useState('');
  const [searchResultCase, setSearchResultCase] = useState(null);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const apiCases = await fetchAllCasesApi();
      if (apiCases && apiCases.length > 0) {
        setAllCases(apiCases);
      } else {
        setAllCases(getCases());
      }
    } catch (err) {
      setAllCases(getCases());
    }
  };

  const deptCases = allCases.filter(c => c.owner_dept_id === session?.dept_id || c.owner_ajex_id === session?.ajex_id);
  const otherCasesCount = allCases.length - deptCases.length;

  const handleOpenCase = (c) => {
    setPasswordGateCase(c);
    setPasswordInput('');
    setPassError(null);
  };

  const handleUnlockCasePassword = (e) => {
    e.preventDefault();
    // Use stored case_password; fall back to 'case123' for seed/legacy cases with no password set
    const correctPassword = passwordGateCase.case_password || 'case123';
    if (passwordInput === correctPassword) {
      setActiveCase(passwordGateCase);
      setPasswordGateCase(null);
      setPasswordInput('');
      setPassError(null);
    } else {
      setPassError('❌ INVALID CASE PASSWORD: Access Denied to Case Intelligence.');
    }
  };

  const handleCreateCaseSubmit = async (e) => {
    e.preventDefault();
    
    const casePayload = {
      ...newCaseForm,
      owner_dept_id: session?.dept_id || 'DEPT-DEL-NORTH-04',
      owner_dept_name: session?.dept_name || 'Metro Cyber Crime Branch',
      owner_ajex_id: session?.ajex_id
    };

    try {
      const created = await createCaseApi(casePayload);
      setActiveCase(created);
    } catch (err) {
      const localCreated = createNewCase(casePayload);
      setActiveCase(localCreated);
    }

    await loadCases();
    setShowCreateModal(false);
    setNewCaseForm({
      case_id: `CASE-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      title: '',
      case_password: '',
      description: '',
      status: 'ACTIVE INVESTIGATION'
    });
  };

  const handleSearchCrossAgency = (e) => {
    e.preventDefault();
    setSearchError(null);
    setSearchResultCase(null);

    const targetId = searchCaseId.trim().toUpperCase();
    const found = allCases.find(c => c.case_id.toUpperCase() === targetId);

    if (!found) {
      setSearchError(`❌ CASE NOT FOUND: No case registered with ID [${targetId}].`);
      return;
    }

    const correctCasePassword = found.case_password || 'case123';
    if (searchCasePassword !== correctCasePassword) {
      setSearchError(`❌ SECURITY ACCESS DENIED: Incorrect password for Case [${targetId}].`);
      return;
    }

    // Unlocked cross agency case!
    setSearchResultCase(found);
  };

  const handleUnlockSearchResult = () => {
    setActiveCase(searchResultCase);
    setShowSearchModal(false);
    setSearchResultCase(null);
    setSearchCaseId('');
    setSearchCasePassword('');
  };

  // If officer is currently viewing a specific case detail
  if (activeCase) {
    return (
      <CaseDetailView
        currentCase={activeCase}
        onUpdateCase={(updated) => {
          setActiveCase(updated);
          loadCases();
        }}
        onBackToCases={() => setActiveCase(null)}
        session={session}
      />
    );
  }

  return (
    <div className="officer-dashboard-main">
      {/* DASHBOARD HEADER */}
      <div className="dashboard-header-bar">
        <div className="dash-title-group">
          <span className="badge badge-success">VAULT VERIFIED SESSION</span>
          <h2 className="highlight-white" style={{ marginTop: '8px' }}>OFFICER INVESTIGATIVE DASHBOARD</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Department: <strong style={{ color: '#FFFFFF' }}>{session?.dept_name || session?.name || 'Metro Cyber Crime Branch'}</strong> | Ajex_ID: <code style={{ color: 'var(--neon-green)' }}>{session?.ajex_id}</code>
          </p>
        </div>
        <div className="dash-jwt-info" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => setShowSearchModal(true)}>
            🔍 CROSS-AGENCY CASE SEARCH
          </button>
          <button className="btn btn-outline btn-login-magenta" onClick={onLogout}>
            LOGOUT
          </button>
        </div>
      </div>

      {/* DASHBOARD ACTIONS & METRICS BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <div>
          <h3 className="section-title" style={{ fontSize: '1.4rem' }}>
            ONGOING DEPARTMENT INVESTIGATIONS ({deptCases.length})
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Select any case and enter its Case Password to access evidence reasoning and link topology.
          </p>
        </div>

        <button className="btn btn-outline btn-lg" onClick={() => setShowCreateModal(true)}>
          ➕ CREATE NEW INVESTIGATIVE CASE
        </button>
      </div>

      {/* CASES GRID LIST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
        {deptCases.length > 0 ? (
          deptCases.map((c) => (
            <div key={c.case_id} className="impact-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-success">{c.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neon-green)', fontWeight: 'bold' }}>
                    ID: {c.case_id}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '10px' }}>{c.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                  {c.description || 'Active multi-hypothesis investigative case file.'}
                </p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '15px' }}>
                  <span>📑 Evidence: <strong>{c.evidence_items?.length || 0}</strong></span>
                  <span>⚡ Conflicts: <strong style={{ color: 'var(--neon-yellow)' }}>{c.contradictions?.length || 0}</strong></span>
                  <span>🎯 Predictions: <strong>{c.hypotheses?.length || 0}</strong></span>
                </div>
              </div>

              <button className="btn btn-outline btn-block" onClick={() => handleOpenCase(c)}>
                🔒 UNLOCK CASE (ENTER PASSWORD)
              </button>
            </div>
          ))
        ) : (
          <div className="impact-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <h3>NO ACTIVE CASES CREATED YET FOR YOUR DEPARTMENT</h3>
            <p>Click "CREATE NEW INVESTIGATIVE CASE" above to register your first case file.</p>
          </div>
        )}
      </div>

      {/* CROSS-AGENCY SUMMARY BAR */}
      <div className="vision-quote-box" style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ color: 'var(--neon-yellow)', marginBottom: '4px' }}>🌐 INTER-AGENCY INTELLIGENCE EXCHANGE:</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            There are <strong>{otherCasesCount} external cases</strong> registered by other law enforcement departments in the sovereign vault.
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => setShowCreateModal(true)}>
          ➕ INITIALIZE CASE
        </button>
      </div>

      {/* CASE PASSWORD CHALLENGE MODAL */}
      {passwordGateCase && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="page-auth-box" style={{ width: '90%', maxWidth: '480px' }}>
            <div className="auth-box-header text-center">
              <div className="terminal-tag">🔒 CASE SECURITY CHALLENGE</div>
              <h3 style={{ marginTop: '8px', color: '#FFFFFF' }}>ENTER CASE ACCESS PASSWORD</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target Case: <strong>{passwordGateCase.title}</strong> (ID: {passwordGateCase.case_id})
              </p>
            </div>
            <div className="auth-box-body">
              <form onSubmit={handleUnlockCasePassword}>
                <div className="form-group">
                  <label>CASE PASSWORD:</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                    required
                  />
                  <div className="form-help-text">Demo password for seed cases: <span className="highlight-yellow">case123</span></div>
                </div>

                {passError && (
                  <div className="terminal-response-box" style={{ marginBottom: '15px' }}>
                    <span className="highlight-red">{passError}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setPasswordGateCase(null)} style={{ flex: 1 }}>
                    CANCEL
                  </button>
                  <button type="submit" className="btn btn-outline btn-login-magenta" style={{ flex: 1 }}>
                    🔓 UNLOCK CASE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW CASE MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="page-auth-box" style={{ width: '90%', maxWidth: '600px' }}>
            <div className="auth-box-header text-center">
              <div className="terminal-tag">➕ VAULT CASE PROVISIONING</div>
              <h3 style={{ marginTop: '8px', color: '#FFFFFF' }}>CREATE NEW INVESTIGATIVE CASE</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Provision a new encrypted case ID and access password for your department.
              </p>
            </div>

            <div className="auth-box-body">
              <form onSubmit={handleCreateCaseSubmit}>
                <div className="form-group">
                  <label>UNIQUE CASE ID (PRIMARY KEY):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCaseForm.case_id}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, case_id: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CASE TITLE / HEADING:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sector 4 Cyber Robbery & Extortion"
                    value={newCaseForm.title}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CASE ACCESS PASSWORD (SET SECURITY CODE):</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Set secret case password..."
                    minLength={4}
                    value={newCaseForm.case_password}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, case_password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>INITIAL CASE DESCRIPTION / SUMMARY:</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Describe prime suspects, incident venue, or initial evidence brief..."
                    value={newCaseForm.description}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                    CANCEL
                  </button>
                  <button type="submit" className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                    ⚡ PROVISION CASE FILE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CROSS-DEPARTMENT SEARCH MODAL */}
      {showSearchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="page-auth-box" style={{ width: '90%', maxWidth: '560px' }}>
            <div className="auth-box-header text-center">
              <div className="terminal-tag">🌐 INTER-AGENCY INTELLIGENCE SEARCH</div>
              <h3 style={{ marginTop: '8px', color: '#FFFFFF' }}>SEARCH CROSS-DEPARTMENT CASE</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Access cases owned by other law enforcement departments by entering Case ID + Password.
              </p>
            </div>

            <div className="auth-box-body">
              {!searchResultCase ? (
                <form onSubmit={handleSearchCrossAgency}>
                  <div className="form-group">
                    <label>TARGET CASE ID:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CASE-2026-ND-4021"
                      value={searchCaseId}
                      onChange={(e) => setSearchCaseId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CASE ACCESS PASSWORD:</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••••••"
                      value={searchCasePassword}
                      onChange={(e) => setSearchCasePassword(e.target.value)}
                      required
                    />
                    <div className="form-help-text">Sample external Case ID: <code style={{ color: 'var(--neon-green)' }}>CASE-2026-ND-4021</code> | Password: <code style={{ color: 'var(--neon-yellow)' }}>case123</code></div>
                  </div>

                  {searchError && (
                    <div className="terminal-response-box" style={{ marginBottom: '15px' }}>
                      <span className="highlight-red">{searchError}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowSearchModal(false)} style={{ flex: 1 }}>
                      CANCEL
                    </button>
                    <button type="submit" className="btn btn-outline btn-login-magenta" style={{ flex: 1 }}>
                      🔍 AUTHENTICATE & SEARCH
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="ajex-card" style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <span className="badge badge-success" style={{ marginBottom: '8px' }}>AUTHENTICATED CROSS-AGENCY MATCH</span>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '6px' }}>{searchResultCase.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{searchResultCase.description}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neon-green)' }}>
                      Owned by: <strong>{searchResultCase.owner_dept_name}</strong> ({searchResultCase.owner_dept_id})
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={() => setSearchResultCase(null)} style={{ flex: 1 }}>
                      ← SEARCH ANOTHER
                    </button>
                    <button className="btn btn-outline btn-lg btn-login-magenta" onClick={handleUnlockSearchResult} style={{ flex: 1 }}>
                      🔓 OPEN CASE INTELLIGENCE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard;
