const { getResponseObject } = require("../../helpers/responses");

function validateCheckoutStatus(checkoutStatus, res, nextFunc, errorMsg = "Sorry, Please Send Valid Checkout Status ( 'Checkout Incomplete' Or 'Checkout Successfull' ) !!") {
    if (!["Checkout Incomplete", "Checkout Successfull"].includes(checkoutStatus)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
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

module.exports = {
    validateCheckoutStatus,
    validateShippingMethod,
    validateOrderDestination,
    validatePaymentGateway,
    validateOrderStatus,
    validateOrdersType,
    validateIsNotExistDublicateProductId
}