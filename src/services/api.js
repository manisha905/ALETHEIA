// ALETHEIA · CASEMIND AI - FRONTEND SERVICE LAYER (LOCAL DB MODE)
import {
  getAdminWhitelist,
  validateDeptWhitelist,
  saveRegisteredAccount,
  loginAccountLocal,
  requestForgotOtpLocal,
  updateAccountPassword,
  getCases,
  createNewCase,
  addEvidenceAndRecalculate,
  loginAdminLocal,
  addWhitelistDept,
  deleteWhitelistDept,
  getAuditLogsLocal,
  runBreachScanLocal,
  getRegisteredAccounts
} from '../data/db';

export async function fetchAdminWhitelist() {
  return getAdminWhitelist();
}

export async function validateRegistrationWhitelist(deptName, deptId, email) {
  const match = validateDeptWhitelist(deptName, deptId, email);
  return Boolean(match);
}

export async function registerAccountApi(accountData) {
  const deptCode = accountData.dept_id.split('-')[0] || 'DEP';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const ajexId = `AJEX-${randNum}-${deptCode.toUpperCase().substring(0, 4)}`;

  const fullAccount = {
    ...accountData,
    ajex_id: ajexId,
    created_at: new Date().toISOString()
  };

  saveRegisteredAccount(fullAccount);
  return fullAccount;
}

export async function loginAccountApi(ajexId, password) {
  return loginAccountLocal(ajexId, password);
}

export async function requestForgotOtpApi(deptEmail) {
  return requestForgotOtpLocal(deptEmail);
}

export async function resetPasswordApi(ajexId, newPassword) {
  const updatedAccounts = updateAccountPassword(ajexId, newPassword);
  const found = updatedAccounts.find(a => a.ajex_id === ajexId.trim().toUpperCase());
  return found;
}

export async function fetchAllCasesApi() {
  return getCases();
}

export async function createCaseApi(caseData) {
  return createNewCase(caseData);
}

export async function addEvidenceApi(caseId, evidenceItem) {
  return addEvidenceAndRecalculate(caseId, evidenceItem);
}

// ==================== ADMIN SYSTEM APIS (LOCAL MODE) ====================

export async function loginAdminApi(adminId, password) {
  return loginAdminLocal(adminId, password);
}

export async function addWhitelistDeptApi(deptData) {
  return addWhitelistDept(deptData);
}

export async function deleteWhitelistDeptApi(deptId) {
  return deleteWhitelistDept(deptId);
}

export async function fetchSecurityAuditLogsApi() {
  const logs = getAuditLogsLocal();
  const accounts = getRegisteredAccounts();
  const cases = getCases();
  const depts = getAdminWhitelist();

  return {
    logs,
    metrics: {
      totalAccounts: accounts.length,
      totalCases: cases.length,
      totalDepts: depts.length,
      threatLevel: 'STABLE / LOCAL VAULT ACTIVE',
      dbConnections: 1,
      queryLatencyMs: 0.1
    }
  };
}

export async function runBreachScanApi() {
  return runBreachScanLocal();
}
