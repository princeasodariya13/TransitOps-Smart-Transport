const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, name: true },
        });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid token. User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token.' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user.role === 'ADMIN') {
            return next();
        }
        if (!roles.includes(req.user.role)) {
            console.warn(`[Auth] Access denied for ${req.user.email}. Role: ${req.user.role}, Required: ${roles.join(', ')}`);
            return res.status(403).json({ success: false, error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
