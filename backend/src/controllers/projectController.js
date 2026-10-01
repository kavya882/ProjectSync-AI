const Project = require('../models/Project');
const Team = require('../models/Team');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Student / Faculty)
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, team, startDate, deadline, status } = req.body;

    if (!title || !team || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide title, team ID and deadline' });
    }

    const teamExists = await Team.findById(team);
    if (!teamExists) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const project = await Project.create({
      title,
      description: description || '',
      team,
      startDate: startDate || new Date(),
      deadline,
      status: status || 'Active',
      createdBy: req.user._id
    });

    const populatedProject = await Project.findById(project._id)
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email studentId role' }
      })
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      project: populatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects user belongs to or all if Admin
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'STUDENT') {
      const userTeams = await Team.find({ members: req.user._id }).select('_id');
      const teamIds = userTeams.map(t => t._id);
      query = { team: { $in: teamIds } };
    }

    const projects = await Project.find(query)
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email studentId role' }
      })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email studentId role' }
      })
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'team',
      populate: { path: 'members leader', select: 'name email studentId role' }
    });

    res.json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
