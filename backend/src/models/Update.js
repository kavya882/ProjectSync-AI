const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Update content is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['General', 'Progress Update', 'Blocker', 'Milestone'],
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Update', updateSchema);
