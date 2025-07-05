const { getResponseObject } = require("../../helpers/responses");

function validateName(name, res, nextFunc, errorMsg = "Sorry, Please Send Valid Name !!") {
    if (/^([\u0600-\u06FF\s]+|[a-zA-Z\s]+)$/.test(name)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateColor(color, res, nextFunc, errorMsg = "Sorry, Please Send Valid Color ( Must Be Start To # And In Hexadecimal System ) !!") {
    if (!isValidColor(color)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateColors(colors, res, nextFunc, errorMsgs, defaultMsg = "Sorry, Please Send Valid Color ( Must Be Start To # And In Hexadecimal System ) !!") {
    for (let i = 0; i < colors.length; i++) {
        if (!isValidColor(colors[i])) {
            res.status(400).json(getResponseObject(errorMsgs[i] ? errorMsgs[i] : defaultMsg, true, {}));
            return;
        }
    }
    nextFunc();
}

function validateCity(city, res, nextFunc) {
    if (![
        "lattakia",
        "tartus",
        "homs",
        "hama",
        "idleb",
        "daraa",
        "suwayda",
        "deer-alzoor",
        "raqqa",
        "hasakah",
        "damascus",
        "rif-damascus",
        "aleppo",
        "quneitra"
    ].includes(city)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid City !!", true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateName,
    validateColor,
    validateColors,
    validateCity,
}