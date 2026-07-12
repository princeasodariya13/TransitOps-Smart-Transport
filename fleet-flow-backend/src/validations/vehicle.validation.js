const { z } = require('zod');

const createVehicleSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        licensePlate: z.string().min(1, "License plate is required"),
        type: z.enum(['TRUCK', 'VAN', 'MOTORCYCLE']),
        maxCapacity: z.union([z.number(), z.string()]).transform(val => Number(val)),
        odometer: z.union([z.number(), z.string()]).transform(val => Number(val)),
        acquisitionCost: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
    }),
});

const updateVehicleSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        licensePlate: z.string().min(1).optional(),
        type: z.enum(['TRUCK', 'VAN', 'MOTORCYCLE']).optional(),
        maxCapacity: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        odometer: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        acquisitionCost: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional(),
    }),
});

module.exports = { createVehicleSchema, updateVehicleSchema };
