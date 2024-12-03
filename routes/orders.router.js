const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat, validateName, validateEmail, validateIsNotExistDublicateProductId, validateCheckoutStatus, validateShippingMethod, validateOrderDestination, validatePaymentGateway, validateOrderStatus, validateLanguage } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

ordersRouter.get("/orders-count",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, destination } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: false },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: false },
            { fieldName: "Order Destination", fieldValue: destination, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { pageNumber } = req.query;
        if (pageNumber) {
            return validateNumbersIsGreaterThanZero([req.query.pageNumber], res, next, [], "Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!");
        }
        next();
    },
    (req, res, next) => {
        const { pageSize } = req.query;
        if (pageSize) {
            return validateNumbersIsGreaterThanZero([req.query.pageSize], res, next, [], "Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!");
        }
        next();
    },
    (req, res, next) => {
        const { pageNumber } = req.query;
        if (pageNumber) {
            return validateNumbersIsNotFloat([req.query.pageNumber], res, next, [], "Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!");
        }
        next();
    },
    (req, res, next) => {
        const { pageSize } = req.query;
        if (pageSize) {
            return validateNumbersIsNotFloat([req.query.pageSize], res, next, [], "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!");
        }
        next();
    },
    (req, res, next) => validateOrderDestination(req.query.destination, res, next),
    ordersController.getOrdersCount
);

