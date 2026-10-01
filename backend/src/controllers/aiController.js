const Project = require('../models/Project');
const Task = require('../models/Task');
const AIInsight = require('../models/AIInsight');

// @desc    Get stored AI insights for a project
// @route   GET /api/projects/:id/ai-insights
// @access  Private
exports.getAIInsights = async (req, res, next) => {
  try {
    let insights = await AIInsight.find({ project: req.params.id }).sort({ createdAt: -1 });

    // If no insights generated yet, automatically run analysis engine once
    if (insights.length === 0) {
      await exports.analyzeProject(req, res, next);
      return;
    }

    res.json({
      success: true,
      count: insights.length,
      insights,
      aiDisclaimer: "AI insights provide automated analysis of project progress to assist decision-making. They do not replace faculty evaluation or team leadership judgment."
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger AI analysis engine on project data
// @route   POST /api/projects/:id/ai-analyze
// @access  Private
exports.analyzeProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate({
      path: 'team',
      populate: { path: 'members', select: 'name email' }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');
    const now = new Date();

    // Clear old insights to re-generate fresh state
    await AIInsight.deleteMany({ project: projectId });

    const generatedInsights = [];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed');
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < now);
    const highPriorityIncomplete = tasks.filter(t => t.status !== 'Completed' && t.priority === 'High');

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 1. OVERDUE TASK ALERT
    if (overdueTasks.length > 0) {
      const overdueTitles = overdueTasks.map(t => `'${t.title}'`).slice(0, 2).join(', ');
      generatedInsights.push({
        project: projectId,
        type: 'OVERDUE_ALERT',
        title: 'Overdue Tasks Detected',
        message: `${overdueTasks.length} task(s) are currently overdue (${overdueTitles}). Immediate review recommended.`,
        severity: 'high'
      });
    }

    // 2. DEADLINE WARNING (tasks due within next 48 hours)
    const upcomingDeadlines = pendingTasks.filter(t => {
      const deadlineDiff = new Date(t.deadline) - now;
      return deadlineDiff > 0 && deadlineDiff <= 48 * 60 * 60 * 1000;
    });

    if (upcomingDeadlines.length > 0) {
      const titles = upcomingDeadlines.map(t => `'${t.title}'`).join(', ');
      generatedInsights.push({
        project: projectId,
        type: 'DEADLINE_WARNING',
        title: 'Upcoming Deadline Warning',
        message: `${upcomingDeadlines.length} task(s) due within the next 48 hours (${titles}).`,
        severity: 'medium'
      });
    }

    // 3. WORKLOAD OBSERVATION
    if (project.team && project.team.members && project.team.members.length > 0) {
      const memberPendingMap = {};
      project.team.members.forEach(m => {
        memberPendingMap[m._id.toString()] = { name: m.name, pending: 0 };
      });

      pendingTasks.forEach(t => {
        if (t.assignedTo && memberPendingMap[t.assignedTo._id.toString()]) {
          memberPendingMap[t.assignedTo._id.toString()].pending += 1;
        }
      });

      const memberStats = Object.values(memberPendingMap);
      if (memberStats.length > 1) {
        const sortedByPending = [...memberStats].sort((a, b) => b.pending - a.pending);
        const highest = sortedByPending[0];
        const lowest = sortedByPending[sortedByPending.length - 1];

        if (highest.pending >= 3 && highest.pending > lowest.pending + 1) {
          generatedInsights.push({
            project: projectId,
            type: 'WORKLOAD_OBSERVATION',
            title: 'Workload Imbalance Observed',
            message: `${highest.name} currently has ${highest.pending} pending task(s), significantly higher than other team members.`,
            severity: 'medium'
          });

          generatedInsights.push({
            project: projectId,
            type: 'RECOMMENDATION',
            title: 'Task Reallocation Suggested',
            message: `Consider reviewing pending tasks assigned to ${highest.name} and reassigning items to balance team workload.`,
            severity: 'info'
          });
        }
      }
    }

    // 4. PROJECT RISK WARNING
    if (highPriorityIncomplete.length >= 2) {
      generatedInsights.push({
        project: projectId,
        type: 'PROJECT_RISK',
        title: 'High Priority Risk Alert',
        message: `${highPriorityIncomplete.length} high-priority tasks remain incomplete. Prioritize core requirements to avoid delivery delay.`,
        severity: 'high'
      });
    }

    // 5. PROGRESS ANALYSIS & POSITIVE PROGRESS
    if (totalTasks === 0) {
      generatedInsights.push({
        project: projectId,
        type: 'PROGRESS_ANALYSIS',
        title: 'No Tasks Defined',
        message: 'No tasks have been created for this project yet. Start by creating milestones and task items.',
        severity: 'info'
      });
    } else if (completionRate === 100) {
      generatedInsights.push({
        project: projectId,
        type: 'POSITIVE_PROGRESS',
        title: 'Project Fully Completed',
        message: 'All tasks for this project have been successfully completed! Fantastic team collaboration.',
        severity: 'info'
      });
    } else {
      generatedInsights.push({
        project: projectId,
        type: 'PROGRESS_ANALYSIS',
        title: 'Overall Progress Track',
        message: `Overall project completion is currently at ${completionRate}%. ${completedTasks} of ${totalTasks} total tasks completed.`,
        severity: completionRate < 40 ? 'medium' : 'info'
      });
    }

    // Save generated insights into MongoDB
    const savedInsights = await AIInsight.insertMany(generatedInsights);

    res.json({
      success: true,
      count: savedInsights.length,
      insights: savedInsights,
      aiDisclaimer: "AI insights provide automated analysis of project progress to assist decision-making. They do not replace faculty evaluation or team leadership judgment."
    });
  } catch (error) {
    next(error);
  }
};
