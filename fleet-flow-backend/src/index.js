// Load env variables FIRST
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const prisma = require('./config/prisma');
const startMaintenanceJob = require('./jobs/maintenanceStatusJob');
const startLicenseExpiryJob = require('./jobs/licenseExpiryJob');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Verify Prisma can connect to MongoDB
        await prisma.$connect();
        console.log('✅ Prisma connected to MongoDB Atlas successfully');

        // Start background jobs
        startMaintenanceJob();
        startLicenseExpiryJob();

        // Create HTTP + Socket.IO server
        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true
            }
        });

        // In-memory vehicle location store (use Redis in production)
        const vehicleLocations = new Map();

        io.on('connection', (socket) => {
            console.log(`📡 Socket connected: ${socket.id}`);
            socket.emit('initial_locations', Array.from(vehicleLocations.values()));

            socket.on('update_location', (data) => {
                vehicleLocations.set(data.vehicleId, data);
                socket.broadcast.emit('location_updated', data);
            });

            socket.on('disconnect', () => {
                console.log(`📡 Socket disconnected: ${socket.id}`);
            });
        });

        app.set('io', io);

        // ─── Catch EADDRINUSE cleanly — no unhandled 'error' event crash ───
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`\n❌ Port ${PORT} is already in use.`);
                console.error(`   Stop the conflicting process and restart nodemon.`);
                console.error(`   Quick fix: taskkill /IM node.exe /F\n`);
            } else {
                console.error('Server error:', err);
            }
            process.exit(1);
        });

        server.listen(PORT, () => {
            console.log(`🚛 FleetFlow API running on http://localhost:${PORT}`);
            console.log(`📡 WebSocket tracking enabled`);
            console.log(`📦 Environment: ${process.env.NODE_ENV}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Graceful shutdown (Ctrl+C)
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Prisma disconnected. Server shut down gracefully.');
    process.exit(0);
});

// Graceful shutdown (system signal)
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// Nodemon sends SIGUSR2 to restart — clean up before it kills the process
process.once('SIGUSR2', async () => {
    await prisma.$disconnect();
    process.kill(process.pid, 'SIGUSR2');
});

startServer();
