const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: [
      'OVERDUE_ALERT',
      'DEADLINE_WARNING',
      'WORKLOAD_OBSERVATION',
      'PROGRESS_ANALYSIS',
      'RECOMMENDATION',
      'PROJECT_RISK',
      'POSITIVE_PROGRESS'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'info'],
    default: 'info'
  },
  isRuleBased: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIInsight', aiInsightSchema);
