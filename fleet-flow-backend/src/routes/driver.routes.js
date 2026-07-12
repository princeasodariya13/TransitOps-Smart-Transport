const express = require('express');
const {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
} = require('../controllers/driver.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createDriverSchema, updateDriverSchema } = require('../validations/driver.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', getAllDrivers);
router.get('/:id', getDriverById);
router.post('/', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(createDriverSchema), createDriver);
router.put('/:id', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(updateDriverSchema), updateDriver);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteDriver);

module.exports = router;
