const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const RedisClient = require('./redisClient');


const redisClient = RedisClient.getClient();

redisClient.on('connect', () => {
    console.log('Redis connect');
});

redisClient.on('error', (e) => {
    console.log('Redis Error', e);
});

module.exports = new RedisStore({
    client: redisClient
});