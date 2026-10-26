import React, { useState } from 'react';
import { loginAccountApi, requestForgotOtpApi, resetPasswordApi } from '../services/api';

const LoginPage = ({ session, onLoginSuccess, onLogout, setActivePage, onPasswordReset, onSelectRole }) => {
  const [loginForm, setLoginForm] = useState({
    ajexId: '',
    password: ''
  });
  const [forgotView, setForgotView] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotForm, setForgotForm] = useState({
    deptEmail: '',
    otpInput: '',
    newPass: ''
  });
  const [targetAccount, setTargetAccount] = useState(null);
  const [simulatedForgotOtp, setSimulatedForgotOtp] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: 'info', text: '⚡ VERIFYING AUTHORIZED DEPARTMENT CREDENTIALS...' });

    try {
      const authenticatedAccount = await loginAccountApi(loginForm.ajexId, loginForm.password);
      setStatusMsg({ type: 'success', text: '✅ AUTHENTICATION SUCCESSFUL. Unlocking Officer Case Dashboard...' });
      
      setTimeout(() => {
        onLoginSuccess(authenticatedAccount);
        setStatusMsg(null);
      }, 600);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `❌ AUTHENTICATION FAILED: ${err.message}`
      });
    }
  };

  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    const inputEmail = forgotForm.deptEmail.trim().toLowerCase();
    setStatusMsg({ type: 'info', text: '📡 Querying Encrypted Registry for Department Email...' });

    try {
      const data = await requestForgotOtpApi(inputEmail);
      setTargetAccount(data.account);
      setSimulatedForgotOtp(data.otp);
      setForgotForm((prev) => ({ ...prev, otpInput: data.otp }));
      setStatusMsg({ type: 'info', text: `📩 Verification OTP sent to registered Department Email: ${data.account.email}...` });

      setTimeout(() => {
        setStatusMsg(null);
        setForgotStep(2);
      }, 1000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: `❌ CLASSIFIED ACCOUNT ERROR: ${err.message}` });
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    if (forgotForm.otpInput !== simulatedForgotOtp) {
      setStatusMsg({ type: 'error', text: '❌ INVALID RESET OTP: Please check the code sent to your email.' });
      return;
    }

    if (targetAccount) {
      try {
        await resetPasswordApi(targetAccount.ajex_id, forgotForm.newPass);
        onPasswordReset(targetAccount.ajex_id, forgotForm.newPass);
        setStatusMsg({ type: 'success', text: `✅ PASSWORD UPDATED SUCCESSFULLY for Department Email [${targetAccount.email}]. Returning to login...` });

        setTimeout(() => {
          setForgotView(false);
          setForgotStep(1);
          setLoginForm({
            ajexId: targetAccount.ajex_id,
            password: ''
          });
          setTargetAccount(null);
          setStatusMsg(null);
        }, 1500);
      } catch (err) {
        setStatusMsg({ type: 'error', text: `❌ VAULT UPDATE ERROR: ${err.message}` });
      }
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
              🏢 DEPARTMENT OFFICER LOGIN
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              onClick={() => onSelectRole && onSelectRole('admin')}
            >
              🛡️ ADMIN COMMAND LOGIN
            </button>
          </div>

          <div className="auth-box-header text-center">
            <div className="terminal-tag"><span className="tag-icon">🔒</span> CLASSIFIED ACCESS PORTAL</div>
            <h2>DEPARTMENT LOGIN</h2>
            <p className="motto-subtext">"JUSTICE DELAYED IS JUSTICE DENIED!"</p>
            <p>Enter your <strong>Ajex_ID</strong> and Password to unlock case intelligence</p>
          </div>

          <div className="auth-box-body">
            {!forgotView ? (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ background: 'rgba(255, 0, 128, 0.08)', border: '1px solid rgba(255, 0, 128, 0.3)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.78rem', color: '#FFFFFF' }}>
                  <span style={{ color: 'var(--neon-magenta)', fontWeight: 'bold' }}>💡 DEMO AUTHORIZED ACCOUNTS:</span>
                  <br />Ajex_ID: <code style={{ color: 'var(--neon-yellow)' }}>AJEX-9842-DEL</code> | Password: <code style={{ color: 'var(--neon-yellow)' }}>password123</code>
                </div>

                <div className="form-group">
                  <label>UNIQUE DEPARTMENT ID (Ajex_ID):</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. AJEX-9842-DEL"
                    value={loginForm.ajexId}
                    onChange={(e) => setLoginForm({ ...loginForm, ajexId: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PASSWORD:</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-flex-row">
                  <span onClick={() => { setForgotView(true); setStatusMsg(null); }} className="forgot-link highlight-magenta" style={{ cursor: 'pointer' }}>
                    Forgot Password?
                  </span>
                </div>

                <button type="submit" className="btn btn-outline btn-block btn-lg btn-login-magenta" style={{ marginTop: '20px' }}>
                  🔓 AUTHENTICATE & UNLOCK VAULT
                </button>
              </form>
            ) : (
              <div>
                <div className="form-header text-center">
                  <h3>FORGOT PASSWORD RECOVERY</h3>
                  <p>Recover account using registered Department Email ONLY</p>
                </div>

                {forgotStep === 1 && (
                  <form onSubmit={handleForgotStep1}>
                    <div className="form-group">
                      <label>REGISTERED DEPARTMENT EMAIL:</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. admin@police.gov.in"
                        value={forgotForm.deptEmail}
                        onChange={(e) => setForgotForm({ ...forgotForm, deptEmail: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-outline btn-block btn-lg btn-login-magenta">
                      📩 SEND RESET OTP TO DEPARTMENT EMAIL
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleForgotStep2}>
                    <div className="form-group">
                      <label>6-DIGIT RESET OTP:</label>
                      <input
                        type="text"
                        className="form-input text-center font-lg"
                        placeholder="654321"
                        maxLength={6}
                        value={forgotForm.otpInput}
                        onChange={(e) => setForgotForm({ ...forgotForm, otpInput: e.target.value })}
                        required
                      />
                      <div className="form-help-text">
                        Simulated OTP code sent to {targetAccount?.email}: <span className="highlight-yellow">{simulatedForgotOtp}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>NEW PASSWORD:</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••••••"
                        minLength={6}
                        value={forgotForm.newPass}
                        onChange={(e) => setForgotForm({ ...forgotForm, newPass: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-outline btn-block btn-lg btn-login-magenta">
                      🔐 RESET PASSWORD & UPDATE VAULT
                    </button>
                  </form>
                )}

                <button className="btn btn-outline btn-block" onClick={() => { setForgotView(false); setForgotStep(1); }} style={{ marginTop: '15px' }}>
                  ← Back to Login
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
              <span>New Department? </span>
              <a onClick={() => setActivePage('register')} className="highlight-green" style={{ cursor: 'pointer' }}>
                Register your Department to get an Ajex_ID
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
