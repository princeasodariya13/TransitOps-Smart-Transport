const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Recommended options for a stable Atlas connection
            serverSelectionTimeoutMS: 5000,  // Timeout after 5s if no server found
            socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }

    // Handle disconnection events
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected successfully.');
    });
};

module.exports = connectDB;
