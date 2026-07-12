const prisma = require('../config/prisma');
const { generateUID } = require('../utils/idGenerator');

const logExpense = async (req, res) => {
    try {
        const { vehicleId, tripId, category, description, cost, date } = req.body;

        const expense = await prisma.expense.create({
            data: {
                uid: generateUID('EXP'),
                vehicleId,
                tripId: tripId || null,
                category,
                description,
                cost: Number(cost),
                date: date ? new Date(date) : new Date(),
            },
        });

        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const expense = await prisma.expense.findUnique({ where: { id } });
        if (!expense) return res.status(404).json({ success: false, error: 'Expense not found' });

        const updateData = {};
        if (data.vehicleId) updateData.vehicleId = data.vehicleId;
        if (data.tripId !== undefined) updateData.tripId = data.tripId || null;
        if (data.category) updateData.category = data.category;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.cost !== undefined) updateData.cost = Number(data.cost);
        if (data.date) updateData.date = new Date(data.date);

        const updatedExpense = await prisma.expense.update({ where: { id }, data: updateData });
        res.json({ success: true, data: updatedExpense });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.expense.delete({ where: { id } });
        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: 'desc' },
            include: {
                vehicle: { select: { id: true, name: true, licensePlate: true } },
                trip: { select: { id: true, uid: true, status: true } },
            },
        });
        res.json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { logExpense, updateExpense, deleteExpense, getAllExpenses };
