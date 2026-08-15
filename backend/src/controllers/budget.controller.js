const prisma = require('../config/prisma');

async function createBudget(req, res) {
  try {
    const { category, limit, period } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ error: 'Category and limit are required' });
    }

    const budget = await prisma.budget.create({
      data: {
        userId: req.userId,
        category,
        limit,
        period: period || 'monthly',
      },
    });

    return res.status(201).json({ budget });
  } catch (err) {
    console.error('Create budget error:', err);
    return res.status(500).json({ error: 'Failed to create budget' });
  }
}

async function getBudgets(req, res) {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ budgets });
  } catch (err) {
    console.error('Get budgets error:', err);
    return res.status(500).json({ error: 'Failed to fetch budgets' });
  }
}

async function updateBudget(req, res) {
  try {
    const existing = await prisma.budget.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const { category, limit, period } = req.body;

    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: {
        ...(category !== undefined && { category }),
        ...(limit !== undefined && { limit }),
        ...(period !== undefined && { period }),
      },
    });

    return res.status(200).json({ budget });
  } catch (err) {
    console.error('Update budget error:', err);
    return res.status(500).json({ error: 'Failed to update budget' });
  }
}

async function deleteBudget(req, res) {
  try {
    const existing = await prisma.budget.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await prisma.budget.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: 'Budget deleted' });
  } catch (err) {
    console.error('Delete budget error:', err);
    return res.status(500).json({ error: 'Failed to delete budget' });
  }
}

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget };
