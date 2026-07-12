const { PrismaClient } = require('./node_modules/@prisma/client');
try {
  const prisma = new PrismaClient({ log: ['error'] });
  console.log("PrismaClient initialized successfully!");
} catch (err) {
  console.error("Failed:", err);
}
