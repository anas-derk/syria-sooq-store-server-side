const { getResponseObject } = require("../../helpers/responses");

function validateNumbersIsGreaterThanZero(numbers, res, nextFunc, errorMsgs, defaultMsg = "Sorry, Please Send Valid Number ( Number Must Be Greater Than Zero ) !!") {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] <= 0) {
            res.status(400).json(getResponseObject(errorMsgs[i] ? errorMsgs[i] : defaultMsg, true, {}));
            return;
        }
    }
    nextFunc();
}

function validateNumbersIsNotFloat(numbers, res, nextFunc, errorMsgs, defaultMsg = "Sorry, Please Send Valid Number ( Number Must Be Not Float ) !!") {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 1 !== 0) {
            res.status(400).json(getResponseObject(errorMsgs[i] ? errorMsgs[i] : defaultMsg, true, {}));
            return;
        }
    }
    nextFunc();
}

module.exports = {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat
}