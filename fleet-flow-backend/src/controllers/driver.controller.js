const prisma = require('../config/prisma');
const { generateUID } = require('../utils/idGenerator');

const getAllDrivers = async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: drivers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getDriverById = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await prisma.driver.findUnique({ where: { id } });
        if (!driver) return res.status(404).json({ success: false, error: 'Driver not found' });
        res.json({ success: true, data: driver });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createDriver = async (req, res) => {
    try {
        const { name, licenseNumber, licenseExpiry, category } = req.body;

        const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
        if (existing) {
            return res.status(400).json({ success: false, error: 'License number already exists' });
        }

        const driver = await prisma.driver.create({
            data: {
                uid: generateUID('DRV'),
                name,
                licenseNumber,
                licenseExpiry: new Date(licenseExpiry),
                category,
            },
        });

        res.status(201).json({ success: true, data: driver });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { licenseExpiry, ...rest } = req.body;

        const updateData = { ...rest };
        if (licenseExpiry) updateData.licenseExpiry = new Date(licenseExpiry);
        if (rest.safetyScore !== undefined) updateData.safetyScore = Number(rest.safetyScore);

        const driver = await prisma.driver.update({ where: { id }, data: updateData });
        res.json({ success: true, data: driver });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await prisma.driver.findUnique({ where: { id } });
        if (!driver) return res.status(404).json({ success: false, error: 'Driver not found' });

        if (driver.status === 'ON_TRIP') {
            return res.status(400).json({ success: false, error: 'Cannot remove a driver who is currently on a trip' });
        }

        await prisma.driver.delete({ where: { id } });
        res.json({ success: true, message: 'Driver removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getAllDrivers, getDriverById, createDriver, updateDriver, deleteDriver };
