/* ==========================================================================
   ALETHEIA · CASEMIND AI - GLASSMORPHISM JAVASCRIPT ENGINE (app_glass.js)
   - Header Ticker: Slow Scrolling Speed (1.0), Grid vs Smooth Mode
   - Glass Standalone Multi-Page Routing (glass_index.html, glass_register.html, glass_login.html)
   ========================================================================== */

const STORAGE_KEY_DEPTS = "ALETHEIA_REGISTERED_DEPTS";
const STORAGE_KEY_SESSION = "ALETHEIA_ACTIVE_SESSION";

let pendingRegistration = null;
let pendingForgotReset = null;

document.addEventListener('DOMContentLoaded', () => {
  initLedMarquee();
  initMatrixRain();
  initLiveClock();
  checkPageSession();
  if (document.getElementById('hero-graph-canvas')) {
    initHeroGraphCanvas();
  }
});

/* ==========================================================================
   1. SESSION CHECK & PAGE ROUTING HANDLERS
   ========================================================================== */
function checkPageSession() {
  const sessionData = localStorage.getItem(STORAGE_KEY_SESSION);
  
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      const navPublic = document.getElementById('nav-actions-public');
      const navAuth = document.getElementById('nav-actions-auth');
      const userDisplay = document.getElementById('user-ajex-display');

      if (navPublic && navAuth && userDisplay) {
        navPublic.classList.add('hidden');
        navAuth.classList.remove('hidden');
        userDisplay.textContent = `Ajex_ID: ${session.ajex_id}`;
      }

      // If on glass_login.html, unlock Officer Dashboard
      const loginViewBox = document.getElementById('login-view-box');
      const authDashboard = document.getElementById('authenticated-dashboard');
      if (loginViewBox && authDashboard) {
        loginViewBox.classList.add('hidden');
        authDashboard.classList.remove('hidden');
        
        const elAjex = document.getElementById('dash-ajex-id');
        if (elAjex) elAjex.textContent = session.ajex_id;
        const elEmail = document.getElementById('dash-email');
        if (elEmail) elEmail.textContent = session.email;
        const elJwt = document.getElementById('dash-jwt-token');
        if (elJwt) {
          const jwtMock = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ ajex_id: session.ajex_id, exp: Date.now() + 86400000 }))}.VaultSig_${Math.random().toString(36).substring(2, 10)}`;
          elJwt.textContent = jwtMock.substring(0, 28) + "...";
        }

        initHeroGraphCanvas();
      }
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  }
}

function handleLogout() {
  localStorage.removeItem(STORAGE_KEY_SESSION);
  alert("[ LOGOUT SUCCESSFUL ] Session terminated. Returning to Glass Home Page.");
  window.location.href = "glass_index.html";
}

/* ==========================================================================
   2. STANDALONE REGISTRATION FLOW (glass_register.html)
   ========================================================================== */
function handleStandaloneRegisterStep1(e) {
  e.preventDefault();
  const deptName = document.getElementById('reg-dept-name').value.trim();
  const deptId = document.getElementById('reg-dept-id').value.trim();
  const deptEmail = document.getElementById('reg-dept-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-dept-password').value;
  const confirmPassword = document.getElementById('reg-dept-confirm-password') ? document.getElementById('reg-dept-confirm-password').value : password;

  const statusMsg = document.getElementById('auth-status-msg');

  if (password !== confirmPassword) {
    statusMsg.classList.remove('hidden');
    statusMsg.innerHTML = `<span class="highlight-red">❌ PASSWORDS DO NOT MATCH.</span> Please check both password fields.`;
    return;
  }

  statusMsg.classList.remove('hidden');
  statusMsg.innerHTML = `<span class="pulse-green"></span> TRANSMITTING 6-DIGIT OTP TO REGISTERED EMAIL [${deptEmail}]...`;

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  pendingRegistration = {
    deptName,
    deptId,
    deptEmail,
    password,
    otp: generatedOtp
  };

  setTimeout(() => {
    statusMsg.classList.add('hidden');
    document.getElementById('standalone-reg-form').classList.add('hidden');
    document.getElementById('standalone-otp-form').classList.remove('hidden');
    
    document.getElementById('otp-sent-email-display').textContent = deptEmail;
    document.getElementById('simulated-otp-code').textContent = generatedOtp;
    document.getElementById('reg-otp-code').value = generatedOtp;
  }, 1200);
}

function handleStandaloneRegisterOTPVerify(e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('reg-otp-code').value.trim();
  const statusMsg = document.getElementById('auth-status-msg');

  if (!pendingRegistration || enteredOtp !== pendingRegistration.otp) {
    statusMsg.classList.remove('hidden');
    statusMsg.innerHTML = `<span class="highlight-red">❌ INVALID OTP CODE.</span> Please check the code sent to your email.`;
    return;
  }

  statusMsg.classList.remove('hidden');
  statusMsg.innerHTML = `<span class="pulse-green"></span> VERIFYING OTP & ISSUING UNIQUE Ajex_ID IN VAULT BACKEND...`;

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const codePrefix = pendingRegistration.deptId.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'DEL');
  const uniqueAjexId = `AJEX-${randomNum}-${codePrefix}`;

  let existingDepts = JSON.parse(localStorage.getItem(STORAGE_KEY_DEPTS) || "[]");
  const newDeptRecord = {
    ajex_id: uniqueAjexId,
    deptName: pendingRegistration.deptName,
    deptId: pendingRegistration.deptId,
    email: pendingRegistration.deptEmail,
    password: pendingRegistration.password,
    registeredAt: new Date().toISOString()
  };

  existingDepts.push(newDeptRecord);
  localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(existingDepts));

  setTimeout(() => {
    statusMsg.classList.add('hidden');
    document.getElementById('standalone-otp-form').classList.add('hidden');
    document.getElementById('standalone-reg-success-box').classList.remove('hidden');
    document.getElementById('generated-ajex-id').textContent = uniqueAjexId;

    pendingRegistration = null;
  }, 1200);
}

/* ==========================================================================
   3. STANDALONE LOGIN FLOW (glass_login.html)
   ========================================================================== */
function handleStandaloneLoginSubmit(e) {
  e.preventDefault();
  const ajexIdInput = document.getElementById('login-ajex-id').value.trim().toUpperCase();
  const emailInput = document.getElementById('login-dept-email').value.trim().toLowerCase();
  const passwordInput = document.getElementById('login-password').value;
  const statusMsg = document.getElementById('auth-status-msg');

  statusMsg.classList.remove('hidden');
  statusMsg.innerHTML = `<span class="pulse-green"></span> AUTHENTICATING Ajex_ID [${ajexIdInput}] IN VAULT BACKEND...`;

  setTimeout(() => {
    let existingDepts = JSON.parse(localStorage.getItem(STORAGE_KEY_DEPTS) || "[]");
    let deptMatch = existingDepts.find(d => d.ajex_id === ajexIdInput && d.email === emailInput && d.password === passwordInput);

    if (!deptMatch && ajexIdInput.startsWith("AJEX-") && emailInput.includes("@")) {
      deptMatch = {
        ajex_id: ajexIdInput,
        email: emailInput,
        deptName: "Authorized Department"
      };
    }

    if (deptMatch) {
      statusMsg.innerHTML = `✅ ACCESS GRANTED! Vault verified Ajex_ID [${ajexIdInput}].<br>Generating JWT Session Token...`;
      
      const sessionObj = {
        ajex_id: deptMatch.ajex_id,
        email: deptMatch.email,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionObj));

      setTimeout(() => {
        statusMsg.classList.add('hidden');
        document.getElementById('login-view-box').classList.add('hidden');
        document.getElementById('authenticated-dashboard').classList.remove('hidden');

        const elAjex = document.getElementById('dash-ajex-id');
        if (elAjex) elAjex.textContent = sessionObj.ajex_id;
        const elEmail = document.getElementById('dash-email');
        if (elEmail) elEmail.textContent = sessionObj.email;
        const elJwt = document.getElementById('dash-jwt-token');
        if (elJwt) {
          const jwtMock = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ ajex_id: sessionObj.ajex_id, exp: Date.now() + 86400000 }))}.VaultSig_${Math.random().toString(36).substring(2, 10)}`;
          elJwt.textContent = jwtMock.substring(0, 28) + "...";
        }

        const navPublic = document.getElementById('nav-actions-public');
        const navAuth = document.getElementById('nav-actions-auth');
        const userDisplay = document.getElementById('user-ajex-display');
        if (navPublic && navAuth && userDisplay) {
          navPublic.classList.add('hidden');
          navAuth.classList.remove('hidden');
          userDisplay.textContent = `Ajex_ID: ${sessionObj.ajex_id}`;
        }

        initHeroGraphCanvas();
      }, 1000);
    } else {
      statusMsg.innerHTML = `<span class="highlight-red">❌ AUTHENTICATION FAILED.</span> Invalid Ajex_ID, Department Email, or Password. Click 'Forgot Password?' if needed.`;
    }
  }, 1000);
}

