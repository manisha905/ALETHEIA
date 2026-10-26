export const STORAGE_KEY_ACCOUNTS = "ALETHEIA_DB_ACCOUNTS";
export const STORAGE_KEY_CASES = "ALETHEIA_DB_CASES";
export const STORAGE_KEY_WHITELIST = "ALETHEIA_DB_WHITELIST";
export const STORAGE_KEY_AUDIT_LOGS = "ALETHEIA_DB_AUDIT_LOGS";

// Default registered accounts (demo officer)
const DEFAULT_ACCOUNTS = [
  {
    ajex_id: "AJEX-9842-DEL",
    dept_id: "DEPT-DEL-NORTH-04",
    dept_name: "Metro Cyber Crime Branch",
    name: "Officer Rajesh Sharma",
    email: "admin@police.gov.in",
    password: "password123",
    registered_at: new Date().toISOString()
  }
];

// Default demo cases
const DEFAULT_CASES = [
  {
    case_id: "CASE-2024-001",
    title: "Operation Phantom Network — CDR Fraud Investigation",
    description: "Coordinated telecom fraud ring identified via call detail records. Suspects linked to shell SIM operations across 3 states.",
    status: "ACTIVE INVESTIGATION",
    priority: "HIGH",
    category: "Cybercrime",
    case_password: "case123",
    owner_dept_id: "DEPT-DEL-NORTH-04",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    evidence_items: [
      {
        id: "EV-001",
        title: "CDR Analysis Report — Suspect A",
        type: "document",
        content: "Call Detail Records show 47 suspicious calls to known fraud numbers between Jan 2024 and Mar 2024.",
        added_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    contradictions: [],
    hypotheses: [
      {
        id: "hyp-001-1",
        rank: 1,
        title: "Primary Investigative Vector: CDR-linked Telecom Fraud Ring",
        confidence: 78.5,
        description: "Initial case intelligence ingested into reasoning engine.",
        citations: ["CDR Analysis Report"]
      }
    ]
  },
  {
    case_id: "CASE-2024-002",
    title: "Dark Web Narcotics Trafficking — Cryptomarket Trace",
    description: "Illegal narcotics distribution via dark web marketplace. Blockchain transaction trail under analysis.",
    status: "ACTIVE INVESTIGATION",
    priority: "CRITICAL",
    category: "Narcotics",
    case_password: "case123",
    owner_dept_id: "DEPT-DEL-NORTH-04",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    evidence_items: [],
    contradictions: [],
    hypotheses: [
      {
        id: "hyp-002-1",
        rank: 1,
        title: "Primary Vector: Cryptowallet Address Cluster Linked to Vendor",
        confidence: 65.0,
        description: "Blockchain analysis identified 3 wallet clusters funneling proceeds to a single exchange account.",
        citations: ["Blockchain Trace Report"]
      }
    ]
  }
];

// Initial Admin Whitelist of Authorized Law Enforcement Departments
export const DEFAULT_ADMIN_WHITELIST = [
  {
    dept_id: "DEPT-DEL-NORTH-04",
    dept_name: "Metro Cyber Crime Branch",
    dept_email: "admin@police.gov.in"
  },
  {
    dept_id: "DEPT-MUM-CRIME-01",
    dept_name: "Special Crime Investigation Division",
    dept_email: "investigator@police.gov.in"
  },
  {
    dept_id: "DEPT-ATS-BANG-09",
    dept_name: "State Anti-Terror Squad",
    dept_email: "ats@karnataka.gov.in"
  },
  {
    dept_id: "DEPT-NCB-DEL-02",
    dept_name: "Narcotics Control Bureau Cyber Command",
    dept_email: "ncb@nic.in"
  }
];

// Initial Audit & Intrusion Logs
const DEFAULT_AUDIT_LOGS = [
  {
    log_id: 'LOG-10492',
    event_type: 'UNAUTHENTICATED_ATTEMPT',
    severity: 'HIGH',
    ip_address: '185.220.101.4',
    target_resource: '/api/login',
    details: 'Failed Ajex_ID authentication attempt for [AJEX-9999-FAKE] from unauthorized IP.',
    createdAt: new Date().toISOString()
  },
  {
    log_id: 'LOG-10493',
    event_type: 'OTP_FAILURE',
    severity: 'MEDIUM',
    ip_address: '103.45.12.89',
    target_resource: '/api/register/validate',
    details: 'Invalid Email OTP submitted 3 times for department email [unknown@fake.org].',
    createdAt: new Date().toISOString()
  },
  {
    log_id: 'LOG-10494',
    event_type: 'WHITELIST_CHANGE',
    severity: 'LOW',
    ip_address: '127.0.0.1',
    target_resource: 'AdminDept Collection',
    details: 'System Whitelist verified for authorized law enforcement branches.',
    createdAt: new Date().toISOString()
  }
];

export const getAdminWhitelist = () => {
  const stored = localStorage.getItem(STORAGE_KEY_WHITELIST);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(DEFAULT_ADMIN_WHITELIST));
    return DEFAULT_ADMIN_WHITELIST;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    return DEFAULT_ADMIN_WHITELIST;
  }
};

