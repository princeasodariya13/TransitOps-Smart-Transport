const { z } = require('zod');

const logExpenseSchema = z.object({
    body: z.object({
        vehicleId: z.string().min(1, "Vehicle is required"),
        tripId: z.string().optional(),
        category: z.enum(['TOLL', 'PARKING', 'FINE', 'OTHER']),
        description: z.string().optional(),
        cost: z.union([z.number(), z.string()]).transform(val => Number(val)),
        date: z.string().or(z.date()).optional(),
    }),
});

const updateExpenseSchema = z.object({
    body: z.object({
        vehicleId: z.string().optional(),
        tripId: z.string().optional(),
        category: z.enum(['TOLL', 'PARKING', 'FINE', 'OTHER']).optional(),
        description: z.string().optional(),
        cost: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        date: z.string().or(z.date()).optional(),
    }),
});

module.exports = { logExpenseSchema, updateExpenseSchema };
