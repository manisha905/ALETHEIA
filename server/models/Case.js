import mongoose from 'mongoose';

const EvidenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageData: { type: String },
  timestamp: { type: Date, default: Date.now },
  author: { type: String, default: 'Vault Officer' }
});

const ContradictionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  level: { type: String, default: 'warning' },
  title: { type: String, required: true },
  details: { type: String, required: true },
  citation: { type: String }
});

const HypothesisSchema = new mongoose.Schema({
  id: { type: String, required: true },
  rank: { type: Number, required: true },
  title: { type: String, required: true },
  confidence: { type: Number, required: true },
  description: { type: String, required: true },
  citations: [{ type: String }]
});

const CaseSchema = new mongoose.Schema({
  case_id: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  case_password: {
    type: String,
    required: true
  },
  owner_dept_id: {
    type: String,
    required: true,
    uppercase: true
  },
  owner_dept_name: {
    type: String,
    required: true
  },
  owner_ajex_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'ACTIVE INVESTIGATION'
  },
  description: {
    type: String
  },
  evidence_items: [EvidenceSchema],
  contradictions: [ContradictionSchema],
  hypotheses: [HypothesisSchema]
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model('Case', CaseSchema);
