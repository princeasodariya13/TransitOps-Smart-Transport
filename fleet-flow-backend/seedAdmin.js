// ============================================================
//  FleetFlow — Admin Seed Script
//  Run: node seedAdmin.js
// ============================================================
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
    const email    = 'admin@gmail.com';
    const password = 'admin@123';
    const name     = 'System Admin';
    const role     = 'FLEET_MANAGER';

    console.log('🌱  FleetFlow Admin Seeder');
    console.log('──────────────────────────');

    try {
        // ── 1. Remove every existing user with this email (clean slate) ──
        const deleted = await prisma.user.deleteMany({ where: { email } });
        if (deleted.count > 0) {
            console.log(`🗑️   Removed ${deleted.count} existing user(s) with email: ${email}`);
        }

        // ── 2. Hash the password ──────────────────────────────────────────
        const hashedPassword = await bcrypt.hash(password, 12);

        // ── 3. Create the admin user ──────────────────────────────────────
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role },
        });

        console.log('✅  Admin user created successfully!');
        console.log('');
        console.log('   📧  Email   :', email);
        console.log('   🔑  Password:', password);
        console.log('   🎭  Role    :', role);
        console.log('   🆔  DB ID   :', user.id);
        console.log('');
        console.log('👉  You can now log in at http://localhost:5173/login');

    } catch (error) {
        console.error('❌  Seed failed:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
