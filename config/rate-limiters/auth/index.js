const { RateLimiterRedis } = require("rate-limiter-flexible");

const redis = require("../../../config/redis");

const loginRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "login",
    points: 5,
    duration: 60,
    blockDuration: 300
});

const signupRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "signup",
    points: 3,
    duration: 60,
    blockDuration: 600
});

const forgotPasswordRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "forgot_password",
    points: 3,
    duration: 300,
    blockDuration: 900
});

const resetPasswordRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "reset_password",
    points: 5,
    duration: 300,
    blockDuration: 900
});

module.exports = {
    loginRateLimiter,
    signupRateLimiter,
    forgotPasswordRateLimiter,
    resetPasswordRateLimiter,
};