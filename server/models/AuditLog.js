import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  log_id: {
    type: String,
    required: true,
    unique: true
  },
  event_type: {
    type: String,
    required: true,
    enum: ['UNAUTHENTICATED_ATTEMPT', 'OTP_FAILURE', 'WHITELIST_CHANGE', 'DATABASE_QUERY', 'SUSPICIOUS_IP', 'BREACH_SCAN']
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  ip_address: {
    type: String,
    default: '192.168.1.104'
  },
  target_resource: {
    type: String,
    default: 'Vault DB'
  },
  details: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
