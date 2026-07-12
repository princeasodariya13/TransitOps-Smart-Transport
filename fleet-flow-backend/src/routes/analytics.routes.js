const express = require('express');
const { getDashboardStats, getVehicleAnalytics, exportVehicleAnalyticsCSV } = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/vehicles', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), getVehicleAnalytics);
router.get('/vehicles/export', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), exportVehicleAnalyticsCSV);

module.exports = router;
