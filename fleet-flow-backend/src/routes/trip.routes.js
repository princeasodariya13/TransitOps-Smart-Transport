const express = require('express');
const {
    createTrip,
    dispatchTrip,
    completeTrip,
    updateTrip,
    cancelTrip,
    deleteTrip,
    getAllTrips
} = require('../controllers/trip.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createTripSchema, updateTripSchema, completeTripSchema } = require('../validations/trip.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', getAllTrips);
router.post('/', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(createTripSchema), createTrip);
router.put('/:id', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(updateTripSchema), updateTrip);
router.put('/:id/dispatch', authorize('FLEET_MANAGER', 'DISPATCHER'), dispatchTrip);
router.put('/:id/complete', authorize('FLEET_MANAGER', 'DISPATCHER'), validate(completeTripSchema), completeTrip);
router.put('/:id/cancel', authorize('FLEET_MANAGER', 'DISPATCHER'), cancelTrip);
router.delete('/:id', authorize('FLEET_MANAGER'), deleteTrip);

module.exports = router;