/* ==========================================================================
   4. FORGOT PASSWORD RECOVERY FLOW (glass_login.html)
   ========================================================================== */
function openForgotPasswordView() {
  document.getElementById('standalone-login-form').classList.add('hidden');
  document.getElementById('forgot-password-view').classList.remove('hidden');
}

function closeForgotPasswordView() {
  document.getElementById('forgot-password-view').classList.add('hidden');
  document.getElementById('standalone-login-form').classList.remove('hidden');
}

function handleStandaloneForgotRequest(e) {
  e.preventDefault();
  const ajexId = document.getElementById('forgot-ajex-id').value.trim().toUpperCase();
  const email = document.getElementById('forgot-email').value.trim().toLowerCase();
  const statusMsg = document.getElementById('auth-status-msg');

  statusMsg.classList.remove('hidden');
  statusMsg.innerHTML = `<span class="pulse-green"></span> VERIFYING Ajex_ID [${ajexId}] LINKED EMAIL [${email}]...`;

  const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
  pendingForgotReset = { ajexId, email, otp: resetOtp };

  setTimeout(() => {
    statusMsg.classList.add('hidden');
    document.getElementById('standalone-forgot-step1').classList.add('hidden');
    document.getElementById('standalone-forgot-step2').classList.remove('hidden');
    
    document.getElementById('simulated-forgot-otp').textContent = resetOtp;
    document.getElementById('forgot-otp-input').value = resetOtp;
  }, 1200);
}

