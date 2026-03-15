const {
    loginRateLimiter,
    signupRateLimiter,
    forgotPasswordRateLimiter,
    resetPasswordRateLimiter
} = require("../../../config/rate-limiters/auth");

const loginRateLimitMiddleware = async (req, res, next) => {
    const email = req.body?.email;
    const mobilePhone = req.body?.mobilePhone;
    const key = `${req.ip}_${email ?? mobilePhone}`;
    try {
        await loginRateLimiter.consume(key);
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

const signupRateLimitMiddleware = async (req, res, next) => {
    const email = req.body?.email;
    const mobilePhone = req.body?.mobilePhone;
    const key = `${req.ip}_${email ?? mobilePhone}`;
    try {
        await signupRateLimiter.consume(key);
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

const forgotPasswordRateLimitMiddleware = async (req, res, next) => {
    const email = req.body?.email;
    const mobilePhone = req.body?.mobilePhone;
    const key = `${req.ip}_${email ?? mobilePhone}`;
    try {
        await forgotPasswordRateLimiter.consume(key);
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

const resetPasswordRateLimitMiddleware = async (req, res, next) => {
    const session = req.body?.session;
    const key = `${req.ip}_${session}`;
    try {
        await resetPasswordRateLimiter.consume(key);
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
    loginRateLimitMiddleware,
    signupRateLimitMiddleware,
    forgotPasswordRateLimitMiddleware,
    resetPasswordRateLimitMiddleware
};