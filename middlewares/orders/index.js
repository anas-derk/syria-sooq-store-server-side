const { getResponseObject } = require("../../helpers/responses");
const ordersConstants = require("../../constants/orders");

function validateCheckoutStatus(checkoutStatus, res, nextFunc, errorMsg = "Sorry, Please Send Valid Checkout Status ( 'Checkout Incomplete' Or 'Checkout Successfull' ) !!") {
    if (!ordersConstants.CHECKOUT_STATUS.includes(checkoutStatus)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

function validateShippingMethod(req, res, next) {
    const shippingMethod = req.body.shippingMethod;
    if (!ordersConstants.SHIPPING_METHODS.LOCAL.includes(shippingMethod.forLocalProducts)) {
        res.status(400).json(getResponseObject("Sorry Shipping Method For Local Products Is Not Valid ( Please Send 'normal' or 'ubuyblues' Value )", true, {}));
        return;
    }
    if (!ordersConstants.SHIPPING_METHODS.INTERNATIONAL.includes(shippingMethod.forInternationalProducts)) {
        res.status(400).json(getResponseObject("Sorry Shipping Method For International Products Is Not Valid ( Please Send 'normal' or 'fast' Value )", true, {}));
        return;
    }
    next();
}

function validateOrderDestination(orderDestination, res, nextFunc) {
    if (!ordersConstants.ORDER_DESTINATIONS.includes(orderDestination)) {
        res.status(400).json(getResponseObject("Please Send Valid Order Destination !!", true, {}));
        return;
    }
    nextFunc();
}

function validatePaymentGateway(paymentGate, res, nextFunc) {
    if (!ordersConstants.PAYMENT_GATEWAYS.includes(paymentGate)) {
        res.status(400).json(getResponseObject("Please Send Valid Payment Gateway !!", true, {}));
        return;
    }
    nextFunc();
}

function validateOrderStatus(ordersType, status, res, nextFunc) {
    if (ordersType === "normal" ? !ordersConstants.ORDER_STATUS.NORMAL.includes(status) : !ordersConstants.ORDER_STATUS.RETRUN.includes(status)) {
        res.status(400).json(getResponseObject("Please Send Valid Order Status !!", true, {}));
        return;
    }
    nextFunc();
}

function validateOrdersType(ordersType, res, nextFunc) {
    if (!ordersConstants.ORDER_TYPE.includes(ordersType)) {
        res.status(400).json(getResponseObject("Please Send Valid Orders Type ( 'normal' or 'return' ) !!", true, {}));
        return;
    }
    nextFunc();
}

function validateIsNotExistDublicateProductId(products, res, nextFunc) {
    let seenProductIds = {};
    for (let product of products) {
        if (seenProductIds[product.cartId]) {
            res.status(400).json(getResponseObject(`Sorry, Dublicate Product Id: ${product.cartId} !!`, true, {}));
            return;
        }
        seenProductIds[product.cartId] = true;
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