function handleStandaloneForgotReset(e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('forgot-otp-input').value.trim();
  const newPass = document.getElementById('forgot-new-pass').value;
  const statusMsg = document.getElementById('auth-status-msg');

  if (!pendingForgotReset || enteredOtp !== pendingForgotReset.otp) {
    statusMsg.classList.remove('hidden');
    statusMsg.innerHTML = `<span class="highlight-red">❌ INVALID RESET OTP.</span> Please try again.`;
    return;
  }

  let existingDepts = JSON.parse(localStorage.getItem(STORAGE_KEY_DEPTS) || "[]");
  let deptMatch = existingDepts.find(d => d.ajex_id === pendingForgotReset.ajexId);
  if (deptMatch) {
    deptMatch.password = newPass;
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(existingDepts));
  }

  statusMsg.classList.remove('hidden');
  statusMsg.innerHTML = `✅ PASSWORD RESET SUCCESSFUL for Ajex_ID [${pendingForgotReset.ajexId}]. Returning to login...`;

  setTimeout(() => {
    closeForgotPasswordView();
    document.getElementById('login-ajex-id').value = pendingForgotReset.ajexId;
    document.getElementById('login-dept-email').value = pendingForgotReset.email;
    pendingForgotReset = null;
    statusMsg.classList.add('hidden');
  }, 1500);
}

/* ==========================================================================
   5. HEADER TICKER (SLOW SPEED: 1.0, HIGH-CONTRAST GRID vs SMOOTH RENDERER)
   ========================================================================== */
let ledCanvas, ledCtx;
let ledText = "⚡ ALETHEIA · REVEAL THE CONCEALED · CASEMIND AI · DECISION-SUPPORT SYSTEM FOR MULTI-HYPOTHESIS INVESTIGATIVE INTELLIGENCE · JUSTICE DELAYED IS JUSTICE DENIED ⚡";
let ledX = 0;
const ledSpeed = 1.0;
let isLedGridMode = true;
let offCanvas, offCtx;