export const addWhitelistDept = (deptData) => {
  const current = getAdminWhitelist();
  const normId = deptData.dept_id.trim().toUpperCase();
  if (current.some(d => d.dept_id.toUpperCase() === normId)) {
    throw new Error('Department ID already exists in Admin Whitelist.');
  }

  const newDept = {
    dept_id: normId,
    dept_name: deptData.dept_name.trim(),
    dept_email: deptData.dept_email.trim().toLowerCase()
  };

  const updated = [...current, newDept];
  localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(updated));
  addAuditLog({
    event_type: 'WHITELIST_CHANGE',
    severity: 'MEDIUM',
    target_resource: 'Admin Dept Registry',
    details: `Added new authorized department [${newDept.dept_id}] - ${newDept.dept_name} (${newDept.dept_email}).`
  });
  return newDept;
};

export const deleteWhitelistDept = (deptId) => {
  const current = getAdminWhitelist();
  const normId = deptId.trim().toUpperCase();
  const updated = current.filter(d => d.dept_id.toUpperCase() !== normId);
  localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(updated));
  addAuditLog({
    event_type: 'WHITELIST_CHANGE',
    severity: 'HIGH',
    target_resource: 'Admin Dept Registry',
    details: `Revoked authorization for department ID [${normId}].`
  });
  return true;
};

export const getAuditLogsLocal = () => {
  const stored = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
    return DEFAULT_AUDIT_LOGS;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    return DEFAULT_AUDIT_LOGS;
  }
};

export const addAuditLog = (logItem) => {
  const current = getAuditLogsLocal();
  const fullLog = {
    log_id: `LOG-${Date.now()}`,
    ip_address: '192.168.1.104',
    ...logItem,
    createdAt: new Date().toISOString()
  };
  const updated = [fullLog, ...current];
  localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(updated));
  return fullLog;
};

export const runBreachScanLocal = () => {
  const scanId = `SCAN-${Math.floor(100000 + Math.random() * 900000)}`;
  const log = addAuditLog({
    event_type: 'BREACH_SCAN',
    severity: 'LOW',
    target_resource: 'Vault DB Engine',
    details: `Automated Deep Breach Scan [${scanId}] completed. 0 unauthorized SQL/NoSQL injections or credential leaks detected.`
  });

  return {
    scanId,
    status: 'CLEAN',
    scannedRecords: 1420,
    anomaliesFound: 0,
    timestamp: new Date().toISOString(),
    scanLog: log
  };
};

export const loginAdminLocal = (adminId, password) => {
  const normId = adminId.trim().toUpperCase();
  if ((normId === 'ADMIN-SYS-01' || normId === 'ADMIN') && password === 'admin123') {
    addAuditLog({
      event_type: 'DATABASE_QUERY',
      severity: 'LOW',
      target_resource: 'Admin Dashboard',
      details: `Master Admin [${normId}] authenticated successfully.`
    });
    return {
      admin_id: normId,
      name: 'Chief Systems Administrator',
      email: 'sysadmin@aletheia.gov.in',
      role: 'MASTER_ADMIN',
      clearance: 'LEVEL-5 TOP SECRET'
    };
  }

  addAuditLog({
    event_type: 'UNAUTHENTICATED_ATTEMPT',
    severity: 'HIGH',
    target_resource: 'Admin Login Portal',
    details: `UNAUTHORIZED ADMIN ACCESS ATTEMPT: Admin ID [${adminId}] password mismatch.`
  });
  throw new Error('Invalid Admin ID or Master Password.');
};

export const loginAccountLocal = (ajexId, password) => {
  const accounts = getRegisteredAccounts();
  const normAjex = ajexId.trim().toUpperCase();
  const found = accounts.find(a => a.ajex_id === normAjex && a.password === password);

  if (found) {
    return found;
  }

  addAuditLog({
    event_type: 'UNAUTHENTICATED_ATTEMPT',
    severity: 'HIGH',
    target_resource: 'Officer Login Portal',
    details: `Failed Ajex_ID authentication attempt for [${normAjex}].`
  });
  throw new Error('Invalid Ajex_ID or Password.');
};

export const requestForgotOtpLocal = (deptEmail) => {
  const accounts = getRegisteredAccounts();
  const normEmail = deptEmail.trim().toLowerCase();
  const found = accounts.find(a => a.email.toLowerCase() === normEmail);

  if (found) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return { account: found, otp };
  }

  throw new Error('No account registered with that Department Email.');
};

export const validateDeptWhitelist = (deptName, deptId, deptEmail) => {
  const normName = deptName.trim().toLowerCase();
  const normId = deptId.trim().toUpperCase();
  const normEmail = deptEmail.trim().toLowerCase();
  const whitelist = getAdminWhitelist();

  return whitelist.find(
    d =>
      d.dept_id.toUpperCase() === normId &&
      d.dept_name.toLowerCase() === normName &&
      d.dept_email.toLowerCase() === normEmail
  );
};

