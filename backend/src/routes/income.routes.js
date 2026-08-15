const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { createIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/income.controller');

router.use(authMiddleware);

router.post('/', createIncome);
router.get('/', getIncomes);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
