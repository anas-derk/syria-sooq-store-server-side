const { getResponseObject } = require("../../helpers/responses");

const { isValidLanguage } = require("../../validators/global/language");

const { globalRateLimiter } = require("../../config/rate-limiters/global");

function validateLanguage(language, res, nextFunc, errorMsg = "Sorry, Please Send Valid Language !!") {
    if (!isValidLanguage(language)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

const globalRateLimitMiddleware = async (req, res, next) => {
    try {
        await globalRateLimiter.consume(req.ip);
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
    validateLanguage,
    globalRateLimitMiddleware
}