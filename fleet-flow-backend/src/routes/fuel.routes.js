const express = require('express');
const {
    logFuel,
    updateFuelLog,
    deleteFuelLog,
    getAllFuelLogs
} = require('../controllers/fuel.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { logFuelSchema, updateFuelSchema } = require('../validations/fuel.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', getAllFuelLogs);
router.post('/', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(logFuelSchema), logFuel);
router.put('/:id', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(updateFuelSchema), updateFuelLog);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteFuelLog);

module.exports = router;