ordersRouter.get("/all-orders-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, destination } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: true },
            { fieldName: "Order Destination", fieldValue: destination, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    (req, res, next) => validateOrderDestination(req.query.destination, res, next),
    ordersController.getAllOrdersInsideThePage
);

ordersRouter.get("/order-details/:orderId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.getOrderDetails
);

ordersRouter.post("/create-new-order",
    validateJWT,
    (req, res, next) => {
        const { checkoutStatus, billingAddress, shippingAddress, requestNotes, products, couponCode, paymentGateway } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Coupon Code", fieldValue: couponCode, dataType: "string", isRequiredValue: false },
            { fieldName: "Checkout Status", fieldValue: checkoutStatus, dataType: "string", isRequiredValue: false },
            { fieldName: "First Name In Billing Address", fieldValue: billingAddress?.firstName, dataType: "string", isRequiredValue: true },
            { fieldName: "Last Name In Billing Address", fieldValue: billingAddress?.lastName, dataType: "string", isRequiredValue: true },
            { fieldName: "Company Name In Billing Address", fieldValue: billingAddress?.companyName, dataType: "string", isRequiredValue: false },
            { fieldName: "Street Address In Billing Address", fieldValue: billingAddress?.streetAddress, dataType: "string", isRequiredValue: true },
            { fieldName: "Apartment Number In Billing Address", fieldValue: billingAddress?.apartmentNumber, dataType: "number", isRequiredValue: false },
            { fieldName: "City In Billing Address", fieldValue: billingAddress?.city, dataType: "string", isRequiredValue: true },
            { fieldName: "Postal Code In Billing Address", fieldValue: billingAddress?.postalCode, dataType: "string", isRequiredValue: true },
            { fieldName: "Phone In Billing Address", fieldValue: billingAddress?.phone, dataType: "string", isRequiredValue: true },
            { fieldName: "Email In Billing Address", fieldValue: billingAddress?.email, dataType: "string", isRequiredValue: true },
            { fieldName: "First Name In Shipping Address", fieldValue: shippingAddress?.firstName, dataType: "string", isRequiredValue: true },
            { fieldName: "Last Name In Shipping Address", fieldValue: shippingAddress?.lastName, dataType: "string", isRequiredValue: true },
            { fieldName: "Company Name In Shipping Address", fieldValue: shippingAddress?.companyName, dataType: "string", isRequiredValue: false },
            { fieldName: "Street Address In Shipping Address", fieldValue: shippingAddress?.streetAddress, dataType: "string", isRequiredValue: true },
            { fieldName: "Apartment Number In Shipping Address", fieldValue: shippingAddress?.apartmentNumber, dataType: "number", isRequiredValue: false },
            { fieldName: "City In Shipping Address", fieldValue: shippingAddress?.city, dataType: "string", isRequiredValue: true },
            { fieldName: "Postal Code In Shipping Address", fieldValue: shippingAddress?.postalCode, dataType: "string", isRequiredValue: true },
            { fieldName: "Phone In Shipping Address", fieldValue: shippingAddress?.phone, dataType: "string", isRequiredValue: true },
            { fieldName: "Email In Shipping Address", fieldValue: shippingAddress?.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Request Notes", fieldValue: requestNotes, dataType: "string", isRequiredValue: false },
            { fieldName: "Order Products", fieldValue: products, dataType: "array", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { products } = req.body;
        validateIsExistValueForFieldsAndDataTypes(
            products.flatMap((product, index) => ([
                { fieldName: `Id In Product ${index + 1}`, fieldValue: product?.productId, dataType: "ObjectId", isRequiredValue: true },
                { fieldName: `Quantity In Product ${index + 1}`, fieldValue: product?.quantity, dataType: "number", isRequiredValue: true },
            ]))
        , res, next);
    },
    (req, res, next) => {
        const { checkoutStatus } = req.body;
        if (checkoutStatus) {
            validateCheckoutStatus(checkoutStatus, res, next);
            return;
        }
        next();
    },
    (req, res, next) => validateName(req.body.billingAddress.firstName, res, next, "Sorry, Please Send Valid First Name In Billing Address !!"),
    (req, res, next) => validateName(req.body.billingAddress.lastName, res, next, "Sorry, Please Send Valid Last Name In Billing Address !!"),
    (req, res, next) => validateName(req.body.billingAddress.city, res, next, "Sorry, Please Send Valid City Name In Billing Address !!"),
    (req, res, next) => {
        const { billingAddress } = req.body;
        if (billingAddress?.apartmentNumber) {
            validateNumbersIsGreaterThanZero([req.body.billingAddress.apartmentNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Billing Address ( Number Must Be Greater Than Zero ) !!");
            return;
        }
        next();
    },
    (req, res, next) => {
        const { billingAddress } = req.body;
        if (billingAddress?.apartmentNumber) {
            validateNumbersIsNotFloat([req.body.billingAddress.apartmentNumber], res, next, "Sorry, Please Send Valid Apartment Number In Billing Address ( Number Must Be Not Float ) !!");
            return;
        }
        next();
    },
    (req, res, next) => validateEmail(req.body.billingAddress.email, res, next, "Sorry, Please Send Valid Email In Billing Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.firstName, res, next, "Sorry, Please Send Valid First Name In Shipping Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.lastName, res, next, "Sorry, Please Send Valid Last Name In Shipping Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.city, res, next, "Sorry, Please Send Valid City Name In Shipping Address !!"),
    (req, res, next) => {
        const { shippingAddress } = req.body;
        if (shippingAddress?.apartmentNumber) {
            validateNumbersIsGreaterThanZero([req.body.shippingAddress.apartmentNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Shipping Address ( Number Must Be Greater Than Zero ) !!");
            return;
        }
        next();
    },
    (req, res, next) => {
        const { shippingAddress } = req.body;
        if (shippingAddress?.apartmentNumber) {
            validateNumbersIsNotFloat([req.body.shippingAddress.apartmentNumber], res, next, "Sorry, Please Send Valid Apartment Number In Shipping Address ( Number Must Be Not Float ) !!");
            return;
        }
        next();
    },
    (req, res, next) => validateEmail(req.body.shippingAddress.email, res, next, "Sorry, Please Send Valid Email In Shipping Address !!"),
    (req, res, next) => validateIsNotExistDublicateProductId(req.body.products, res, next),
    (req, res, next) => {
        const { products } = req.body;
        let productsQuantity = [], errorMsgs = [];
        for(let i = 0; i < products.length; i++) {
            productsQuantity.push(products[i].quantity);
            errorMsgs.push(`Sorry, Please Send Valid Quantity For Product ${i + 1} ( Number Must Be Greater Than Zero ) !!`);
        }
        validateNumbersIsGreaterThanZero(productsQuantity, res, next, errorMsgs);
    },
    ordersController.postNewOrder
);

ordersRouter.post("/create-payment-order",
    (req, res, next) => {
        const { checkoutStatus, billingAddress, shippingAddress, requestNotes, products, shippingMethod, creator, paymentGateway, couponCode } = req.body;
        const { country } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Country", fieldValue: country, dataType: "string", isRequiredValue: true },
            { fieldName: "Order Creator", fieldValue: creator, dataType: "string", isRequiredValue: true },
            { fieldName: "Coupon Code", fieldValue: couponCode, dataType: "string", isRequiredValue: false },
            { fieldName: "Payment Gate", fieldValue: paymentGateway, dataType: "string", isRequiredValue: true },
            { fieldName: "Checkout Status", fieldValue: checkoutStatus, dataType: "string", isRequiredValue: false },
            { fieldName: "First Name In Billing Address", fieldValue: billingAddress?.firstName, dataType: "string", isRequiredValue: true },
            { fieldName: "Last Name In Billing Address", fieldValue: billingAddress?.lastName, dataType: "string", isRequiredValue: true },
            { fieldName: "Company Name In Billing Address", fieldValue: billingAddress?.companyName, dataType: "string", isRequiredValue: false },
            { fieldName: "Country In Billing Address", fieldValue: billingAddress?.country, dataType: "string", isRequiredValue: true },
            { fieldName: "Street Address In Billing Address", fieldValue: billingAddress?.streetAddress, dataType: "string", isRequiredValue: true },
            { fieldName: "Apartment Number In Billing Address", fieldValue: billingAddress?.apartmentNumber, dataType: "number", isRequiredValue: false },
            { fieldName: "City In Billing Address", fieldValue: billingAddress?.city, dataType: "string", isRequiredValue: true },
            { fieldName: "Postal Code In Billing Address", fieldValue: billingAddress?.postalCode, dataType: "string", isRequiredValue: true },
            { fieldName: "Phone In Billing Address", fieldValue: billingAddress?.phone, dataType: "string", isRequiredValue: true },
            { fieldName: "Email In Billing Address", fieldValue: billingAddress?.email, dataType: "string", isRequiredValue: true },
            { fieldName: "First Name In Shipping Address", fieldValue: shippingAddress?.firstName, dataType: "string", isRequiredValue: true },
            { fieldName: "Last Name In Shipping Address", fieldValue: shippingAddress?.lastName, dataType: "string", isRequiredValue: true },
            { fieldName: "Company Name In Shipping Address", fieldValue: shippingAddress?.companyName, dataType: "string", isRequiredValue: false },
            { fieldName: "Country In Shipping Address", fieldValue: shippingAddress?.country, dataType: "string", isRequiredValue: true },
            { fieldName: "Street Address In Shipping Address", fieldValue: shippingAddress?.streetAddress, dataType: "string", isRequiredValue: true },
            { fieldName: "Apartment Number In Shipping Address", fieldValue: shippingAddress?.apartmentNumber, dataType: "number", isRequiredValue: false },
            { fieldName: "City In Shipping Address", fieldValue: shippingAddress?.city, dataType: "string", isRequiredValue: true },
            { fieldName: "Postal Code In Shipping Address", fieldValue: shippingAddress?.postalCode, dataType: "string", isRequiredValue: true },
            { fieldName: "Phone In Shipping Address", fieldValue: shippingAddress?.phone, dataType: "string", isRequiredValue: true },
            { fieldName: "Email In Shipping Address", fieldValue: shippingAddress?.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Request Notes", fieldValue: requestNotes, dataType: "string", isRequiredValue: false },
            { fieldName: "Order Products", fieldValue: products, dataType: "array", isRequiredValue: true },
            { fieldName: "Shipping Method", fieldValue: shippingMethod, dataType: "object", isRequiredValue: true },
            { fieldName: "Shipping Method For Local Products", fieldValue: shippingMethod?.forLocalProducts, dataType: "string", isRequiredValue: true },
            { fieldName: "Shipping Method For Internationl Products", fieldValue: shippingMethod?.forInternationalProducts, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { products } = req.body;
        validateIsExistValueForFieldsAndDataTypes(
            products.flatMap((product, index) => ([
                { fieldName: `Id In Product ${index + 1}`, fieldValue: product?.productId, dataType: "ObjectId", isRequiredValue: true },
                { fieldName: `Quantity In Product ${index + 1}`, fieldValue: product?.quantity, dataType: "number", isRequiredValue: true },
            ]))
        , res, next);
    },
    (req, res, next) => validateName(req.query.country, res, next, "Sorry, Please Send Valid Country Name !!"),
    (req, res, next) => validateCountry(req.query.country, res, next),
    (req, res, next) => validateOrderCreator(req.body.creator, res, next),
    (req, res, next) => validatePaymentGateway(req.body.paymentGateway, res, next),
    (req, res, next) => {
        const { creator } = req.body;
        if (creator === "user") {
            validateJWT(req, res, next);
            return;
        }
        next();
    },
    (req, res, next) => {
        const { checkoutStatus } = req.body;
        if (checkoutStatus) {
            validateCheckoutStatus(checkoutStatus, res, next);
            return;
        }
        next();
    },
    (req, res, next) => validateName(req.body.billingAddress.firstName, res, next, "Sorry, Please Send Valid First Name In Billing Address !!"),
    (req, res, next) => validateName(req.body.billingAddress.lastName, res, next, "Sorry, Please Send Valid Last Name In Billing Address !!"),
    (req, res, next) => validateName(req.body.billingAddress.country, res, next, "Sorry, Please Send Valid Country Name In Billing Address !!"),
    (req, res, next) => validateName(req.body.billingAddress.city, res, next, "Sorry, Please Send Valid City Name In Billing Address !!"),
    (req, res, next) => {
        const { billingAddress } = req.body;
        if (billingAddress?.apartmentNumber) {
            validateNumbersIsGreaterThanZero([billingAddress.apartmentNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Billing Address ( Number Must Be Greater Than Zero ) !!");
            return;
        }
        next();
    },
    (req, res, next) => {
        const { billingAddress } = req.body;
        if (billingAddress?.apartmentNumber) {
            validateNumbersIsNotFloat([billingAddress.apartmentNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Billing Address ( Number Must Be Not Float ) !!");
            return;
        }
        next();
    },
    (req, res, next) => validateEmail(req.body.billingAddress.email, res, next, "Sorry, Please Send Valid Email In Billing Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.firstName, res, next, "Sorry, Please Send Valid First Name In Shipping Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.lastName, res, next, "Sorry, Please Send Valid Last Name In Shipping Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.country, res, next, "Sorry, Please Send Valid Country Name In Shipping Address !!"),
    (req, res, next) => validateName(req.body.shippingAddress.city, res, next, "Sorry, Please Send Valid City Name In Shipping Address !!"),
    (req, res, next) => {
        const { billingAddress } = req.body;
        if (billingAddress?.apartmentNumber) {
            validateNumbersIsGreaterThanZero([billingAddress.apartmentNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Shipping Address ( Number Must Be Greater Than Zero ) !!");
            return;
        }
        next();
    },
    (req, res, next) => {
        const { shippingAddress } = req.body;
        if (shippingAddress?.apartmentNumber) {
            validateNumbersIsNotFloat([shippingAddress.apartmentNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Shipping Address ( Number Must Be Not Float ) !!");
            return;
        }
        next();
    },
    (req, res, next) => validateEmail(req.body.shippingAddress.email, res, next, "Sorry, Please Send Valid Email In Shipping Address !!"),
    (req, res, next) => validateIsNotExistDublicateProductId(req.body.products, res, next),
    (req, res, next) => {
        const { products } = req.body;
        let productsQuantity = [], errorMsgs = [];
        for(let i = 0; i < products.length; i++) {
            productsQuantity.push(products[i].quantity);
            errorMsgs.push(`Sorry, Please Send Valid Quantity For Product ${i + 1} ( Number Must Be Greater Than Zero ) !!`);
        }
        validateNumbersIsGreaterThanZero(productsQuantity, res, next, errorMsgs);
    },
    validateShippingMethod,
    ordersController.postNewPaymentOrder
);

ordersRouter.post("/handle-checkout-complete/:orderId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.postCheckoutComplete
);

ordersRouter.post("/handle-change-binance-payment-status/:orderId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.postChangeBinancePaymentStatus
);

ordersRouter.post("/update-order/:orderId",
    validateJWT,
    (req, res, next) => {
        const { status, orderAmount } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Order Amount", fieldValue: orderAmount, dataType: "number", isRequiredValue: false },
            { fieldName: "Is Send Email To The Customer", fieldValue: Boolean(req.query.isSendEmailToTheCustomer), dataType: "boolean", isRequiredValue: false },
            { fieldName: "Status", fieldValue: status, dataType: "string", isRequiredValue: req.query.isSendEmailToTheCustomer ? true : false },
        ], res, next);
    },
    (req, res, next) => {
        const { status } = req.body;
        if (status) {
            return validateOrderStatus(status, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { orderAmount } = req.body;
        if (orderAmount) {
            return validateNumbersIsGreaterThanZero([orderAmount], res, next, [], "Sorry, Please Send Valid Order Amount ( Number Must Be Greater Than Zero ) !!");
        }
        next();
    },
    ordersController.putOrder
);

ordersRouter.put("/products/update-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.putOrderProduct
);

ordersRouter.delete("/delete-order/:orderId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.deleteOrder
);

ordersRouter.delete("/products/delete-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    ordersController.deleteProductFromOrder
);

module.exports = ordersRouter;