const prisma = require('../config/prisma');

async function createGoal(req, res) {
  try {
    const { title, targetAmount, deadline } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ error: 'Title and targetAmount are required' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        title,
        targetAmount,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return res.status(201).json({ goal });
  } catch (err) {
    console.error('Create goal error:', err);
    return res.status(500).json({ error: 'Failed to create goal' });
  }
}

async function getGoals(req, res) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ goals });
  } catch (err) {
    console.error('Get goals error:', err);
    return res.status(500).json({ error: 'Failed to fetch goals' });
  }
}

async function updateGoal(req, res) {
  try {
    const existing = await prisma.goal.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const { title, targetAmount, savedAmount, deadline } = req.body;

    const goal = await prisma.goal.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(targetAmount !== undefined && { targetAmount }),
        ...(savedAmount !== undefined && { savedAmount }),
        ...(deadline !== undefined && { deadline: new Date(deadline) }),
      },
    });

    return res.status(200).json({ goal });
  } catch (err) {
    console.error('Update goal error:', err);
    return res.status(500).json({ error: 'Failed to update goal' });
  }
}

async function deleteGoal(req, res) {
  try {
    const existing = await prisma.goal.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.goal.delete({ where: { id: req.params.id } });

    return res.status(200).json({ message: 'Goal deleted' });
  } catch (err) {
    console.error('Delete goal error:', err);
    return res.status(500).json({ error: 'Failed to delete goal' });
  }
}

module.exports = { createGoal, getGoals, updateGoal, deleteGoal };
