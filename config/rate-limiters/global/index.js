const { RateLimiterRedis } = require("rate-limiter-flexible");

const redis = require("../../../config/redis");

const globalRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "global",
    points: 120,
    duration: 60
});

module.exports = {
    globalRateLimiter,
};