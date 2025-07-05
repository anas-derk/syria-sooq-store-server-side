const CHECKOUT_STATUS = ["Checkout Incomplete", "Checkout Successfull"];
const SHIPPING_METHODS = {
    LOCAL: ["normal", "ubuyblues"],
    INTERNATIONAL: ["normal", "fast"]
};
const ORDER_DESTINATIONS = ["admin", "user"];
const PAYMENT_GATEWAYS = ["Wallet", "Credit Card", "Upon Receipt"];
const ORDER_STATUS = {
    NORMAL: ["pending", "shipping", "completed"],
    RETRUN: [
        "awaiting products",
        "received products",
        "checking products",
        "partially return products",
        "fully return products",
        "return refused"
    ]
};
const ORDER_TYPE = ["normal", "return"];

module.exports = {
    CHECKOUT_STATUS,
    SHIPPING_METHODS,
    ORDER_DESTINATIONS,
    PAYMENT_GATEWAYS,
    ORDER_STATUS,
    ORDER_TYPE,
}