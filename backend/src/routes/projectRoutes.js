const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { getTasksByProject } = require('../controllers/taskController');
const { getProjectProgress, getMemberContributions } = require('../controllers/progressController');
const { createUpdate, getUpdatesByProject } = require('../controllers/updateController');
const { getAIInsights, analyzeProject } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Nested routes per project
router.get('/:projectId/tasks', getTasksByProject);
router.get('/:id/progress', getProjectProgress);
router.get('/:id/contributions', getMemberContributions);

router.route('/:id/updates')
  .get(getUpdatesByProject)
  .post(createUpdate);

router.get('/:id/ai-insights', getAIInsights);
router.post('/:id/ai-analyze', analyzeProject);

module.exports = router;
