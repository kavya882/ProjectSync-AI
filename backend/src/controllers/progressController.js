const Project = require('../models/Project');
const Task = require('../models/Task');
const Team = require('../models/Team');

// @desc    Get overall project progress statistics
// @route   GET /api/projects/:id/progress
// @access  Private
exports.getProjectProgress = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.id });
    const now = new Date();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const toDoTasks = tasks.filter(t => t.status === 'To Do').length;
    const pendingTasks = totalTasks - completedTasks;

    const overdueTasks = tasks.filter(t => {
      return t.status !== 'Completed' && new Date(t.deadline) < now;
    }).length;

    const completionPercentage = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    res.json({
      success: true,
      projectId: project._id,
      title: project.title,
      totalTasks,
      completedTasks,
      inProgressTasks,
      toDoTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage,
      disclaimer: "Contribution is estimated from recorded project activity and should be used as a progress indicator rather than a final evaluation."
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team member contributions for a project
// @route   GET /api/projects/:id/contributions
// @access  Private
exports.getMemberContributions = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: 'team',
      populate: { path: 'members', select: 'name email role studentId' }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.id }).populate('assignedTo', 'name email');

    const members = project.team ? project.team.members : [];

    const memberStats = members.map(member => {
      const memberTasks = tasks.filter(t => t.assignedTo && t.assignedTo._id.toString() === member._id.toString());
      const assignedCount = memberTasks.length;
      const completedCount = memberTasks.filter(t => t.status === 'Completed').length;
      const inProgressCount = memberTasks.filter(t => t.status === 'In Progress').length;
      const pendingCount = assignedCount - completedCount;

      const contributionPercentage = assignedCount > 0
        ? Math.round((completedCount / assignedCount) * 100)
        : 0;

      return {
        memberId: member._id,
        name: member.name,
        email: member.email,
        studentId: member.studentId,
        assignedTasks: assignedCount,
        completedTasks: completedCount,
        inProgressTasks: inProgressCount,
        pendingTasks: pendingCount,
        contributionPercentage
      };
    });

    res.json({
      success: true,
      projectId: project._id,
      projectTitle: project.title,
      contributions: memberStats,
      disclaimer: "Contribution is estimated from recorded project activity and should be used as a progress indicator rather than a final evaluation."
    });
  } catch (error) {
    next(error);
  }
};