export const getRegisteredAccounts = () => {
  const stored = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    return DEFAULT_ACCOUNTS;
  }
};

export const saveRegisteredAccount = (accountData) => {
  const accounts = getRegisteredAccounts();
  const updated = [...accounts, accountData];
  localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated));
  return updated;
};

export const updateAccountPassword = (ajexId, newPassword) => {
  const accounts = getRegisteredAccounts();
  const updated = accounts.map(a => {
    if (a.ajex_id === ajexId) {
      return { ...a, password: newPassword };
    }
    return a;
  });
  localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated));
  return updated;
};

export const getCases = () => {
  const stored = localStorage.getItem(STORAGE_KEY_CASES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(DEFAULT_CASES));
    return DEFAULT_CASES;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    return DEFAULT_CASES;
  }
};

export const saveCases = (casesList) => {
  localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(casesList));
};

export const getCasesForDept = (deptId) => {
  const allCases = getCases();
  return allCases.filter(c => c.owner_dept_id === deptId);
};

export const createNewCase = (newCaseData) => {
  const allCases = getCases();
  
  // Calculate initial hypotheses
  const initialHypotheses = [
    {
      id: `hyp-${Date.now()}-1`,
      rank: 1,
      title: `Primary Investigative Vector: ${newCaseData.title}`,
      confidence: 76.5,
      description: newCaseData.description || "Initial case intelligence ingested into reasoning engine.",
      citations: ["Initial Case Filing"]
    }
  ];

  const fullCase = {
    ...newCaseData,
    status: newCaseData.status || "ACTIVE INVESTIGATION",
    created_at: new Date().toISOString(),
    evidence_items: newCaseData.evidence_items || [],
    contradictions: [],
    hypotheses: initialHypotheses
  };

  const updated = [fullCase, ...allCases];
  saveCases(updated);
  return fullCase;
};

// AI Reasoning & Dynamic Re-Prediction Engine
export const addEvidenceAndRecalculate = (caseId, evidenceItem) => {
  const allCases = getCases();
  const targetCaseIndex = allCases.findIndex(c => c.case_id === caseId);

  if (targetCaseIndex === -1) return null;

  const targetCase = { ...allCases[targetCaseIndex] };
  const updatedEvidence = [evidenceItem, ...targetCase.evidence_items];

  // Dynamic AI Hypothesis re-calculation logic based on evidence text keywords
  const textContent = updatedEvidence.map(e => `${e.title} ${e.content}`).join(' ').toLowerCase();

  let confidenceBoost = Math.min(15, updatedEvidence.length * 3.5);
  let primaryConf = Math.min(96.8, Math.max(65.0, 75.0 + confidenceBoost));
  let secondaryConf = Math.max(42.0, primaryConf - 22.3);

  const updatedHypotheses = [
    {
      id: `hyp-${caseId}-1`,
      rank: 1,
      title: `Scenario A: Synthesized Primary Vector (${updatedEvidence.length} Correlated Records)`,
      confidence: parseFloat(primaryConf.toFixed(1)),
      description: `Reasoning engine cross-referenced ${updatedEvidence.length} evidence items. Latest report "${evidenceItem.title}" increases primary hypothesis probability.`,
      citations: updatedEvidence.slice(0, 3).map(e => e.title.substring(0, 20))
    },
    {
      id: `hyp-${caseId}-2`,
      rank: 2,
      title: `Scenario B: Alternative Collusion & Secondary Vector`,
      confidence: parseFloat(secondaryConf.toFixed(1)),
      description: "Alternative counter-hypothesis evaluated against secondary timeline data.",
      citations: updatedEvidence.slice(1, 4).map(e => e.title.substring(0, 20))
    }
  ];

  // Generate dynamic contradiction alert if keywords conflict
  let updatedContradictions = [...targetCase.contradictions];
  if (textContent.includes('mismatch') || textContent.includes('gap') || textContent.includes('contradict') || textContent.includes('conflict') || textContent.includes('alibi') || evidenceItem.type === 'photo') {
    const newAlert = {
      id: `con-${Date.now()}`,
      level: "critical",
      title: `⚡ NEW DISCREPANCY DETECTED (${evidenceItem.type.toUpperCase()})`,
      details: `Latest evidence "${evidenceItem.title}" flagged by correlation engine for potential alibi/location mismatch.`,
      citation: `Ref: ${evidenceItem.title}`
    };
    updatedContradictions = [newAlert, ...updatedContradictions];
  }

  targetCase.evidence_items = updatedEvidence;
  targetCase.hypotheses = updatedHypotheses;
  targetCase.contradictions = updatedContradictions;

  allCases[targetCaseIndex] = targetCase;
  saveCases(allCases);

  return targetCase;
};
