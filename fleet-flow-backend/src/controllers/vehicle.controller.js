const prisma = require('../config/prisma');
const { generateUID } = require('../utils/idGenerator');

const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await prisma.vehicle.findFirst({
            where: { id, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
        });
        if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });
        res.json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createVehicle = async (req, res) => {
    try {
        const { name, licensePlate, type, maxCapacity, odometer, acquisitionCost } = req.body;

        const existing = await prisma.vehicle.findUnique({ where: { licensePlate } });
        if (existing) {
            return res.status(400).json({ success: false, error: 'License plate already exists' });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                uid: generateUID('VEH'),
                name,
                licensePlate,
                type,
                maxCapacity: Number(maxCapacity),
                odometer: Number(odometer),
                acquisitionCost: Number(acquisitionCost),
            },
        });

        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const vehicle = await prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle) return res.status(404).json({ success: false, error: 'Vehicle not found' });

        // Enforce Status Rules
        if (data.status && data.status !== vehicle.status) {
            const allowedManual = {
                AVAILABLE: ['RETIRED'],
                RETIRED: ['AVAILABLE'],
            };
            const allowed = allowedManual[vehicle.status] || [];
            if (!allowed.includes(data.status)) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot manually set status to ${data.status}. This status is managed by Trip/Maintenance modules.`,
                });
            }
        }

        const updateData = {};
        if (data.name) updateData.name = data.name;
        if (data.licensePlate) updateData.licensePlate = data.licensePlate;
        if (data.type) updateData.type = data.type;
        if (data.maxCapacity !== undefined) updateData.maxCapacity = Number(data.maxCapacity);
        if (data.odometer !== undefined) updateData.odometer = Number(data.odometer);
        if (data.acquisitionCost !== undefined) updateData.acquisitionCost = Number(data.acquisitionCost);
        if (data.status) updateData.status = data.status;

        const updated = await prisma.vehicle.update({ where: { id }, data: updateData });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vehicle.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'RETIRED' },
        });
        res.json({ success: true, message: 'Vehicle soft-deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
