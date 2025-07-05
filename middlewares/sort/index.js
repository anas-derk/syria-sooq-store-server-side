const { getResponseObject } = require("../../helpers/responses");

const { SORT_METHODS, SORT_TYPE } = require("../../constants/sort");

function validateSortMethod(sortBy, res, nextFunc, errorMsg = "Sorry, Please Send Valid Sort Method ( 'postOfDate' Or 'price' or 'numberOfOrders' ) !!") {
    if (!SORT_METHODS.includes(sortBy)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateSortType(sortType, res, nextFunc, errorMsg = "Sorry, Please Send Valid Sort Type ( '-1' For Descending Sort Or '1' For Ascending Sort ) !!") {
    if (!SORT_TYPE.includes(sortType)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateSortMethod,
    validateSortType
}