const { z } = require('zod');

const createTripSchema = z.object({
    body: z.object({
        vehicleId: z.string().min(1, "Vehicle is required"),
        driverId: z.string().min(1, "Driver is required"),
        startOdometer: z.union([z.number(), z.string()]).transform(val => Number(val)),
        cargoWeight: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        origin: z.string().min(1, "Origin is required"),
        destination: z.string().min(1, "Destination is required"),
    }),
});

const updateTripSchema = z.object({
    body: z.object({
        vehicleId: z.string().optional(),
        driverId: z.string().optional(),
        startOdometer: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        cargoWeight: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        origin: z.string().optional(),
        destination: z.string().optional(),
    }),
});

const completeTripSchema = z.object({
    body: z.object({
        endOdometer: z.union([z.number(), z.string()]).transform(val => Number(val)),
        fuelConsumed: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        revenue: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
    }),
});

module.exports = { createTripSchema, updateTripSchema, completeTripSchema };
