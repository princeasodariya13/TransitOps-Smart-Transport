const prisma = require('../config/prisma');

const runMaintenanceStatusJob = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Auto-lock vehicles that have maintenance scheduled for today
        const todayMaintenances = await prisma.maintenance.findMany({
            where: { date: { gte: today, lt: tomorrow } },
            select: { vehicleId: true },
        });

        if (todayMaintenances.length > 0) {
            const vehicleIds = todayMaintenances.map(m => m.vehicleId);
            await prisma.vehicle.updateMany({
                where: { id: { in: vehicleIds }, status: 'AVAILABLE' },
                data: { status: 'IN_SHOP' },
            });
            console.log(`[Job] Locked ${vehicleIds.length} vehicles for maintenance today.`);
        }
    } catch (error) {
        console.error('[Job] Error running maintenance status job:', error);
    }
};

const startMaintenanceJob = () => {
    // Run immediately on startup
    runMaintenanceStatusJob();
    
    // Run every hour
    setInterval(runMaintenanceStatusJob, 1000 * 60 * 60);
};

module.exports = startMaintenanceJob;
