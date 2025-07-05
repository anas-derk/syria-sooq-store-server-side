const { USER_TYPES } = require("../../constants/users");

const { getResponseObject } = require("../../helpers/responses");

function validateUserType(userType, res, nextFunc, errorMsg = "Sorry, Please Send Valid User Type !!") {
    if (!USER_TYPES.includes(userType)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateUserType,
}