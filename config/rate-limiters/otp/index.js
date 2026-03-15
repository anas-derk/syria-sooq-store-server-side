const { RateLimiterRedis } = require("rate-limiter-flexible");

const redis = require("../../../config/redis");

const sendOtpRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "otp",
    points: 3,
    duration: 60
});

const verifyOtpRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "verify_otp",
    points: 3,
    duration: 300,
    blockDuration: 900
});

module.exports = {
    sendOtpRateLimiter,
    verifyOtpRateLimiter,
};