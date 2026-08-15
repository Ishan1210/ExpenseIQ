const { PrismaClient } = require('@prisma/client');

// Singleton pattern: prevents multiple PrismaClient instances during
// nodemon hot-reload in dev, which would exhaust the DB connection pool.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
