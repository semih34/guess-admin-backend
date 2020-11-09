const redis = require('redis');
const getClient = () => {
    const db = redis.createClient({
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT,
    });
    db.select(1);
    return db;
};

module.exports.getClient = getClient;