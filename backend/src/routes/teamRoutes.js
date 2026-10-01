const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  joinTeamByCode,
  addTeamMember,
  getTeamMembers
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createTeam)
  .get(getTeams);

router.post('/join', joinTeamByCode);

router.route('/:id')
  .get(getTeamById);

router.route('/:id/members')
  .get(getTeamMembers)
  .post(addTeamMember);

module.exports = router;
