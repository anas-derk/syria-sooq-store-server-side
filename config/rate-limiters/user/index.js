const { RateLimiterRedis } = require("rate-limiter-flexible");

const redis = require("../../../config/redis");

const userInfoRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "user_info",
    points: 60,
    duration: 60
});

const userUpdateRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "user_update",
    points: 10,
    duration: 600,
    blockDuration: 1800
});

const changeProfileImageRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "profile_image",
    points: 5,
    duration: 600,
    blockDuration: 1800
});

module.exports = {
    userInfoRateLimiter,
    userUpdateRateLimiter,
    changeProfileImageRateLimiter,
};