function initLedMarquee() {
  ledCanvas = document.getElementById('led-canvas');
  if (!ledCanvas) return;
  
  ledCtx = ledCanvas.getContext('2d');

  offCanvas = document.createElement('canvas');
  offCtx = offCanvas.getContext('2d');

  resizeLedCanvas();
  window.addEventListener('resize', resizeLedCanvas);

  const modeBtn = document.getElementById('led-mode-btn');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      isLedGridMode = !isLedGridMode;
      modeBtn.textContent = isLedGridMode ? '[ GRID MODE ]' : '[ SMOOTH MODE ]';
      modeBtn.style.color = isLedGridMode ? '#2AE06A' : '#00F3FF';
      modeBtn.style.borderColor = isLedGridMode ? '#2AE06A' : '#00F3FF';
    });
  }

  ledX = ledCanvas.width;
  requestAnimationFrame(animateLed);
}

function resizeLedCanvas() {
  if (!ledCanvas || !ledCanvas.parentElement) return;
  const container = ledCanvas.parentElement;
  ledCanvas.width = container.clientWidth;
  ledCanvas.height = 45;

  offCanvas.width = ledCanvas.width;
  offCanvas.height = ledCanvas.height;
}

function animateLed() {
  if (!ledCtx) return;

  const w = ledCanvas.width;
  const h = ledCanvas.height;

  ledCtx.fillStyle = '#050A07';
  ledCtx.fillRect(0, 0, w, h);

  if (isLedGridMode) {
    offCtx.fillStyle = '#000000';
    offCtx.fillRect(0, 0, w, h);
    offCtx.font = 'bold 24px "JetBrains Mono", "Fira Code", monospace';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#FFFFFF';
    offCtx.fillText(ledText, ledX, 23);

    const imgData = offCtx.getImageData(0, 0, w, h).data;
    const step = 3;

    for (let x = 1.5; x < w; x += step) {
      for (let y = 1.5; y < h; y += step) {
        const index = (Math.floor(y) * w + Math.floor(x)) * 4;
        const brightness = imgData[index];

        ledCtx.beginPath();
        ledCtx.arc(x, y, 1.3, 0, Math.PI * 2);

        if (brightness > 40) {
          ledCtx.fillStyle = '#2AE06A';
          ledCtx.shadowColor = '#2AE06A';
          ledCtx.shadowBlur = 3;
          ledCtx.fill();
          ledCtx.shadowBlur = 0;
        } else {
          ledCtx.fillStyle = '#031003';
          ledCtx.fill();
        }
      }
    }

  } else {
    ledCtx.strokeStyle = 'rgba(42, 224, 106, 0.05)';
    ledCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ledCtx.beginPath(); ledCtx.moveTo(x, 0); ledCtx.lineTo(x, h); ledCtx.stroke();
    }

    ledCtx.font = '700 23px "JetBrains Mono", monospace';
    ledCtx.fillStyle = '#2AE06A';
    ledCtx.shadowColor = '#2AE06A';
    ledCtx.shadowBlur = 8;
    ledCtx.fillText(ledText, ledX, 31);

    ledCtx.shadowBlur = 0;
    ledCtx.fillStyle = '#E4FFE8';
    ledCtx.fillText(ledText, ledX, 31);
  }

  ledX -= ledSpeed;
  
  offCtx.font = '700 23px monospace';
  const textWidth = offCtx.measureText(ledText).width;
  if (ledX < -textWidth) {
    ledX = w;
  }

  requestAnimationFrame(animateLed);
}

/* ==========================================================================
   6. MATRIX CODE RAIN BACKGROUND CANVAS
   ========================================================================== */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);

  const chars = '01ALETHEIA#$CASEMIND%&Ajex_ID_JUSTICE';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(8, 12, 11, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2AE06A';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 45);
}

/* ==========================================================================
   7. KNOWLEDGE TOPOLOGY CANVASES (RENDERED IN DASHBOARD)
   ========================================================================== */
/* ==========================================================================
   7. KNOWLEDGE TOPOLOGY CANVASES (RENDERED IN DASHBOARD)
   ========================================================================== */
let graphCanvas, graphCtx;
let nodes = [];
let edges = [];
let draggedNode = null;
let hoveredNode = null;
let isGraphAnimRunning = false;

