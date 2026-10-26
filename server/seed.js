import AdminDept from './models/AdminDept.js';
import Account from './models/Account.js';
import Case from './models/Case.js';
import Admin from './models/Admin.js';
import AuditLog from './models/AuditLog.js';

export async function seedDatabase() {
  try {
    const adminUserCount = await Admin.countDocuments();
    if (adminUserCount === 0) {
      console.log('🌱 Seeding MongoDB Master Admin User...');
      await Admin.create({
        admin_id: 'ADMIN-SYS-01',
        name: 'Chief Systems Administrator',
        email: 'sysadmin@aletheia.gov.in',
        password: 'admin123',
        role: 'MASTER_ADMIN',
        clearance: 'LEVEL-5 TOP SECRET'
      });
    }

    const auditCount = await AuditLog.countDocuments();
    if (auditCount === 0) {
      console.log('🌱 Seeding MongoDB Intrusion & Security Audit Logs...');
      await AuditLog.insertMany([
        {
          log_id: 'LOG-10492',
          event_type: 'UNAUTHENTICATED_ATTEMPT',
          severity: 'HIGH',
          ip_address: '185.220.101.4',
          target_resource: '/api/login',
          details: 'Failed Ajex_ID authentication attempt for [AJEX-9999-FAKE] from unauthorized IP.'
        },
        {
          log_id: 'LOG-10493',
          event_type: 'OTP_FAILURE',
          severity: 'MEDIUM',
          ip_address: '103.45.12.89',
          target_resource: '/api/register/validate',
          details: 'Invalid Email OTP submitted 3 times for department email [unknown@fake.org].'
        },
        {
          log_id: 'LOG-10494',
          event_type: 'WHITELIST_CHANGE',
          severity: 'LOW',
          ip_address: '127.0.0.1',
          target_resource: 'AdminDept Collection',
          details: 'System Whitelist verified for 4 authorized law enforcement branches.'
        }
      ]);
    }

    const adminCount = await AdminDept.countDocuments();
    if (adminCount === 0) {
      console.log('🌱 Seeding MongoDB AdminDept Collection...');
      await AdminDept.insertMany([
        {
          dept_id: 'DEPT-DEL-NORTH-04',
          dept_name: 'Metro Cyber Crime Branch',
          dept_email: 'admin@police.gov.in'
        },
        {
          dept_id: 'DEPT-MUM-CRIME-01',
          dept_name: 'Special Crime Investigation Division',
          dept_email: 'investigator@police.gov.in'
        },
        {
          dept_id: 'DEPT-ATS-BANG-09',
          dept_name: 'State Anti-Terror Squad',
          dept_email: 'ats@karnataka.gov.in'
        },
        {
          dept_id: 'DEPT-NCB-DEL-02',
          dept_name: 'Narcotics Control Bureau Cyber Command',
          dept_email: 'ncb@nic.in'
        }
      ]);
    }

    const accountCount = await Account.countDocuments();
    if (accountCount === 0) {
      console.log('🌱 Seeding MongoDB Account Collection...');
      await Account.insertMany([
        {
          ajex_id: 'AJEX-9842-DEL',
          dept_id: 'DEPT-DEL-NORTH-04',
          dept_name: 'Metro Cyber Crime Branch',
          email: 'admin@police.gov.in',
          password: 'password123'
        },
        {
          ajex_id: 'AJEX-5521-MUM',
          dept_id: 'DEPT-MUM-CRIME-01',
          dept_name: 'Special Crime Investigation Division',
          email: 'investigator@police.gov.in',
          password: 'password123'
        }
      ]);
    }

    const caseCount = await Case.countDocuments();
    if (caseCount === 0) {
      console.log('🌱 Seeding MongoDB Case Collection...');
      await Case.insertMany([
        {
          case_id: 'CASE-2026-CR-8941',
          title: 'Sector 4 Homicide & Financial Cyber Heist',
          case_password: 'case123',
          owner_dept_id: 'DEPT-DEL-NORTH-04',
          owner_dept_name: 'Metro Cyber Crime Branch',
          owner_ajex_id: 'AJEX-9842-DEL',
          status: 'ACTIVE INVESTIGATION',
          description: 'Multi-jurisdiction breach involving physical lock bypass, cellular ping contradictions, and spoofed security logs.',
          evidence_items: [
            {
              id: 'ev-1',
              type: 'statement',
              title: 'FIR Statement #4 (Witness Alibi)',
              content: 'Suspect Vikram Sharma claimed to be at Home (Location A) at 22:15 hrs.',
              timestamp: new Date('2026-10-01T11:20:00.000Z'),
              author: 'Inspector A. Kumar'
            },
            {
              id: 'ev-2',
              type: 'telecom',
              title: 'Tower Sector 4 Call Detail Record #238',
              content: 'Phone ping recorded for device #98765 at Crime Scene Sector 4 at 22:14:32 hrs.',
              timestamp: new Date('2026-10-01T12:00:00.000Z'),
              author: 'Cyber Cell Specialist'
            },
            {
              id: 'ev-3',
              type: 'forensic',
              title: 'Enclosure Lock Physical Inspection',
              content: 'Lock bypass technique matches unresolved cold case FIR #104/2023.',
              timestamp: new Date('2026-10-02T09:15:00.000Z'),
              author: 'Forensic Lab Lead'
            }
          ],
          contradictions: [
            {
              id: 'con-1',
              level: 'critical',
              title: '⚡ ALIBI DISCREPANCY DETECTED',
              details: 'Suspect Vikram Sharma claimed to be at Home at 22:15 hrs in FIR Statement #4, but cellular ping recorded presence at Crime Scene Sector 4 at 22:14:32 hrs.',
              citation: 'Ref: Call Detail Record #238 vs Statement #4 P.14'
            },
            {
              id: 'con-2',
              level: 'warning',
              title: '⚠️ TIMELINE GAP IDENTIFIED',
              details: '42-minute unverified gap between security exit timestamp (21:30) and Forensic Estimated Time window.',
              citation: 'Ref: Autopsy & Security Log §2'
            }
          ],
          hypotheses: [
            {
              id: 'hyp-1',
              rank: 1,
              title: 'Scenario A: Premeditated Financial Extortion & Targeted Breach',
              confidence: 88.4,
              description: 'Evidence indicates Suspect V. Sharma colluded with accomplice R. Verma using spoofed credentials. Location pings cross-referenced with financial logs confirm presence at sector boundary.',
              citations: ['Statement #4 P.8', 'Call Record #238', 'Forensic Log §9']
            },
            {
              id: 'hyp-2',
              rank: 2,
              title: 'Scenario B: Inside Collusion & Secondary Evidence Tampering',
              confidence: 64.1,
              description: 'Discrepancy in security access logs suggests unlisted entry via maintenance corridor B-3 prior to power disruption.',
              citations: ['Camera Log 12', 'Access Log L42']
            }
          ]
        },
        {
          case_id: 'CASE-2026-ND-4021',
          title: 'Interstate Syndicate Contraband Network',
          case_password: 'case123',
          owner_dept_id: 'DEPT-MUM-CRIME-01',
          owner_dept_name: 'Special Crime Investigation Division',
          owner_ajex_id: 'AJEX-5521-MUM',
          status: 'UNDER REVIEW',
          description: 'Cross-border logistics vessel tracking and encrypted shell company money laundering operation.',
          evidence_items: [
            {
              id: 'ev-101',
              type: 'document',
              title: 'Customs Manifest Manifest #901',
              content: 'Consignment declared as industrial machine parts; weight discrepancy flagged at Port Control Terminal 2.',
              timestamp: new Date('2026-10-03T15:00:00.000Z'),
              author: 'Customs Intelligence Officer'
            }
          ],
          contradictions: [
            {
              id: 'con-101',
              level: 'warning',
              title: '⚠️ WEIGHT MANIFEST MISMATCH',
              details: 'Declared cargo weight (12,400 kg) differs from automated weighbridge sensor log (14,850 kg).',
              citation: 'Ref: Customs Terminal Sensor 4 Log'
            }
          ],
          hypotheses: [
            {
              id: 'hyp-101',
              rank: 1,
              title: 'Scenario A: Shell Logistics Front & Smuggling Corridor',
              confidence: 79.5,
              description: 'Discrepancy in cargo weight and shipping manifest suggests unlisted compartment installation.',
              citations: ['Manifest #901', 'Weighbridge Log W-4']
            }
          ]
        }
      ]);
    }
    console.log('✅ MongoDB Seeding Complete.');
  } catch (err) {
    console.error('❌ MongoDB Seeding Error:', err);
  }
}
