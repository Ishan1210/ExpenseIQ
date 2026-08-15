const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budget.controller');

router.use(authMiddleware);

router.post('/', createBudget);
router.get('/', getBudgets);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
