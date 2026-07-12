const prisma = require('../config/prisma');
const { generateUID } = require('../utils/idGenerator');

const createTrip = async (req, res) => {
    try {
        const { vehicleId, driverId, startOdometer, cargoWeight, origin, destination } = req.body;

        const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (!vehicle || vehicle.status !== 'AVAILABLE') {
            return res.status(400).json({ success: false, error: 'Vehicle is not available' });
        }

        if (Number(cargoWeight) > vehicle.maxCapacity) {
            return res.status(400).json({
                success: false,
                error: `Cargo weight (${cargoWeight}kg) exceeds vehicle max capacity (${vehicle.maxCapacity}kg)`,
            });
        }

        const driver = await prisma.driver.findUnique({ where: { id: driverId } });
        if (!driver || driver.status !== 'ON_DUTY') {
            return res.status(400).json({ success: false, error: 'Driver is not on duty' });
        }

        if (new Date(driver.licenseExpiry) < new Date()) {
            return res.status(400).json({
                success: false,
                error: `Driver's license expired on ${new Date(driver.licenseExpiry).toLocaleDateString()}`
            });
        }

        const trip = await prisma.trip.create({
            data: {
                uid: generateUID('TRP'),
                vehicleId,
                driverId,
                startOdometer: Number(startOdometer),
                cargoWeight: Number(cargoWeight),
                origin,
                destination,
            },
        });

        res.status(201).json({ success: true, data: trip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const dispatchTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
        if (trip.status !== 'DRAFT') {
            return res.status(400).json({ success: false, error: 'Trip is not in draft status' });
        }

        // Prisma transaction
        const [updatedTrip] = await prisma.$transaction([
            prisma.trip.update({ where: { id }, data: { status: 'DISPATCHED' } }),
            prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'ON_TRIP' } }),
            prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_TRIP' } }),
        ]);

        res.json({ success: true, message: 'Trip dispatched', data: updatedTrip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const completeTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const { endOdometer, revenue, fuelLiters, fuelCost } = req.body;

        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

        if (Number(endOdometer) < trip.startOdometer) {
            return res.status(400).json({ success: false, error: 'End odometer cannot be less than start odometer' });
        }

        const [updatedTrip] = await prisma.$transaction([
            prisma.trip.update({
                where: { id },
                data: {
                    status: 'COMPLETED',
                    endOdometer: Number(endOdometer),
                    revenue: Number(revenue),
                },
            }),
            prisma.vehicle.update({
                where: { id: trip.vehicleId },
                data: { status: 'AVAILABLE', odometer: Number(endOdometer) },
            }),
            prisma.driver.update({
                where: { id: trip.driverId },
                data: { status: 'ON_DUTY' },
            }),
        ]);

        // Create FuelLog outside transaction
        if (fuelLiters && fuelCost) {
            try {
                await prisma.fuelLog.create({
                    data: {
                        uid: generateUID('FUE'),
                        vehicleId: trip.vehicleId,
                        tripId: trip.id,
                        liters: Number(fuelLiters),
                        cost: Number(fuelCost),
                        date: new Date(),
                    },
                });
            } catch (fuelErr) {
                console.error('FuelLog creation failed during trip completion:', fuelErr.message);
            }
        }

        res.json({ success: true, message: 'Trip completed', data: updatedTrip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

        if (trip.status !== 'DRAFT') {
            return res.status(400).json({ success: false, error: 'Only draft trips can be edited' });
        }

        if (data.cargoWeight || data.vehicleId) {
            const vId = data.vehicleId || trip.vehicleId;
            const weight = Number(data.cargoWeight || trip.cargoWeight);
            const vehicle = await prisma.vehicle.findUnique({ where: { id: vId } });
            if (vehicle && weight > vehicle.maxCapacity) {
                return res.status(400).json({
                    success: false,
                    error: `Cargo weight (${weight}kg) exceeds vehicle max capacity (${vehicle.maxCapacity}kg)`,
                });
            }
        }

        const updateData = {};
        if (data.vehicleId) updateData.vehicleId = data.vehicleId;
        if (data.driverId) updateData.driverId = data.driverId;
        if (data.startOdometer !== undefined) updateData.startOdometer = Number(data.startOdometer);
        if (data.cargoWeight !== undefined) updateData.cargoWeight = Number(data.cargoWeight);
        if (data.origin) updateData.origin = data.origin;
        if (data.destination) updateData.destination = data.destination;

        const updatedTrip = await prisma.trip.update({ where: { id }, data: updateData });
        res.json({ success: true, data: updatedTrip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const cancelTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

        if (!['DRAFT', 'DISPATCHED'].includes(trip.status)) {
            return res.status(400).json({ success: false, error: 'Only DRAFT or DISPATCHED trips can be cancelled' });
        }

        let updatedTrip;
        
        if (trip.status === 'DISPATCHED') {
            const result = await prisma.$transaction([
                prisma.trip.update({ where: { id }, data: { status: 'CANCELLED' } }),
                prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } }),
                prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_DUTY' } }),
            ]);
            updatedTrip = result[0];
        } else {
            updatedTrip = await prisma.trip.update({ where: { id }, data: { status: 'CANCELLED' } });
        }

        res.json({ success: true, message: 'Trip cancelled', data: updatedTrip });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

        await prisma.$transaction(async (tx) => {
            // Free vehicle/driver if trip was dispatched
            if (trip.status === 'DISPATCHED') {
                await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
                await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'ON_DUTY' } });
            }
            // Delete related fuel logs first
            await tx.fuelLog.deleteMany({ where: { tripId: id } });
            // Delete the trip
            await tx.trip.delete({ where: { id } });
        });

        res.json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllTrips = async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                vehicle: { select: { id: true, name: true, licensePlate: true, type: true } },
                driver: { select: { id: true, name: true, licenseNumber: true } },
            },
        });
        res.json({ success: true, data: trips });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createTrip, dispatchTrip, completeTrip, updateTrip, cancelTrip, deleteTrip, getAllTrips };
