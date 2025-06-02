const { getResponseObject, isEmail, isValidPassword, isValidLanguage, isValidMobilePhone, isValidColor } = require("../global/functions");

const { verify } = require("jsonwebtoken");

function validateJWT(req, res, next) {
    const token = req.headers.authorization;
    verify(token, process.env.secretKey, async (err, decode) => {
        if (err) {
            res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
            return;
        }
        req.data = decode;
        next();
    });
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

function validateEmail(email, res, nextFunc, errorMsg = "Sorry, Please Send Valid Email !!") {
    if (!isEmail(email)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateMobilePhone(mobilePhone, res, nextFunc, errorMsg = "Sorry, Please Send Valid Mobile Phone !!") {
    if (!isValidMobilePhone(mobilePhone)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateUserType(userType, res, nextFunc, errorMsg = "Sorry, Please Send Valid User Type !!") {
    if (userType !== "user" && userType !== "admin") {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validatePassword(password, res, nextFunc, errorMsg = "Sorry, Please Send Valid Password !!") {
    if (!isValidPassword(password)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateCode(code, res, nextFunc, errorMsg = "Please Send Valid Code !!") {
    if (code.length !== 4) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateLanguage(language, res, nextFunc, errorMsg = "Sorry, Please Send Valid Language !!") {
    if (!isValidLanguage(language)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

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

function validateName(name, res, nextFunc, errorMsg = "Sorry, Please Send Valid Name !!") {
    if (!name.match(/^([\u0600-\u06FF\s]+|[a-zA-Z\s]+)$/)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateIsNotExistDublicateProductId(products, res, nextFunc) {
    let seenProductIds = {};
    for (let product of products) {
        if (seenProductIds[product.productId]) {
            res.status(400).json(getResponseObject(`Sorry, Dublicate Product Id: ${product.productId} !!`, true, {}));
            return;
        }
        seenProductIds[product.productId] = true;
    }
    nextFunc();
}

function validateCheckoutStatus(checkoutStatus, res, nextFunc, errorMsg = "Sorry, Please Send Valid Checkout Status ( 'Checkout Incomplete' Or 'Checkout Successfull' ) !!") {
    if (!["Checkout Incomplete", "Checkout Successfull"].includes(checkoutStatus)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateSortMethod(sortBy, res, nextFunc, errorMsg = "Sorry, Please Send Valid Sort Method ( 'postOfDate' Or 'price' or 'numberOfOrders' ) !!") {
    if (!["postOfDate", "price", "numberOfOrders"].includes(sortBy)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateSortType(sortType, res, nextFunc, errorMsg = "Sorry, Please Send Valid Sort Type ( '-1' For Descending Sort Or '1' For Ascending Sort ) !!") {
    if (!["1", "-1"].includes(sortType)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateIsExistErrorInFiles(req, res, next) {
    const uploadError = req.uploadError;
    if (uploadError) {
        res.status(400).json(getResponseObject(uploadError, true, {}));
        return;
    }
    next();
}

function validateShippingMethod(req, res, next) {
    const shippingMethod = req.body.shippingMethod;
    if (!["normal", "ubuyblues"].includes(shippingMethod.forLocalProducts)) {
        res.status(400).json(getResponseObject("Sorry Shipping Method For Local Products Is Not Valid ( Please Send 'normal' or 'ubuyblues' Value )", true, {}));
        return;
    }
    if (!["normal", "fast"].includes(shippingMethod.forInternationalProducts)) {
        res.status(400).json(getResponseObject("Sorry Shipping Method For International Products Is Not Valid ( Please Send 'normal' or 'fast' Value )", true, {}));
        return;
    }
    next();
}

function validateTypeOfUseForCode(typeOfUse, res, nextFunc) {
    if (!["to activate account", "to reset password"].includes(typeOfUse)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateOrderDestination(orderDestination, res, nextFunc) {
    if (!["admin", "user"].includes(orderDestination)) {
        res.status(400).json(getResponseObject("Please Send Valid Order Destination !!", true, {}));
        return;
    }
    nextFunc();
}

function validatePaymentGateway(paymentGate, res, nextFunc) {
    if (!["Wallet", "Credit Card", "Upon Receipt"].includes(paymentGate)) {
        res.status(400).json(getResponseObject("Please Send Valid Payment Gateway !!", true, {}));
        return;
    }
    nextFunc();
}

function validateOrderStatus(ordersType, status, res, nextFunc) {
    const validNormalOrderStatus = ["pending", "shipping", "completed"], validReturnOrderStatus = [
        "awaiting products",
        "received products",
        "checking products",
        "partially return products",
        "fully return products",
        "return refused"
    ];
    if (ordersType === "normal" ? !validNormalOrderStatus.includes(status) : !validReturnOrderStatus.includes(status)) {
        res.status(400).json(getResponseObject("Please Send Valid Order Status !!", true, {}));
        return;
    }
    nextFunc();
}

function validateOrdersType(ordersType, res, nextFunc) {
    if (!["normal", "return"].includes(ordersType)) {
        res.status(400).json(getResponseObject("Please Send Valid Orders Type ( 'normal' or 'return' ) !!", true, {}));
        return;
    }
    nextFunc();
}

function validateIsPriceGreaterThanDiscount(price, discount, res, next) {
    if (Number(discount) > Number(price)) {
        return res.status(400).json(getResponseObject("Sorry, Please Send Valid Price And / Or Discount Value ( Must Be Price Greater Than Discount ) !!", true, {}));
    }
    next();
}

function validateUserType(userType, res, nextFunc, errorMsg = "Sorry, Please Send Valid User Type !!") {
    if (userType !== "user" && userType !== "admin") {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateAdvertismentType(type, res, nextFunc, errorMsg = "Sorry, Please Send Valid Advertimment Type !!") {
    if (!["panner", "elite"].includes(type)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateSize(size, res, nextFunc, errorMsg = "Sorry, Please Send Valid Size ( ['s','m', 'l', 'xl', 'xxl', 'xxxl', '4xl'] ) !!") {
    if (!['s', 'm', 'l', 'xl', 'xxl', 'xxxl', '4xl'].includes(size)) {
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

function keyGeneratorForRequestsRateLimit(req) {
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const ipWithoutPort = ipAddress.split(',')[0];
    return ipWithoutPort;
}

module.exports = {
    validateJWT,
    validateCity,
    validateEmail,
    validateMobilePhone,
    validateUserType,
    validatePassword,
    validateCode,
    validateLanguage,
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
    validateName,
    validateIsNotExistDublicateProductId,
    validateCheckoutStatus,
    validateSortMethod,
    validateSortType,
    validateIsExistErrorInFiles,
    validateShippingMethod,
    validateTypeOfUseForCode,
    validateOrderDestination,
    validatePaymentGateway,
    validateOrderStatus,
    validateOrdersType,
    validateIsPriceGreaterThanDiscount,
    validateUserType,
    validateAdvertismentType,
    validateSize,
    validateColor,
    validateColors,
    validateWeightUnit,
    validateDimentionsUnit,
    keyGeneratorForRequestsRateLimit,
}