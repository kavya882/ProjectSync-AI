const Team = require('../models/Team');
const User = require('../models/User');

const generateJoinCode = () => {
  return 'TEAM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private (Student)
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Team name is required' });
    }

    let joinCode = generateJoinCode();
    let codeExists = await Team.findOne({ joinCode });
    while (codeExists) {
      joinCode = generateJoinCode();
      codeExists = await Team.findOne({ joinCode });
    }

    const team = await Team.create({
      name,
      description: description || '',
      leader: req.user._id,
      members: [req.user._id],
      joinCode
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email role studentId')
      .populate('members', 'name email role studentId');

    res.status(201).json({
      success: true,
      team: populatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams of logged in user (or all if admin)
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'STUDENT') {
      query = { members: req.user._id };
    }

    const teams = await Team.find(query)
      .populate('leader', 'name email role studentId')
      .populate('members', 'name email role studentId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: teams.length,
      teams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email role studentId')
      .populate('members', 'name email role studentId');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({
      success: true,
      team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join team via code
// @route   POST /api/teams/join
// @access  Private (Student)
exports.joinTeamByCode = async (req, res, next) => {
  try {
    const { joinCode } = req.body;
    if (!joinCode) {
      return res.status(400).json({ success: false, message: 'Join code is required' });
    }

    const team = await Team.findOne({ joinCode: joinCode.trim().toUpperCase() });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Invalid team join code' });
    }

    if (team.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }

    team.members.push(req.user._id);
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email role studentId')
      .populate('members', 'name email role studentId');

    res.json({
      success: true,
      message: `Successfully joined ${team.name}`,
      team: updatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to team by email or student ID
// @route   POST /api/teams/:id/members
// @access  Private (Team Leader or Admin)
exports.addTeamMember = async (req, res, next) => {
  try {
    const { identifier } = req.body; // email or studentId
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide user email or student ID' });
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Find target user
    const targetUser = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { studentId: identifier.trim() }
      ]
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found with provided email or student ID' });
    }

    if (team.members.includes(targetUser._id)) {
      return res.status(400).json({ success: false, message: 'User is already in this team' });
    }

    team.members.push(targetUser._id);
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email role studentId')
      .populate('members', 'name email role studentId');

    res.json({
      success: true,
      message: `${targetUser.name} added to team`,
      team: updatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team members
// @route   GET /api/teams/:id/members
// @access  Private
exports.getTeamMembers = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email role studentId department');
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({
      success: true,
      members: team.members
    });
  } catch (error) {
    next(error);
  }
};
