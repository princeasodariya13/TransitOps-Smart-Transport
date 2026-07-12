const prisma = require('../config/prisma');

const getDashboardStats = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [
            activeFleet,
            inShop,
            totalVehicles,
            pendingTripsCount,
            monthlyTrips,
            monthlyMnt,
            monthlyFuel,
            monthlyExpensesData,
            recentTrips,
            recentMnt,
            recentFuel,
        ] = await Promise.all([
            prisma.vehicle.count({ where: { status: 'ON_TRIP', OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
            prisma.vehicle.count({ where: { status: 'IN_SHOP', OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
            prisma.vehicle.count({ where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
            prisma.trip.count({ where: { status: 'DRAFT' } }),
            prisma.trip.findMany({ where: { status: 'COMPLETED', updatedAt: { gte: startOfMonth } } }),
            prisma.maintenance.findMany({ where: { date: { gte: startOfMonth } } }),
            prisma.fuelLog.findMany({ where: { date: { gte: startOfMonth } } }),
            prisma.expense.findMany({ where: { date: { gte: startOfMonth } } }),
            prisma.trip.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: { select: { name: true, licensePlate: true } } },
            }),
            prisma.maintenance.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: { select: { name: true } } },
            }),
            prisma.fuelLog.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: { select: { name: true } } },
            }),
        ]);

        const utilization = totalVehicles > 0 ? (activeFleet / totalVehicles) * 100 : 0;
        const monthlyRevenue = monthlyTrips.reduce((s, t) => s + (t.revenue || 0), 0);
        const monthlyExpenses =
            monthlyMnt.reduce((s, m) => s + (m.cost || 0), 0) +
            monthlyFuel.reduce((s, f) => s + (f.cost || 0), 0) +
            monthlyExpensesData.reduce((s, e) => s + (e.cost || 0), 0);

        const activities = [
            ...recentTrips.map(t => ({
                id: t.id,
                type: 'TRIP',
                title: `Trip ${t.status}`,
                description: `${t.vehicle?.name || 'Asset'} - ${t.origin || 'N/A'} to ${t.destination || 'N/A'}`,
                date: t.updatedAt,
                amount: t.status === 'COMPLETED' ? `+₹${t.revenue?.toLocaleString()}` : null,
            })),
            ...recentMnt.map(m => ({
                id: m.id,
                type: 'MAINTENANCE',
                title: 'Service Logged',
                description: `${m.vehicle?.name || 'Asset'} - ${m.description}`,
                date: m.date,
                amount: `-₹${m.cost?.toLocaleString()}`,
            })),
            ...recentFuel.map(f => ({
                id: f.id,
                type: 'FUEL',
                title: 'Fuel Refill',
                description: `${f.vehicle?.name || 'Asset'} - ${f.liters}L refilled`,
                date: f.date,
                amount: `-₹${f.cost?.toLocaleString()}`,
            })),
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8);

        res.json({
            success: true,
            data: {
                activeFleet,
                inShop,
                utilization: utilization.toFixed(1),
                pendingTrips: pendingTripsCount,
                totalVehicles,
                monthlyRevenue,
                monthlyExpenses,
                activities,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getVehicleAnalytics = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({ where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } });

        const analytics = await Promise.all(
            vehicles.map(async v => {
                const [trips, maintenances, fuelLogs, expenses] = await Promise.all([
                    prisma.trip.findMany({ where: { vehicleId: v.id } }),
                    prisma.maintenance.findMany({ where: { vehicleId: v.id } }),
                    prisma.fuelLog.findMany({ where: { vehicleId: v.id } }),
                    prisma.expense.findMany({ where: { vehicleId: v.id } }),
                ]);

                const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
                const totalMaintenanceCost = maintenances.reduce((sum, log) => sum + log.cost, 0);
                const totalExpenseCost = expenses.reduce((sum, log) => sum + log.cost, 0);
                const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
                const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost;

                const roi =
                    v.acquisitionCost > 0
                        ? ((totalRevenue - totalOperationalCost) / v.acquisitionCost) * 100
                        : 0;

                const totalKms = trips.reduce((sum, trip) => {
                    if (trip.endOdometer && trip.startOdometer) {
                        return sum + (trip.endOdometer - trip.startOdometer);
                    }
                    return sum;
                }, 0);

                const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
                const fuelEfficiency = totalLiters > 0 ? totalKms / totalLiters : 0;

                return {
                    id: v.id,
                    name: v.name,
                    licensePlate: v.licensePlate,
                    roi: roi.toFixed(1),
                    fuelEfficiency: fuelEfficiency.toFixed(1),
                    totalOperationalCost,
                    totalRevenue,
                    costPerKm: totalKms > 0 ? (totalOperationalCost / totalKms).toFixed(2) : 0,
                };
            })
        );

        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const exportVehicleAnalyticsCSV = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({ where: { OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } });

        const analytics = await Promise.all(
            vehicles.map(async v => {
                const [trips, maintenances, fuelLogs, expenses] = await Promise.all([
                    prisma.trip.findMany({ where: { vehicleId: v.id } }),
                    prisma.maintenance.findMany({ where: { vehicleId: v.id } }),
                    prisma.fuelLog.findMany({ where: { vehicleId: v.id } }),
                    prisma.expense.findMany({ where: { vehicleId: v.id } }),
                ]);

                const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
                const totalMaintenanceCost = maintenances.reduce((sum, log) => sum + log.cost, 0);
                const totalExpenseCost = expenses.reduce((sum, log) => sum + log.cost, 0);
                const totalRevenue = trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
                const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalExpenseCost;

                const roi =
                    v.acquisitionCost > 0
                        ? ((totalRevenue - totalOperationalCost) / v.acquisitionCost) * 100
                        : 0;

                const totalKms = trips.reduce((sum, trip) => {
                    if (trip.endOdometer && trip.startOdometer) {
                        return sum + (trip.endOdometer - trip.startOdometer);
                    }
                    return sum;
                }, 0);

                const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
                const fuelEfficiency = totalLiters > 0 ? totalKms / totalLiters : 0;
                const costPerKm = totalKms > 0 ? (totalOperationalCost / totalKms).toFixed(2) : 0;

                return {
                    name: v.name,
                    licensePlate: v.licensePlate,
                    roi: roi.toFixed(1),
                    fuelEfficiency: fuelEfficiency.toFixed(1),
                    totalOperationalCost,
                    totalRevenue,
                    costPerKm,
                };
            })
        );

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="vehicle-analytics.csv"');

        let csv = 'Name,License Plate,ROI (%),Fuel Efficiency (km/L),Total Operational Cost,Total Revenue,Cost Per Km\n';
        analytics.forEach(row => {
            csv += `"${row.name}","${row.licensePlate}",${row.roi},${row.fuelEfficiency},${row.totalOperationalCost},${row.totalRevenue},${row.costPerKm}\n`;
        });

        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getDashboardStats, getVehicleAnalytics, exportVehicleAnalyticsCSV };
