const { getResponseObject } = require("../../../helpers/responses");
const customizationsConstants = require("../../../constants/products/customizations");

function validateSize(size, res, nextFunc, errorMsg = "Sorry, Please Send Valid Size ( ['s','m', 'l', 'xl', 'xxl', 'xxxl', '4xl'] ) !!") {
    if (!customizationsConstants.PRODUCT_SIZE.includes(size)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateWeightUnit(unit, res, nextFunc, errorMsg = "Sorry, Please Send Weight Unit ( ['gr','kg'] ) !!") {
    if (!customizationsConstants.WEIGHT_UNIT.includes(unit)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateDimentionsUnit(unit, res, nextFunc, errorMsg = "Sorry, Please Send Dimentions Unit ( ['cm', 'm', 'cm2', 'm2'] ) !!") {
    if (!customizationsConstants.DISTINATION_UNIT.includes(unit)) {
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