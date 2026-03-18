const CHECKOUT_STATUS = ["Checkout Incomplete", "Checkout Successfull"];

const ORDER_DESTINATIONS = ["admin", "user"];

const PAYMENT_GATEWAYS = ["Wallet", "Credit Card", "Upon Receipt"];

const NORMAL_ORDER_STATUS = ["pending", "shipping", "completed", "cancelled"];

const DEFAULT_NORMAL_ORDER_STATUS = NORMAL_ORDER_STATUS[0];

const RETRUN_ORDER_STATUS = [
    "awaiting products",
    "received products",
    "checking products",
    "partially return products",
    "fully return products",
    "return refused"
];

const DEFAULT_RETRUN_ORDER_STATUS = RETRUN_ORDER_STATUS[0];

const RETRUN_ORDER_PRODUCT_STATUS = [
    "checking",
    "full approval",
    "partial approval",
    "reject"
];

const DEFAULT_RETRUN_ORDER_PRODUCT_STATUS = RETRUN_ORDER_PRODUCT_STATUS[0];

const ORDER_STATUS = {
    NORMAL: NORMAL_ORDER_STATUS,
    RETRUN: RETRUN_ORDER_STATUS
};

const ORDER_TYPE = ["normal", "return"];

module.exports = {
    CHECKOUT_STATUS,
    ORDER_DESTINATIONS,
    PAYMENT_GATEWAYS,
    NORMAL_ORDER_STATUS,
    DEFAULT_NORMAL_ORDER_STATUS,
    RETRUN_ORDER_STATUS,
    DEFAULT_RETRUN_ORDER_STATUS,
    RETRUN_ORDER_PRODUCT_STATUS,
    DEFAULT_RETRUN_ORDER_PRODUCT_STATUS,
    ORDER_STATUS,
    ORDER_TYPE,
};