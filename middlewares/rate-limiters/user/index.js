const {
    userInfoRateLimiter,
    userUpdateRateLimiter,
    changeProfileImageRateLimiter,
    changePasswordRateLimiter,
    change2faRateLimiter,
} = require("../../../config/rate-limiters/user");

const userInfoRateLimitMiddleware = async (req, res, next) => {
    const key = req?.data?._id || req.ip;
    try {
        await userInfoRateLimiter.consume(key);
        next();
    } catch (rejRes) {
        res.status(429).json({
            msg: "Too many requests !!",
            error: true,
            data: {
                retryAfter: Math.round(rejRes.msBeforeNext / 1000)
            }
        });
    }
};

const userUpdateRateLimitMiddleware = async (req, res, next) => {
    const key = req?.data?._id || req.ip;
    try {
        await userUpdateRateLimiter.consume(key);
        next();
    } catch (rejRes) {
        res.status(429).json({
            msg: "Too many requests !!",
            error: true,
            data: {
                retryAfter: Math.round(rejRes.msBeforeNext / 1000)
            }
        });
    }
};

const changeProfileImageLimiterRateLimitMiddleware = async (req, res, next) => {
    const key = req?.data?._id || req.ip;
    try {
        await changeProfileImageRateLimiter.consume(key);
        next();
    } catch (rejRes) {
        res.status(429).json({
            msg: "Too many requests !!",
            error: true,
            data: {
                retryAfter: Math.round(rejRes.msBeforeNext / 1000)
            }
        });
    }
};

module.exports = {
    userInfoRateLimitMiddleware,
    userUpdateRateLimitMiddleware,
    changeProfileImageLimiterRateLimitMiddleware,
};