const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goal.controller');

router.use(authMiddleware);

router.post('/', createGoal);
router.get('/', getGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
