const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { project, title, description, assignedTo, priority, deadline, status, progress } = req.body;

    if (!project || !title || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide project ID, title and deadline' });
    }

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({
      project,
      title,
      description: description || '',
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      deadline,
      status: status || 'To Do',
      progress: progress !== undefined ? progress : (status === 'Completed' ? 100 : 0)
    });

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email studentId');

    res.status(201).json({
      success: true,
      task: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email studentId')
      .sort({ deadline: 1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Apply updates
    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo || null;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.deadline !== undefined) task.deadline = req.body.deadline;
    if (req.body.progress !== undefined) task.progress = req.body.progress;
    if (req.body.status !== undefined) task.status = req.body.status;

    await task.save();

    const updatedTask = await Task.findById(task._id).populate('assignedTo', 'name email studentId');

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status specifically
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status, progress } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    if (progress !== undefined) {
      task.progress = progress;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id).populate('assignedTo', 'name email studentId');

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
