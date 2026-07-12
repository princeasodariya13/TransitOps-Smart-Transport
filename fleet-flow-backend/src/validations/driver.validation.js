const { z } = require('zod');

const createDriverSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        licenseExpiry: z.string().or(z.date()),
        phone: z.string().min(1, "Phone is required"),
    }),
});

const updateDriverSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        licenseNumber: z.string().min(1).optional(),
        licenseExpiry: z.string().or(z.date()).optional(),
        phone: z.string().min(1).optional(),
        status: z.enum(['ON_DUTY', 'OFF_DUTY', 'ON_TRIP', 'SUSPENDED']).optional(),
        safetyScore: z.union([z.number(), z.string()]).transform(val => Number(val)).optional(),
    }),
});

module.exports = { createDriverSchema, updateDriverSchema };
