import mongoose from 'mongoose';

const AdminDeptSchema = new mongoose.Schema({
  dept_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  dept_name: {
    type: String,
    required: true,
    trim: true
  },
  dept_email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.models.AdminDept || mongoose.model('AdminDept', AdminDeptSchema);
