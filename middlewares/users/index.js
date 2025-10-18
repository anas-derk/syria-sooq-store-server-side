const { USER_TYPES, GENDER } = require("../../constants/users");

const { getResponseObject } = require("../../helpers/responses");

function validateUserType(userType, res, nextFunc, errorMsg = "Sorry, Please Send Valid User Type !!") {
    if (!USER_TYPES.includes(userType)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateGender(gender, res, nextFunc, errorMsg = "Sorry, Please Send Valid Gender !!") {
    if (!GENDER.includes(gender)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateAge(age, res, nextFunc, errorMsg = "Sorry, Please Send Valid Age !!") {
    if (age < 13 || age > 99) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateUserType,
    validateGender,
    validateAge,
}