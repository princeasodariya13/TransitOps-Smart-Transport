const prisma = require('../config/prisma');
const { generateUID } = require('../utils/idGenerator');

const logMaintenance = async (req, res) => {
    try {
        const { vehicleId, description, cost, date } = req.body;

        const serviceDate = new Date(date);
        serviceDate.setHours(0, 0, 0, 0);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        if (serviceDate < todayStart) {
            return res.status(400).json({ success: false, error: 'Service date cannot be in the past' });
        }

        const maintenance = await prisma.maintenance.create({
            data: {
                uid: generateUID('MNT'),
                vehicleId,
                description,
                cost: Number(cost),
                date: new Date(date),
            },
        });

        // Lock vehicle immediately if service is TODAY
        const isToday = serviceDate >= todayStart && serviceDate < tomorrowStart;
        if (isToday) {
            await prisma.vehicle.update({
                where: { id: vehicleId },
                data: { status: 'IN_SHOP' },
            });
        }

        res.status(201).json({ success: true, data: maintenance });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const oldLog = await prisma.maintenance.findUnique({ where: { id } });
        if (!oldLog) return res.status(404).json({ success: false, error: 'Maintenance record not found' });

        if (data.date) {
            const serviceDate = new Date(data.date);
            serviceDate.setHours(0, 0, 0, 0);
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            if (serviceDate < todayStart) {
                return res.status(400).json({ success: false, error: 'Service date cannot be in the past' });
            }
        }

        const updateData = {};
        if (data.description) updateData.description = data.description;
        if (data.cost !== undefined) updateData.cost = Number(data.cost);
        if (data.date) updateData.date = new Date(data.date);

        const log = await prisma.maintenance.update({ where: { id }, data: updateData });

        // Update vehicle status based on new date
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        const newDate = new Date(log.date);
        const isNowToday = newDate >= todayStart && newDate < tomorrowStart;

        if (isNowToday) {
            await prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: 'IN_SHOP' } });
        } else {
            const otherToday = await prisma.maintenance.findFirst({
                where: {
                    id: { not: id },
                    vehicleId: log.vehicleId,
                    date: { gte: todayStart, lt: tomorrowStart },
                },
            });
            if (!otherToday) {
                await prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: 'AVAILABLE' } });
            }
        }

        res.json({ success: true, data: log });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await prisma.maintenance.findUnique({ where: { id } });
        if (!log) return res.status(404).json({ success: false, error: 'Maintenance record not found' });

        const vehicleId = log.vehicleId;
        await prisma.maintenance.delete({ where: { id } });

        // Check if we should revert vehicle status
        const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (vehicle && vehicle.status === 'IN_SHOP') {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const tomorrowStart = new Date(todayStart);
            tomorrowStart.setDate(tomorrowStart.getDate() + 1);

            const remainingToday = await prisma.maintenance.findFirst({
                where: { vehicleId, date: { gte: todayStart, lt: tomorrowStart } },
            });

            if (!remainingToday) {
                await prisma.vehicle.update({ where: { id: vehicleId }, data: { status: 'AVAILABLE' } });
            }
        }

        res.json({ success: true, message: 'Maintenance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllMaintenances = async (req, res) => {
    try {
        const logs = await prisma.maintenance.findMany({
            orderBy: { date: 'desc' },
            include: {
                vehicle: { select: { id: true, name: true, licensePlate: true } },
            },
        });
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { logMaintenance, updateMaintenance, deleteMaintenance, getAllMaintenances };
