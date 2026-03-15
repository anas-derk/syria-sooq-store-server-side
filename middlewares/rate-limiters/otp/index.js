const {
    sendOtpRateLimiter,
    verifyOtpRateLimiter
} = require("../../../config/rate-limiters/otp");

const sendOtpRateLimitMiddleware = async (req, res, next) => {
    const email = req.body?.email;
    const mobilePhone = req.body?.mobilePhone;
    const typeOfUse = req.body?.typeOfUse;
    const key = `${req.ip}_${email ?? mobilePhone}_${typeOfUse}`;
    try {
        await sendOtpRateLimiter.consume(key);
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

const verifyOtpRateLimitMiddleware = async (req, res, next) => {
    const session = req.body?.session;
    const key = `${req.ip}_${session}`;
    try {
        await verifyOtpRateLimiter.consume(key);
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
    sendOtpRateLimitMiddleware,
    verifyOtpRateLimitMiddleware
};