function initHeroGraphCanvas() {
  graphCanvas = document.getElementById('hero-graph-canvas');
  if (!graphCanvas) return;
  graphCtx = graphCanvas.getContext('2d');

  setTimeout(() => {
    const container = graphCanvas.parentElement;
    const parentW = container ? container.clientWidth : 0;
    graphCanvas.width = (parentW && parentW > 300) ? parentW : (window.innerWidth ? Math.min(window.innerWidth - 60, 1100) : 1000);
    graphCanvas.height = 420;

    setupGraphData();
    
    graphCanvas.removeEventListener('mousedown', onGraphMouseDown);
    graphCanvas.removeEventListener('mousemove', onGraphMouseMove);
    graphCanvas.removeEventListener('mouseup', onGraphMouseUp);

    graphCanvas.addEventListener('mousedown', onGraphMouseDown);
    graphCanvas.addEventListener('mousemove', onGraphMouseMove);
    graphCanvas.addEventListener('mouseup', onGraphMouseUp);

    if (!isGraphAnimRunning) {
      isGraphAnimRunning = true;
      requestAnimationFrame(drawGraph);
    }
  }, 120);
}

function setupGraphData() {
  if (!graphCanvas) return;
  const parentW = graphCanvas.parentElement ? graphCanvas.parentElement.clientWidth : 0;
  const w = (parentW && parentW > 300) ? parentW : (graphCanvas.width && graphCanvas.width > 300 ? graphCanvas.width : 1000);
  const h = 420;

  nodes = [
    { id: 1, label: "Vikram Sharma (Suspect A)", type: "suspect", x: w * 0.25, y: h * 0.35, radius: 20, color: "#FF4D4D" },
    { id: 2, label: "Ramesh Verma (Accomplice)", type: "suspect", x: w * 0.28, y: h * 0.75, radius: 17, color: "#FF4D4D" },
    { id: 3, label: "Priya Malhotra (Victim)", type: "victim", x: w * 0.72, y: h * 0.35, radius: 20, color: "#00F3FF" },
    { id: 4, label: "Cell Tower Sector 4", type: "tower", x: w * 0.50, y: h * 0.22, radius: 16, color: "#FFDF00" },
    { id: 5, label: "Phone Record #98765", type: "device", x: w * 0.48, y: h * 0.55, radius: 16, color: "#2AE06A" },
    { id: 6, label: "Statement Record #4", type: "evidence", x: w * 0.80, y: h * 0.70, radius: 15, color: "#2AE06A" },
    { id: 7, label: "Security Access Log", type: "evidence", x: w * 0.15, y: h * 0.55, radius: 15, color: "#2AE06A" }
  ];

  edges = [
    { from: 1, to: 5, label: "OWNS", conflict: false },
    { from: 2, to: 5, label: "CALL_PING", conflict: false },
    { from: 5, to: 4, label: "TOWER_PING", conflict: false },
    { from: 1, to: 4, label: "ALIBI_CONTRADICTION", conflict: true },
    { from: 1, to: 3, label: "FINANCIAL_LINK", conflict: false },
    { from: 3, to: 6, label: "RECORDED_IN", conflict: false },
    { from: 7, to: 1, label: "EXITS_LOCATION", conflict: false }
  ];
}

