import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'MASTER_ADMIN'
  },
  clearance: {
    type: String,
    default: 'LEVEL-5 TOP SECRET'
  }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
