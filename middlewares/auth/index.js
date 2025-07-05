const { getResponseObject } = require("../../helpers/responses");

const { verify } = require("jsonwebtoken");

const { emailValidator, mobilePhoneValidator, passwordValidator, codeValidator } = require("../../validators/auth");

const { TYPES_OF_USE_VERIFICATION_CODE } = require("../../constants/verification_code");

function validateJWT(req, res, next) {
    const token = req.headers.authorization;
    verify(token, process.env.SECRET_KEY, async (err, decode) => {
        if (err) {
            res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
            return;
        }
        req.data = decode;
        next();
    });
}

function validateEmail(email, res, nextFunc, errorMsg = "Sorry, Please Send Valid Email !!") {
    if (!emailValidator.isValidEmail(email)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateMobilePhone(mobilePhone, res, nextFunc, errorMsg = "Sorry, Please Send Valid Mobile Phone !!") {
    if (!mobilePhoneValidator.isValidMobilePhone(mobilePhone)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validatePassword(password, res, nextFunc, errorMsg = "Sorry, Please Send Valid Password !!") {
    if (!passwordValidator.isValidPassword(password)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateCode(code, res, nextFunc, errorMsg = "Please Send Valid Code !!") {
    if (!codeValidator.isValidCode(code)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateTypeOfUseForCode(typeOfUse, res, nextFunc) {
    if (!TYPES_OF_USE_VERIFICATION_CODE.includes(typeOfUse)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateJWT,
    validateEmail,
    validateMobilePhone,
    validatePassword,
    validateCode,
    validateTypeOfUseForCode,
}