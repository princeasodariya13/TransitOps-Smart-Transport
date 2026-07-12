const prisma = require('../config/prisma');
const { generateUID } = require('../utils/idGenerator');

const logFuel = async (req, res) => {
    try {
        const { vehicleId, tripId, liters, cost, date } = req.body;

        const log = await prisma.fuelLog.create({
            data: {
                uid: generateUID('FUE'),
                vehicleId,
                tripId: tripId || null,
                liters: Number(liters),
                cost: Number(cost),
                date: date ? new Date(date) : new Date(),
            },
        });

        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updateData = {};
        if (data.liters !== undefined) updateData.liters = Number(data.liters);
        if (data.cost !== undefined) updateData.cost = Number(data.cost);
        if (data.date) updateData.date = new Date(data.date);
        if (data.vehicleId) updateData.vehicleId = data.vehicleId;
        if (data.tripId !== undefined) updateData.tripId = data.tripId || null;

        const log = await prisma.fuelLog.update({ where: { id }, data: updateData });
        res.json({ success: true, data: log });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Fuel log not found' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteFuelLog = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.fuelLog.delete({ where: { id } });
        res.json({ success: true, message: 'Fuel log deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Fuel log not found' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllFuelLogs = async (req, res) => {
    try {
        const logs = await prisma.fuelLog.findMany({
            orderBy: { date: 'desc' },
            include: {
                vehicle: { select: { id: true, name: true, licensePlate: true } },
                trip: { select: { id: true, uid: true, origin: true, destination: true } },
            },
        });
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { logFuel, updateFuelLog, deleteFuelLog, getAllFuelLogs };
