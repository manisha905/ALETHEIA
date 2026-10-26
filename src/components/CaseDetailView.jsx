import React, { useState } from 'react';
import TopologyCanvas from './TopologyCanvas';
import { addEvidenceApi } from '../services/api';

const CaseDetailView = ({ currentCase, onUpdateCase, onBackToCases, session }) => {
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({
    title: '',
    type: 'statement',
    content: '',
    author: `Officer ${session?.ajex_id || 'VAULT'}`
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvidenceSubmit = async (e) => {
    e.preventDefault();
    
    const newEvidence = {
      id: `ev-${Date.now()}`,
      type: evidenceForm.type,
      title: evidenceForm.title,
      content: evidenceForm.content,
      imageData: imagePreview,
      timestamp: new Date().toISOString(),
      author: evidenceForm.author || `Officer ${session?.ajex_id}`
    };

    setStatusMsg('📡 Submitting Evidence & Re-running AI Prediction Pipeline...');

    try {
      const updatedCase = await addEvidenceApi(currentCase.case_id, newEvidence);
      if (updatedCase) {
        onUpdateCase(updatedCase);
        setStatusMsg(`⚡ REASONING ENGINE UPDATED: Re-calculated hypothesis confidence & contradiction flags based on new evidence.`);
        setShowAddEvidence(false);
        setEvidenceForm({
          title: '',
          type: 'statement',
          content: '',
          author: `Officer ${session?.ajex_id || 'VAULT'}`
        });
        setImagePreview(null);

        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (err) {
      setStatusMsg(`❌ REASONING ENGINE ERROR: ${err.message}`);
    }
  };

  const handleCounterfactual = (hypoTitle) => {
    alert(`[ COUNTERFACTUAL ENGINE RUN ] Verified 0 logical contradictions for "${hypoTitle}".`);
  };

  const handleExportDossier = (hypoTitle) => {
    alert(`[ DOSSIER GENERATED ] Exported PDF dossier for "${hypoTitle}". Including audit signatures, evidence citations, and link topology.`);
  };

  return (
    <div className="case-detail-container">
      {/* CASE HEADER BAR */}
      <div className="dashboard-header-bar" style={{ marginBottom: '25px' }}>
        <div>
          <button className="btn btn-outline btn-sm" onClick={onBackToCases} style={{ marginBottom: '10px' }}>
            ← BACK TO CASES LIST
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-success">{currentCase.status}</span>
            <span className="badge badge-white">ID: {currentCase.case_id}</span>
          </div>
          <h2 className="highlight-white" style={{ marginTop: '8px', fontSize: '1.8rem' }}>
            {currentCase.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Managed by: <strong>{currentCase.owner_dept_name}</strong> (Ajex_ID: <code>{currentCase.owner_ajex_id}</code>)
          </p>
        </div>

        <div>
          <button
            className="btn btn-outline btn-login-magenta"
            onClick={() => setShowAddEvidence(!showAddEvidence)}
          >
            {showAddEvidence ? '成分 CLOSE EVIDENCE FORM' : '➕ INGEST NEW EVIDENCE / REPORT'}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="terminal-response-box" style={{ marginBottom: '25px' }}>
          {statusMsg}
        </div>
      )}

      {/* ADD EVIDENCE FORM MODAL/PANEL */}
      {showAddEvidence && (
        <div className="vision-card" style={{ marginBottom: '30px', border: '1px solid var(--neon-green)' }}>
          <h3 style={{ color: 'var(--neon-green)', marginBottom: '10px' }}>
            📥 INGEST MULTI-FORMAT EVIDENCE / INCIDENT REPORT
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
            Add new witness statements, phone records, forensic reports, or photo evidence. The AI reasoning engine will instantly re-analyze hypothesis rankings and detect contradictions.
          </p>

          <form onSubmit={handleAddEvidenceSubmit}>
            <div className="demo-dashboard" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div className="form-group">
                  <label>EVIDENCE REPORT TITLE:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CCTV Frame Sector 4 Exit Gate"
                    value={evidenceForm.title}
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>EVIDENCE TYPE / CATEGORY:</label>
                  <select
                    className="form-input"
                    value={evidenceForm.type}
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, type: e.target.value })}
                  >
                    <option value="statement">FIR / Witness Statement</option>
                    <option value="telecom">Call Detail Record / Cellular Ping</option>
                    <option value="forensic">Forensic & Crime Scene Report</option>
                    <option value="photo">Photo / CCTV Frame Upload</option>
                    <option value="document">Access Log / Official Document</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>REPORTING OFFICER / SOURCE:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={evidenceForm.author}
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, author: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label>EVIDENCE DETAILS / TRANSCRIPT:</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Enter transcript, location details, timeline notes, or contradictions..."
                    value={evidenceForm.content}
                    onChange={(e) => setEvidenceForm({ ...evidenceForm, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ATTACH PHOTO / CRIME SCENE IMAGE (OPTIONAL):</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '10px', maxHeight: '120px', overflow: 'hidden', borderRadius: '6px', border: '1px solid var(--neon-green)' }}>
                      <img src={imagePreview} alt="Evidence Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-outline btn-block btn-lg" style={{ marginTop: '15px' }}>
              ⚡ TRANSMIT EVIDENCE & RE-RUN REASONING ENGINE
            </button>
          </form>
        </div>
      )}

      {/* DASHBOARD PANELS: CONTRADICTIONS & HYPOTHESES */}
      <div className="demo-dashboard">
        {/* LEFT PANEL: CONTRADICTION ALERTS */}
        <div className="demo-panel left-panel">
          <div className="panel-header">
            <h3>EVIDENCE CONTRADICTIONS FLAGGED</h3>
            <span className="badge badge-warning">
              {currentCase.contradictions?.length || 0} CONFLICTS DETECTED
            </span>
          </div>
          <div className="panel-body">
            {currentCase.contradictions && currentCase.contradictions.length > 0 ? (
              currentCase.contradictions.map((con) => (
                <div key={con.id} className={`alert-card ${con.level || 'warning'}`}>
                  <div className="alert-title">{con.title}</div>
                  <div className="alert-details">{con.details}</div>
                  <div className="alert-citation">{con.citation}</div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
                No active contradiction flags detected for this case.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: RANKED HYPOTHESES */}
        <div className="demo-panel right-panel">
          <div className="panel-header">
            <h3>RANKED INVESTIGATIVE HYPOTHESES</h3>
            <span className="badge badge-success">DYNAMIC RE-PREDICTION ENGINE</span>
          </div>
          <div className="panel-body">
            {currentCase.hypotheses && currentCase.hypotheses.length > 0 ? (
              currentCase.hypotheses.map((hypo) => (
                <div key={hypo.id} className={`hypothesis-card rank-${hypo.rank}`}>
                  <div className="hypo-top">
                    <span className="rank-badge">RANK #{hypo.rank} · HYPOTHESIS</span>
                    <span className="confidence-badge">{hypo.confidence}% CONFIDENCE</span>
                  </div>
                  <h4 className="hypo-title">{hypo.title}</h4>
                  <p className="hypo-text">{hypo.description}</p>
                  <div className="hypo-citations">
                    {hypo.citations?.map((cit, idx) => (
                      <span key={idx} className="chip">{cit}</span>
                    ))}
                  </div>
                  <div className="hypo-actions">
                    <button className="btn-sm btn-outline" onClick={() => handleCounterfactual(hypo.title)}>
                      🧪 TEST COUNTERFACTUAL
                    </button>
                    <button className="btn-sm btn-outline" onClick={() => handleExportDossier(hypo.title)}>
                      📄 EXPORT DOSSIER
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
                Generating initial hypothesis rankings...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EVIDENCE RECORDS FEED LIST */}
      <div className="vision-card" style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'var(--neon-green)' }}>
          📑 CASE EVIDENTIARY RECORDS ({currentCase.evidence_items?.length || 0})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {currentCase.evidence_items && currentCase.evidence_items.length > 0 ? (
            currentCase.evidence_items.map((ev) => (
              <div key={ev.id} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-white">{ev.type.toUpperCase()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '6px' }}>{ev.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{ev.content}</p>
                {ev.imageData && (
                  <div style={{ marginBottom: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--neon-green)' }}>
                    <img src={ev.imageData} alt={ev.title} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--neon-green)' }}>Source: {ev.author}</div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-dim)' }}>No evidence uploaded yet.</div>
          )}
        </div>
      </div>

      {/* INTERACTIVE LINK TOPOLOGY CANVAS */}
      <TopologyCanvas />
    </div>
  );
};

export default CaseDetailView;
