const authRateLimitersMiddlewares = require("./auth");

const otpRateLimitersMiddlewares = require("./otp");

const userRateLimitersMiddlewares = require("./user");

module.exports = {
    authRateLimitersMiddlewares,
    otpRateLimitersMiddlewares,
    userRateLimitersMiddlewares
};