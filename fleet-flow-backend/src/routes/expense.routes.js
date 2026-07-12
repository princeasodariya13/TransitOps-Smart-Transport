const express = require('express');
const { logExpense, updateExpense, deleteExpense, getAllExpenses } = require('../controllers/expense.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { logExpenseSchema, updateExpenseSchema } = require('../validations/expense.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', getAllExpenses);
router.post('/', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(logExpenseSchema), logExpense);
router.put('/:id', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(updateExpenseSchema), updateExpense);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteExpense);

module.exports = router;
