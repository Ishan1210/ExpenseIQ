const prisma = require('../config/prisma');
const { generateInsights } = require('../services/gemini.service');

async function getInsights(req, res) {
  try {
    const userId = req.userId;

    // Pull everything Gemini needs in parallel — same pattern as the dashboard fetch
    const [expenses, income, budgets, goals] = await Promise.all([
      prisma.expense.findMany({ where: { userId } }),
      prisma.income.findMany({ where: { userId } }),
      prisma.budget.findMany({ where: { userId } }),
      prisma.goal.findMany({ where: { userId } }),
    ]);

    if (expenses.length === 0) {
      return res.status(200).json({
        summary: 'Add a few expenses first — insights need some spending data to work with.',
        insights: [],
        suggestions: [],
        riskFlags: [],
      });
    }

    const insights = await generateInsights({ expenses, income, budgets, goals });

    return res.status(200).json(insights);
  } catch (err) {
    console.error('Get insights error:', err);
    return res.status(500).json({ error: 'Failed to generate insights' });
  }
}

module.exports = { getInsights };
