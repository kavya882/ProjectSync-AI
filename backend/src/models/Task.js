const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  deadline: {
    type: Date,
    required: [true, 'Task deadline is required']
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Auto update completedAt on status change
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Completed') {
      this.completedAt = new Date();
      this.progress = 100;
    } else if (this.status === 'To Do') {
      this.completedAt = null;
      if (this.progress === 100) this.progress = 0;
    } else if (this.status === 'In Progress') {
      this.completedAt = null;
      if (this.progress === 0 || this.progress === 100) this.progress = 50;
    }
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
