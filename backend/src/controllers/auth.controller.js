const prisma = require('../config/prisma');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth.utils');

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken({ userId: user.id });

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Same error for missing user vs wrong password — avoids leaking which emails are registered
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ userId: user.id });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in' });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Get current user error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}

module.exports = { signup, login, getCurrentUser };
