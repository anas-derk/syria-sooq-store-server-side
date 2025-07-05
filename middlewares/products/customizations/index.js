const { getResponseObject } = require("../../helpers/responses");

function validateSize(size, res, nextFunc, errorMsg = "Sorry, Please Send Valid Size ( ['s','m', 'l', 'xl', 'xxl', 'xxxl', '4xl'] ) !!") {
    if (!['s', 'm', 'l', 'xl', 'xxl', 'xxxl', '4xl'].includes(size)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateWeightUnit(unit, res, nextFunc, errorMsg = "Sorry, Please Send Weight Unit ( ['gr','kg'] ) !!") {
    if (!["gr", "kg"].includes(unit)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateDimentionsUnit(unit, res, nextFunc, errorMsg = "Sorry, Please Send Dimentions Unit ( ['cm', 'm', 'cm2', 'm2'] ) !!") {
    if (!["cm", "m", "cm2", "m2"].includes(unit)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateSize,
    validateWeightUnit,
    validateDimentionsUnit
}