const { rateLimit } = require("express-rate-limit");

const sendingVerificationCodeLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: () => {
        return {
            msg: "Sorry, This Email Has Been Blocked From Receiving Code Messages For 24 Hours Due To Exceeding The Maximum Number Of Resend Attempts !!",
            error: true,
            data: {},
        }
    }
});

function sendingVerificationCodeLimiterMiddleware(req, res, next) {
    sendingVerificationCodeLimiter(req, res, next);
}

module.exports = {
    sendingVerificationCodeLimiterMiddleware,
}