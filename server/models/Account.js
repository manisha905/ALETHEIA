import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  ajex_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  dept_id: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  dept_name: {
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
  }
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
