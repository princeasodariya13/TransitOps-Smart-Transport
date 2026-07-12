const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        
        const existing = await prisma.user.findUnique({ where: { email: 'admin@gmail.com' } });
        
        if (existing) {
            console.log('User already exists, updating role to ADMIN...');
            await prisma.user.update({
                where: { email: 'admin@gmail.com' },
                data: { role: 'ADMIN', password: hashedPassword }
            });
            console.log('Admin user updated!');
        } else {
            await prisma.user.create({
                data: {
                    name: 'System Admin',
                    email: 'admin@gmail.com',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('Admin user created successfully!');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
