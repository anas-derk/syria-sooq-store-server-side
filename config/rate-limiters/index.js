const authRateLimiters = require("./auth");

const globalRateLimiters = require("./global");

const otpRateLimiters = require("./otp");

const userRateLimiters = require("./user");

module.exports = {
    authRateLimiters,
    globalRateLimiters,
    otpRateLimiters,
    userRateLimiters
};