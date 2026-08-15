const prisma = require('../config/prisma');

async function createExpense(req, res) {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category are required' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: req.userId,
        amount,
        category,
        description: description || null,
        date: date ? new Date(date) : new Date(),
      },
    });

    return res.status(201).json({ expense });
  } catch (err) {
    console.error('Create expense error:', err);
    return res.status(500).json({ error: 'Failed to create expense' });
  }
}

async function getExpenses(req, res) {
  try {
    const { category, startDate, endDate } = req.query;

    // Build filter dynamically — only include fields the user actually queried with
    const where = { userId: req.userId };
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return res.status(200).json({ expenses });
  } catch (err) {
    console.error('Get expenses error:', err);
    return res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

async function getExpenseById(req, res) {
  try {
    const expense = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    return res.status(200).json({ expense });
  } catch (err) {
    console.error('Get expense error:', err);
    return res.status(500).json({ error: 'Failed to fetch expense' });
  }
}

async function updateExpense(req, res) {
  try {
    const existing = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const { amount, category, description, date } = req.body;

    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
      },
    });

    return res.status(200).json({ expense });
  } catch (err) {
    console.error('Update expense error:', err);
    return res.status(500).json({ error: 'Failed to update expense' });
  }
}

async function deleteExpense(req, res) {
  try {
    const existing = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Delete expense error:', err);
    return res.status(500).json({ error: 'Failed to delete expense' });
  }
}

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
