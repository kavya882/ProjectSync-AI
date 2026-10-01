const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Update = require('../models/Update');
const AIInsight = require('../models/AIInsight');

// @desc    Seed sample demo data
// @route   POST /api/seed
// @access  Public (for demo/testing setup)
exports.seedDemoData = async (req, res, next) => {
  try {
    // Clear existing collections
    await User.deleteMany({});
    await Team.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Update.deleteMany({});
    await AIInsight.deleteMany({});

    console.log('[Seed Engine]: Cleared old data.');

    // 1. Create Faculty/Admin User
    const faculty = await User.create({
      name: 'Dr. Robert Smith',
      email: 'admin@college.edu',
      passwordHash: 'admin123',
      role: 'ADMIN',
      department: 'Computer Science & Engineering'
    });

    // 2. Create 4 Students
    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@student.edu',
      passwordHash: 'student123',
      role: 'STUDENT',
      studentId: 'STU202601',
      department: 'Computer Science'
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@student.edu',
      passwordHash: 'student123',
      role: 'STUDENT',
      studentId: 'STU202602',
      department: 'Information Technology'
    });

    const student3 = await User.create({
      name: 'David Chen',
      email: 'david@student.edu',
      passwordHash: 'student123',
      role: 'STUDENT',
      studentId: 'STU202603',
      department: 'Computer Science'
    });

    const student4 = await User.create({
      name: 'Sarah Miller',
      email: 'sarah@student.edu',
      passwordHash: 'student123',
      role: 'STUDENT',
      studentId: 'STU202604',
      department: 'Software Engineering'
    });

    // 3. Create Team Alpha
    const teamAlpha = await Team.create({
      name: 'Team Alpha',
      description: 'Capstone Project Team - CS401 Academic Year 2026',
      leader: student1._id,
      members: [student1._id, student2._id, student3._id, student4._id],
      joinCode: 'ALPHA26'
    });

    // 4. Create Project
    const now = new Date();
    const startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days ago
    const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);   // 7 days in future

    const project = await Project.create({
      title: 'Student Management Portal',
      description: 'A comprehensive academic web application for student registration, course tracking, and grade reports.',
      team: teamAlpha._id,
      startDate,
      deadline,
      status: 'Active',
      createdBy: student1._id
    });

    // 5. Create 5 Tasks with varied statuses and deadlines
    const overdueDeadline = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago overdue
    const upcomingDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);   // 1 day in future
    const futureDeadline = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const task1 = await Task.create({
      project: project._id,
      title: 'UI Design & Wireframing',
      description: 'Design responsive layout mockups for dashboard and task views.',
      assignedTo: student1._id,
      priority: 'High',
      deadline: startDate,
      status: 'Completed',
      progress: 100,
      completedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    });

    const task2 = await Task.create({
      project: project._id,
      title: 'Database Schema Design',
      description: 'Design MongoDB schemas for Users, Teams, Projects, Tasks, and AI Insights.',
      assignedTo: student2._id,
      priority: 'High',
      deadline: startDate,
      status: 'Completed',
      progress: 100,
      completedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    });

    const task3 = await Task.create({
      project: project._id,
      title: 'Backend REST API Implementation',
      description: 'Build Express.js endpoints for authentication, project management, and analytics.',
      assignedTo: student3._id,
      priority: 'High',
      deadline: upcomingDeadline,
      status: 'In Progress',
      progress: 60
    });

    const task4 = await Task.create({
      project: project._id,
      title: 'System Integration & Testing',
      description: 'Perform end-to-end testing between React frontend and Express REST APIs.',
      assignedTo: student4._id,
      priority: 'Medium',
      deadline: futureDeadline,
      status: 'To Do',
      progress: 0
    });

    const task5 = await Task.create({
      project: project._id,
      title: 'Technical Documentation & Report',
      description: 'Write complete academic project documentation and Postman API specification.',
      assignedTo: student4._id, // Assign to student4 to test workload balance
      priority: 'High',
      deadline: overdueDeadline,
      status: 'To Do',
      progress: 0
    });

    // 6. Create Collaboration Updates
    await Update.create({
      project: project._id,
      user: student1._id,
      content: 'Figma UI wireframes completed and approved by team leader.',
      category: 'Milestone'
    });

    await Update.create({
      project: project._id,
      user: student2._id,
      content: 'MongoDB database collections and Mongoose models created successfully.',
      category: 'Progress Update'
    });

    await Update.create({
      project: project._id,
      user: student3._id,
      content: 'Working on JWT auth middleware and REST endpoints for progress tracking.',
      category: 'Progress Update'
    });

    // 7. Seed AI Insights
    await AIInsight.create({
      project: project._id,
      type: 'OVERDUE_ALERT',
      title: 'Overdue Task Detected',
      message: "Task 'Technical Documentation & Report' is currently overdue by 2 days. High priority item needs immediate attention.",
      severity: 'high'
    });

    await AIInsight.create({
      project: project._id,
      type: 'DEADLINE_WARNING',
      title: 'Backend API Deadline Approaching',
      message: "Task 'Backend REST API Implementation' deadline is approaching within 24 hours (progress currently 60%).",
      severity: 'medium'
    });

    await AIInsight.create({
      project: project._id,
      type: 'WORKLOAD_OBSERVATION',
      title: 'Workload Imbalance Observed',
      message: 'Sarah Miller currently has 2 pending tasks while other team members have 0-1 pending tasks.',
      severity: 'medium'
    });

    await AIInsight.create({
      project: project._id,
      type: 'PROGRESS_ANALYSIS',
      title: 'Overall Project Completion Rate',
      message: 'Overall project completion rate is at 40% (2 of 5 tasks completed). Project is on track if pending high priority items are completed this week.',
      severity: 'info'
    });

    res.status(201).json({
      success: true,
      message: 'Demo dataset successfully seeded!',
      credentials: {
        facultyAdmin: { email: 'admin@college.edu', password: 'admin123', role: 'ADMIN' },
        studentLeader: { email: 'alex@student.edu', password: 'student123', role: 'STUDENT', team: 'Team Alpha' },
        studentMember: { email: 'priya@student.edu', password: 'student123', role: 'STUDENT' }
      },
      team: { name: teamAlpha.name, joinCode: teamAlpha.joinCode },
      project: { title: project.title, _id: project._id }
    });
  } catch (error) {
    next(error);
  }
};
