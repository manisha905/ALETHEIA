import React, { useState, useEffect } from 'react';
import MatrixRainCanvas from './components/MatrixRainCanvas';
import LedMarquee from './components/LedMarquee';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import OfficerDashboard from './components/OfficerDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getRegisteredAccounts, saveRegisteredAccount, updateAccountPassword } from './data/db';
import './styles/glass.css';

const STORAGE_KEY_SESSION = "ALETHEIA_ACTIVE_SESSION";
const STORAGE_KEY_ADMIN_SESSION = "ALETHEIA_ADMIN_SESSION";

const getInitialPage = () => {
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  if (path.includes('login') || search.includes('login')) return 'login';
  if (path.includes('register') || search.includes('register')) return 'register';
  return 'home';
};

const App = () => {
  const [activePage, setActivePage] = useState(getInitialPage); // 'home', 'register', 'login'
  const [selectedRole, setSelectedRole] = useState('dept'); // 'dept' or 'admin'
  const [session, setSession] = useState(null);
  const [adminSession, setAdminSession] = useState(null);
  const [registeredDepts, setRegisteredDepts] = useState([]);

  useEffect(() => {
    const accounts = getRegisteredAccounts();
    setRegisteredDepts(accounts);

    const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    }

    const storedAdmin = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    if (storedAdmin) {
      try {
        setAdminSession(JSON.parse(storedAdmin));
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
      }
    }
  }, []);

  const handleRegisterSuccess = (newDept) => {
    const updated = saveRegisteredAccount(newDept);
    setRegisteredDepts(updated);
  };

  const handleLoginSuccess = (deptObj) => {
    const sessionObj = {
      ajex_id: deptObj.ajex_id,
      dept_id: deptObj.dept_id,
      email: deptObj.email,
      dept_name: deptObj.dept_name || deptObj.name,
      login_time: new Date().toISOString()
    };
    setSession(sessionObj);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionObj));
    setActivePage('dashboard');
  };

  const handleAdminLoginSuccess = (adminObj) => {
    const adminSessionObj = {
      admin_id: adminObj.admin_id || 'ADMIN-SYS-01',
      name: adminObj.name || 'Chief Systems Administrator',
      email: adminObj.email,
      login_time: new Date().toISOString()
    };
    setAdminSession(adminSessionObj);
    localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(adminSessionObj));
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setSession(null);
    setActivePage('home');
    alert("[ LOGOUT SUCCESSFUL ] Officer session terminated. Returning to Home Page.");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
    setAdminSession(null);
    setActivePage('home');
    alert("[ LOGOUT SUCCESSFUL ] Admin Command session terminated.");
  };

  const handlePasswordReset = (ajexId, newPassword) => {
    const updated = updateAccountPassword(ajexId, newPassword);
    setRegisteredDepts(updated);
  };

  const getBadgeInfo = () => {
    if (adminSession) return { text: "ADMIN COMMAND OVERSEER", style: "badge-magenta" };
    if (session) return { text: "OFFICER DASHBOARD", style: "" };
    if (activePage === 'register') return { text: selectedRole === 'admin' ? "ADMIN PROVISIONING" : "REGISTER DEPARTMENT", style: "" };
    if (activePage === 'login') return { text: selectedRole === 'admin' ? "ADMIN LOGIN" : "LOGIN DEPARTMENT", style: "badge-magenta" };
    return { text: "CASEMIND AI", style: "" };
  };

  const badgeInfo = getBadgeInfo();

  return (
    <div className="crt-overlay">
      <MatrixRainCanvas />
      <LedMarquee badgeText={badgeInfo.text} badgeStyle={badgeInfo.style} />
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        session={session}
        adminSession={adminSession}
        onLogout={handleLogout}
        onAdminLogout={handleAdminLogout}
      />

      {adminSession ? (
        <main className="section-padding">
          <div className="container">
            <AdminDashboard adminSession={adminSession} onLogout={handleAdminLogout} />
          </div>
        </main>
      ) : session ? (
        <main className="section-padding">
          <div className="container">
            <OfficerDashboard session={session} onLogout={handleLogout} />
          </div>
        </main>
      ) : (
        <>
          {activePage === 'home' && <HomePage />}
          {activePage === 'register' && (
            selectedRole === 'admin' ? (
              <AdminRegisterPage
                onAdminLoginSuccess={handleAdminLoginSuccess}
                setActivePage={setActivePage}
                onSelectRole={setSelectedRole}
              />
            ) : (
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                setActivePage={setActivePage}
                onSelectRole={setSelectedRole}
              />
            )
          )}
          {activePage === 'login' && (
            selectedRole === 'admin' ? (
              <AdminLoginPage
                onAdminLoginSuccess={handleAdminLoginSuccess}
                setActivePage={setActivePage}
                onSelectRole={setSelectedRole}
              />
            ) : (
              <LoginPage
                session={session}
                registeredDepts={registeredDepts}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                setActivePage={setActivePage}
                onPasswordReset={handlePasswordReset}
                onSelectRole={setSelectedRole}
              />
            )
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default App;
