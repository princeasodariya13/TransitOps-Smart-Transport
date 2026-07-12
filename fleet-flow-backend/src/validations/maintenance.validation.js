const { z } = require('zod');

const logMaintenanceSchema = z.object({
    body: z.object({
        vehicleId: z.string().min(1, "Vehicle is required"),
        description: z.string().min(1, "Description is required"),
        cost: z.union([z.number(), z.string()]).transform(val => Number(val)),
        date: z.string().or(z.date()).optional(),
    }),
});

const updateMaintenanceSchema = z.object({
    body: z.object({
        vehicleId: z.string().optional(),
        description: z.string().optional(),
        cost: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
        date: z.string().or(z.date()).optional(),
    }),
});

module.exports = { logMaintenanceSchema, updateMaintenanceSchema };
