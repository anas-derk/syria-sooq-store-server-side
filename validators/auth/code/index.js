const { CODE_LENGTH } = require("../../../constants/verification_code");

function isValidCode(code) {
    return code === CODE_LENGTH;
}

module.exports = {
    isValidCode
}