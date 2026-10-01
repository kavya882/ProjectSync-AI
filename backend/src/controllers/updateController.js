const Update = require('../models/Update');
const Project = require('../models/Project');

// @desc    Post a project update / collaboration announcement
// @route   POST /api/projects/:id/updates
// @access  Private
exports.createUpdate = async (req, res, next) => {
  try {
    const { content, category } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Update content is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const update = await Update.create({
      project: req.params.id,
      user: req.user._id,
      content,
      category: category || 'General'
    });

    const populatedUpdate = await Update.findById(update._id).populate('user', 'name email role studentId');

    res.status(201).json({
      success: true,
      update: populatedUpdate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project updates
// @route   GET /api/projects/:id/updates
// @access  Private
exports.getUpdatesByProject = async (req, res, next) => {
  try {
    const updates = await Update.find({ project: req.params.id })
      .populate('user', 'name email role studentId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: updates.length,
      updates
    });
  } catch (error) {
    next(error);
  }
};