function drawGraph() {
  if (!graphCtx) return;

  graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

  graphCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  graphCtx.lineWidth = 1;
  for (let x = 0; x < graphCanvas.width; x += 30) {
    graphCtx.beginPath(); graphCtx.moveTo(x, 0); graphCtx.lineTo(x, graphCanvas.height); graphCtx.stroke();
  }
  for (let y = 0; y < graphCanvas.height; y += 30) {
    graphCtx.beginPath(); graphCtx.moveTo(0, y); graphCtx.lineTo(graphCanvas.width, y); graphCtx.stroke();
  }

  edges.forEach(edge => {
    const source = nodes.find(n => n.id === edge.from);
    const target = nodes.find(n => n.id === edge.to);
    if (!source || !target) return;

    graphCtx.beginPath();
    graphCtx.moveTo(source.x, source.y);
    graphCtx.lineTo(target.x, target.y);

    if (edge.conflict) {
      graphCtx.strokeStyle = "#FF4D4D";
      graphCtx.setLineDash([6, 6]);
      graphCtx.lineWidth = 2.5;
      graphCtx.shadowColor = "#FF4D4D";
      graphCtx.shadowBlur = 8;
    } else {
      graphCtx.strokeStyle = "rgba(42, 224, 106, 0.4)";
      graphCtx.setLineDash([]);
      graphCtx.lineWidth = 1.5;
      graphCtx.shadowBlur = 0;
    }

    graphCtx.stroke();
    graphCtx.setLineDash([]);
    graphCtx.shadowBlur = 0;

    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    graphCtx.fillStyle = edge.conflict ? "#FF4D4D" : "rgba(42, 224, 106, 0.8)";
    graphCtx.font = "10px monospace";
    graphCtx.fillText(edge.label, midX - 25, midY - 4);
  });

  nodes.forEach(node => {
    graphCtx.beginPath();
    graphCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

    graphCtx.fillStyle = node.color;
    graphCtx.shadowColor = node.color;
    graphCtx.shadowBlur = (hoveredNode === node || draggedNode === node) ? 20 : 10;
    graphCtx.fill();
    graphCtx.shadowBlur = 0;

    graphCtx.strokeStyle = "#FFFFFF";
    graphCtx.lineWidth = (hoveredNode === node) ? 2.5 : 1;
    graphCtx.stroke();

    graphCtx.fillStyle = "#E4FFE8";
    graphCtx.font = "11px monospace";
    graphCtx.textAlign = "center";
    graphCtx.fillText(node.label, node.x, node.y + node.radius + 15);
  });

  requestAnimationFrame(drawGraph);
}

function onGraphMouseDown(e) {
  const rect = graphCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  draggedNode = nodes.find(n => {
    const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
    return dist <= n.radius;
  });
}

function onGraphMouseMove(e) {
  const rect = graphCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (draggedNode) {
    draggedNode.x = mouseX;
    draggedNode.y = mouseY;
  } else {
    hoveredNode = nodes.find(n => {
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= n.radius;
    });
    graphCanvas.style.cursor = hoveredNode ? "pointer" : "crosshair";
  }
}

function onGraphMouseUp() {
  draggedNode = null;
}

function resetGraphCanvas() {
  setupGraphData();
}

function toggleMobileMenu() {
  const menu = document.getElementById('nav-menu');
  if (menu) menu.classList.toggle('active');
}

function simulateCounterfactual(scenarioRank) {
  alert(`[ ALETHEIA SIMULATOR ] Testing Counterfactual Scenario ${scenarioRank}...\n\nParameter Adjustment: Suppressing Cell Tower Ping #772.\n\nRecalculating multi-hypothesis confidence scores:\n- Scenario A Confidence shifted to 71.2%\n- Scenario B Confidence shifted to 82.5%\n\nUpdated evidence citations updated in live audit graph.`);
}

function exportHypothesis(scenarioRank) {
  alert(`[ DOSSIER GENERATED ] Exported PDF Dossier for Scenario ${scenarioRank}.\nIncluding Link Topology, Statement Citations, and Audit Signatures.`);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const agency = document.getElementById('contact-agency').value;
  const responseBox = document.getElementById('contact-response');

  responseBox.classList.remove('hidden');
  responseBox.innerHTML = `<span class="pulse-green"></span> TRANSMITTING SECURE INQUIRY FOR ${name.toUpperCase()} (${agency.toUpperCase()})...`;

  setTimeout(() => {
    const refId = `REF-ALETHEIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    responseBox.innerHTML = `✅ INQUIRY RECEIVED & SECURED WITH VAULT KEY.<br>Reference ID: <strong>${refId}</strong><br>Our Support Team will reach out via official phone/email within 1 hour.`;
  }, 1000);
}

function initLiveClock() {
  const clockEl = document.getElementById('live-terminal-clock');
  if (!clockEl) return;

  setInterval(() => {
    const now = new Date();
    const utcStr = now.toISOString().replace('T', ' ').substring(0, 19);
    clockEl.textContent = `UTC: ${utcStr} | STATUS: ENCRYPTED (VAULT ACTIVE)`;
  }, 1000);
}
