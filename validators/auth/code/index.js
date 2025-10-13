const { CODE_LENGTH } = require("../../../constants/verification_code");

function isValidCode(code) {
    return code.length === CODE_LENGTH;
}

module.exports = {
    isValidCode
}