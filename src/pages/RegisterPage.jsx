import React, { useState } from 'react';
import { validateRegistrationWhitelist, registerAccountApi } from '../services/api';
import { saveRegisteredAccount } from '../data/db';

const RegisterPage = ({ onRegisterSuccess, setActivePage, onSelectRole }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    deptName: '',
    deptId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [issuedAjexId, setIssuedAjexId] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setStatusMsg({ type: 'error', text: '❌ PASSWORD MISMATCH: Password and Confirm Password must be identical.' });
      return;
    }

    setStatusMsg({ type: 'info', text: '📡 Querying Classified Whitelist Registry...' });

    // Validate against Admin Whitelist in MongoDB Backend API
    const isMatched = await validateRegistrationWhitelist(formData.deptName, formData.deptId, formData.email);

    if (!isMatched) {
      setStatusMsg({
        type: 'error',
        text: `❌ AUTHORIZATION DENIED: Department [${formData.deptId || 'ID'}] with Email [${formData.email}] not found in Admin Whitelist. Only pre-authorized departments can onboard.`
      });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEnteredOtp(otp); // Autofill simulated OTP
    setStatusMsg({ type: 'info', text: `📩 Department Verified! Sending 6-Digit Email OTP to ${formData.email}...` });

    setTimeout(() => {
      setStatusMsg(null);
      setStep(2);
    }, 1000);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      setStatusMsg({ type: 'error', text: '❌ INVALID OTP CODE: Please check the code sent to your email.' });
      return;
    }

    setStatusMsg({ type: 'info', text: '⚡ Provisioning Ajex_ID in Encrypted Vault...' });

    try {
      const newDept = await registerAccountApi({
        dept_name: formData.deptName,
        dept_id: formData.deptId.trim().toUpperCase(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      saveRegisteredAccount(newDept);
      onRegisterSuccess(newDept);
      setIssuedAjexId(newDept.ajex_id);
      setStatusMsg(null);
      setStep(3);
    } catch (err) {
      setStatusMsg({ type: 'error', text: `❌ REGISTRATION ERROR: ${err.message}` });
    }
  };

  return (
    <main className="section-padding">
      <div className="container">
        <div className="page-auth-box">
          {/* ROLE SELECTOR TOP BANNER */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm btn-login-magenta"
              style={{ flex: 1 }}
            >
              🏢 DEPARTMENT ONBOARDING
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              onClick={() => onSelectRole && onSelectRole('admin')}
            >
              🛡️ ADMIN PROVISIONING
            </button>
          </div>

          <div className="auth-box-header text-center">
            <div className="terminal-tag"><span className="tag-icon">🔒</span> VAULT ONBOARDING PORTAL</div>
            <h2>DEPARTMENT REGISTRATION</h2>
            <p className="motto-subtext">"JUSTICE DELAYED IS JUSTICE DENIED!"</p>
            <p>Enter pre-authorized department details to receive your unique <strong>Ajex_ID</strong></p>
          </div>

          <div className="auth-box-body">
            {step === 1 && (
              <form onSubmit={handleStep1Submit}>
                
                <div style={{ background: 'rgba(42, 224, 106, 0.08)', border: '1px solid rgba(42, 224, 106, 0.3)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.8rem' }}>
                  <div style={{ color: 'var(--neon-green)', fontWeight: 'bold', marginBottom: '4px' }}>🛡️ ADMIN WHITELIST DATABASE ACTIVE:</div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    Registration validates inputs against pre-authorized Admin Dept IDs.
                    <br /><em>Sample authorized records:</em> <code>DEPT-DEL-NORTH-04</code> | <code>DEPT-MUM-CRIME-01</code> | <code>DEPT-ATS-BANG-09</code>
                  </div>
                </div>

                <div className="form-group">
                  <label>DEPARTMENT NAME:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Metro Cyber Crime Branch"
                    value={formData.deptName}
                    onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>DEPARTMENT ID / CODE (PRIMARY KEY):</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. DEPT-DEL-NORTH-04"
                    value={formData.deptId}
                    onChange={(e) => setFormData({ ...formData, deptId: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>REGISTERED DEPARTMENT EMAIL:</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="admin@police.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PASSWORD:</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CONFIRM PASSWORD:</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-outline btn-block btn-lg" style={{ marginTop: '20px' }}>
                  📩 VERIFY ADMIN DATABASE & SEND OTP
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpVerify}>
                <div className="form-header text-center">
                  <h3>EMAIL OTP VERIFICATION</h3>
                  <p>Enter the 6-digit verification code sent to <strong className="highlight-green">{formData.email}</strong></p>
                </div>

                <div className="form-group">
                  <label>ENTER 6-DIGIT EMAIL OTP:</label>
                  <input
                    type="text"
                    className="form-input text-center font-lg"
                    placeholder="123456"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    required
                  />
                  <div className="form-help-text">Simulated Email OTP code: <span className="highlight-yellow">{generatedOtp}</span></div>
                </div>

                <button type="submit" className="btn btn-outline btn-block btn-lg">
                  ⚡ VERIFY OTP & PROVISION Ajex_ID
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="form-header">
                  <div className="success-icon" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎉</div>
                  <h3>DEPARTMENT REGISTRATION SUCCESSFUL</h3>
                  <p>Your unique Department ID has been encrypted and issued via Vault Backend</p>
                </div>

                <div className="ajex-card">
                  <div className="ajex-label">YOUR UNIQUE DEPARTMENT ID (Ajex_ID):</div>
                  <div className="ajex-value">{issuedAjexId}</div>
                  <div className="ajex-subtext">IMPORTANT: SAVE THIS ID! You will log in using your <strong>Ajex_ID</strong> + Password.</div>
                </div>

                <button
                  onClick={() => setActivePage('login')}
                  className="btn btn-outline btn-block btn-lg btn-login-magenta"
                  style={{ marginTop: '25px' }}
                >
                  🔓 PROCEED TO LOGIN WITH Ajex_ID
                </button>
              </div>
            )}

            {statusMsg && (
              <div className="terminal-response-box" style={{ marginTop: '15px' }}>
                <span className={statusMsg.type === 'error' ? 'highlight-red' : 'highlight-green'}>
                  {statusMsg.text}
                </span>
              </div>
            )}

            <div className="auth-footer-link text-center" style={{ marginTop: '25px' }}>
              <span>Already registered your department? </span>
              <a onClick={() => setActivePage('login')} className="highlight-magenta" style={{ cursor: 'pointer' }}>
                Click here to Login with Ajex_ID
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
