const prisma = require('../config/prisma');

async function createIncome(req, res) {
  try {
    const { amount, source, date } = req.body;

    if (!amount || !source) {
      return res.status(400).json({ error: 'Amount and source are required' });
    }

    const income = await prisma.income.create({
      data: {
        userId: req.userId,
        amount,
        source,
        date: date ? new Date(date) : new Date(),
      },
    });

    return res.status(201).json({ income });
  } catch (err) {
    console.error('Create income error:', err);
    return res.status(500).json({ error: 'Failed to create income' });
  }
}

async function getIncomes(req, res) {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    });

    return res.status(200).json({ incomes });
  } catch (err) {
    console.error('Get incomes error:', err);
    return res.status(500).json({ error: 'Failed to fetch incomes' });
  }
}

async function updateIncome(req, res) {
  try {
    const existing = await prisma.income.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Income not found' });
    }

    const { amount, source, date } = req.body;

    const income = await prisma.income.update({
      where: { id: req.params.id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(source !== undefined && { source }),
        ...(date !== undefined && { date: new Date(date) }),
      },
    });

    return res.status(200).json({ income });
  } catch (err) {
    console.error('Update income error:', err);
    return res.status(500).json({ error: 'Failed to update income' });
  }
}

async function deleteIncome(req, res) {
  try {
    const existing = await prisma.income.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Income not found' });
    }

    await prisma.income.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: 'Income deleted' });
  } catch (err) {
    console.error('Delete income error:', err);
    return res.status(500).json({ error: 'Failed to delete income' });
  }
}

module.exports = { createIncome, getIncomes, updateIncome, deleteIncome };
