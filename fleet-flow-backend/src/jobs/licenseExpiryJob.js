const prisma = require('../config/prisma');
const { sendEmail } = require('../services/email.service');

const runLicenseExpiryJob = async () => {
    try {
        console.log('[Job] Running License Expiry Check...');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const expiringDrivers = await prisma.driver.findMany({
            where: {
                licenseExpiry: {
                    lte: thirtyDaysFromNow,
                    gte: today // Only warn about upcoming, let trips block past expiry
                },
                status: {
                    not: 'SUSPENDED'
                }
            }
        });

        if (expiringDrivers.length > 0) {
            console.log(`[Job] Found ${expiringDrivers.length} drivers with upcoming license expiries.`);
            
            // In a real app, this would fetch the actual Fleet Managers' emails from the DB
            // For this implementation, we will alert a configured admin email or log it.
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@fleetflow.com';

            let htmlList = expiringDrivers.map(d => 
                `<li><strong>${d.name}</strong> (License: ${d.licenseNumber}) - Expires on: ${d.licenseExpiry.toDateString()}</li>`
            ).join('');

            const emailHtml = `
                <h2>Action Required: Driver License Expirations</h2>
                <p>The following drivers have licenses expiring within the next 30 days:</p>
                <ul>
                    ${htmlList}
                </ul>
                <p>Please review and update their records to avoid dispatch disruptions.</p>
                <br/>
                <p>- FleetFlow Automated System</p>
            `;

            await sendEmail(adminEmail, '⚠️ Action Required: Upcoming License Expirations', emailHtml);
        } else {
            console.log('[Job] No upcoming driver license expiries found.');
        }

    } catch (error) {
        console.error('[Job] Error running license expiry job:', error);
    }
};

const startLicenseExpiryJob = () => {
    // Run immediately on startup
    runLicenseExpiryJob();
    
    // Run once every 24 hours (86400000 ms)
    setInterval(runLicenseExpiryJob, 24 * 60 * 60 * 1000);
};

module.exports = startLicenseExpiryJob;
