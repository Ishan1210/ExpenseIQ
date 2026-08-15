const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getInsights } = require('../controllers/ai.controller');

router.use(authMiddleware);

router.get('/insights', getInsights);

module.exports = router;
