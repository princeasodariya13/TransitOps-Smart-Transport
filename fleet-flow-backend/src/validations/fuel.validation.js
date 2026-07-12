const { z } = require('zod');

const logFuelSchema = z.object({
    body: z.object({
        vehicleId: z.string().min(1, "Vehicle is required"),
        tripId: z.string().optional(),
        liters: z.union([z.number(), z.string()]).transform(val => Number(val)),
        cost: z.union([z.number(), z.string()]).transform(val => Number(val)),
        date: z.string().or(z.date()).optional(),
    }),
});

const updateFuelSchema = z.object({
    body: z.object({
        vehicleId: z.string().optional(),
        tripId: z.string().optional(),
        liters: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        cost: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        date: z.string().or(z.date()).optional(),
    }),
});

module.exports = { logFuelSchema, updateFuelSchema };
