const Project = require('../models/Project');
const Team = require('../models/Team');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get admin/faculty global summary report
// @route   GET /api/admin/reports
// @access  Private (ADMIN / FACULTY)
exports.getAdminReports = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const totalTeams = await Team.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: 'Completed' },
      deadline: { $lt: new Date() }
    });

    const projects = await Project.find()
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email studentId' }
      })
      .sort({ createdAt: -1 });

    const projectSummaries = await Promise.all(
      projects.map(async (project) => {
        const pTasks = await Task.find({ project: project._id });
        const pTotal = pTasks.length;
        const pCompleted = pTasks.filter(t => t.status === 'Completed').length;
        const pOverdue = pTasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < new Date()).length;
        const pCompletion = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

        return {
          _id: project._id,
          title: project.title,
          teamName: project.team ? project.team.name : 'Unassigned',
          teamLeader: project.team && project.team.leader ? project.team.leader.name : 'N/A',
          memberCount: project.team && project.team.members ? project.team.members.length : 0,
          status: project.status,
          deadline: project.deadline,
          totalTasks: pTotal,
          completedTasks: pCompleted,
          overdueTasks: pOverdue,
          completionPercentage: pCompletion
        };
      })
    );

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeams,
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks
      },
      projects: projectSummaries
    });
  } catch (error) {
    next(error);
  }
};
