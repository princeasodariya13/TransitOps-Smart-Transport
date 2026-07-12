const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

// ─────────────────────────────────────────────────────────────
//  Helper: sign JWT
// ─────────────────────────────────────────────────────────────
const signToken = (user) =>
    jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

// ─────────────────────────────────────────────────────────────
//  POST /api/auth/register
// ─────────────────────────────────────────────────────────────
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password || !name || !role) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role },
        });

        const token = signToken(user);
        const userPayload = { id: user.id, email: user.email, role: user.role, name: user.name };

        return res.status(201).json({
            success: true,
            data: { user: userPayload, token },
        });
    } catch (error) {
        console.error('[Auth] register error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }

        const token = signToken(user);
        const userPayload = { id: user.id, email: user.email, role: user.role, name: user.name };

        console.log(`[Auth] ✅ Login success: ${user.email} (${user.role})`);

        return res.json({
            success: true,
            data: { user: userPayload, token },
        });
    } catch (error) {
        console.error('[Auth] login error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────
//  GET /api/auth/me   (protected)
// ─────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
    return res.json({
        success: true,
        data: req.user,
    });
};

module.exports = { register, login, getMe };
