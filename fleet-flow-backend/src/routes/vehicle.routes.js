const express = require('express');
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicle.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createVehicleSchema, updateVehicleSchema } = require('../validations/vehicle.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/', authorize('FLEET_MANAGER'), validate(createVehicleSchema), createVehicle);
router.put('/:id', authorize('FLEET_MANAGER'), validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteVehicle);

module.exports = router;
