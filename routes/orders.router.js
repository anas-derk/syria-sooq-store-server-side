const ordersRouter = require("express").Router();

const ordersController = require("../controllers/orders.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat, validateIsNotExistDublicateProductId, validateCheckoutStatus, validateOrderDestination, validatePaymentGateway, validateOrderStatus, validateMobilePhone, validateOrdersType } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

ordersRouter.get("/orders-count",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, destination, ordersType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: false },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: false },
            { fieldName: "Order Destination", fieldValue: destination, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Orders Type", fieldValue: ordersType, dataTypes: ["string"], isRequiredValue: false },
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
    (req, res, next) => {
        const { ordersType } = req.query;
        if (ordersType) {
            return validateOrdersType(ordersType, res, next);
        }
        next();
    },
    ordersController.getOrdersCount
);

ordersRouter.get("/all-orders-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, destination, ordersType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Order Destination", fieldValue: destination, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Orders Type", fieldValue: ordersType, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    (req, res, next) => validateOrderDestination(req.query.destination, res, next),
    (req, res, next) => {
        const { ordersType } = req.query;
        if (ordersType) {
            return validateOrdersType(ordersType, res, next);
        }
        next();
    },
    ordersController.getAllOrdersInsideThePage
);

ordersRouter.get("/order-details/:orderId",
    validateJWT,
    (req, res, next) => {
        const { destination, ordersType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Order Destination", fieldValue: destination, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Orders Type", fieldValue: ordersType, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateOrderDestination(req.query.destination, res, next),
    (req, res, next) => {
        const { ordersType } = req.query;
        if (ordersType) {
            return validateOrdersType(ordersType, res, next);
        }
        next();
    },
    ordersController.getOrderDetails
);

ordersRouter.post("/create-new-order",
    validateJWT,
    (req, res, next) => {
        const { city, address, addressDetails, closestPoint, additionalAddressDetails, floorNumber, additionalNotes, mobilePhone, backupMobilePhone, paymentGateway, checkoutStatus, products } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "City", fieldValue: city, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Address", fieldValue: address, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Address Details", fieldValue: addressDetails, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Closest Point", fieldValue: closestPoint, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Additional Address Details", fieldValue: additionalAddressDetails, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Floor Number", fieldValue: floorNumber, dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Additional Notes", fieldValue: additionalNotes, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Backup Mobile Phones", fieldValue: backupMobilePhone, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Payment Gateway", fieldValue: paymentGateway, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Checkout Status", fieldValue: checkoutStatus, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Order Products", fieldValue: products, dataTypes: ["array"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { products } = req.body;
        validateIsExistValueForFieldsAndDataTypes(
            products.flatMap((product, index) => ([
                { fieldName: `Id In Product ${index + 1}`, fieldValue: product?.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
                { fieldName: `Quantity In Product ${index + 1}`, fieldValue: product?.quantity, dataTypes: ["number"], isRequiredValue: true },
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
    (req, res, next) => validateNumbersIsGreaterThanZero([req.body.floorNumber], res, next, [], "Sorry, Please Send Valid Apartment Number In Shipping Address ( Number Must Be Greater Than Zero ) !!"),
    (req, res, next) => validateNumbersIsNotFloat([req.body.floorNumber], res, next, "Sorry, Please Send Valid Apartment Number In Shipping Address ( Number Must Be Not Float ) !!"),
    (req, res, next) => validateIsNotExistDublicateProductId(req.body.products, res, next),
    (req, res, next) => {
        const { products } = req.body;
        let productsQuantity = [], errorMsgs = [];
        for (let i = 0; i < products.length; i++) {
            productsQuantity.push(products[i].quantity);
            errorMsgs.push(`Sorry, Please Send Valid Quantity For Product ${i + 1} ( Number Must Be Greater Than Zero ) !!`);
        }
        validateNumbersIsGreaterThanZero(productsQuantity, res, next, errorMsgs);
    },
    (req, res, next) => validateMobilePhone(req.body.mobilePhone, res, next),
    (req, res, next) => validateMobilePhone(req.body.backupMobilePhone, res, next),
    (req, res, next) => validatePaymentGateway(req.body.paymentGateway, res, next),
    ordersController.postNewOrder
);

ordersRouter.post("/create-new-request-to-return-order-products/:orderId",
    validateJWT,
    (req, res, next) => {
        const { products } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Is Return All Products", fieldValue: Boolean(req.query.isReturnAllProducts), dataTypes: ["boolean"], isRequiredValue: false },
            { fieldName: "Order Products", fieldValue: products, dataTypes: ["array"], isRequiredValue: req.query.isReturnAllProducts ? false : true },
        ], res, next);
    },
    (req, res, next) => {
        const { products } = req.body;
        if (products) {
            return validateIsExistValueForFieldsAndDataTypes(
                products.flatMap((product, index) => ([
                    { fieldName: `Id In Product ${index + 1}`, fieldValue: product?.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
                    { fieldName: `Quantity In Product ${index + 1}`, fieldValue: product?.quantity, dataTypes: ["number"], isRequiredValue: true },
                ]))
                , res, next);
        }
        next();
    },
    (req, res, next) => validateIsNotExistDublicateProductId(req.body.products, res, next),
    (req, res, next) => {
        const { products } = req.body;
        let productsQuantity = [], errorMsgs = [];
        for (let i = 0; i < products.length; i++) {
            productsQuantity.push(products[i].quantity);
            errorMsgs.push(`Sorry, Please Send Valid Quantity For Product ${i + 1} ( Number Must Be Greater Than Zero ) !!`);
        }
        validateNumbersIsGreaterThanZero(productsQuantity, res, next, errorMsgs);
    },
    ordersController.postNewRequestToReturnOrderProducts
);

ordersRouter.post("/handle-checkout-complete/:orderId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    ordersController.postCheckoutComplete
);

ordersRouter.post("/update-order/:orderId",
    validateJWT,
    (req, res, next) => {
        const { status } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Is Send Email To The Customer", fieldValue: Boolean(req.query.isSendEmailToTheCustomer), dataTypes: ["boolean"], isRequiredValue: false },
            { fieldName: "Status", fieldValue: status, dataTypes: ["string"], isRequiredValue: req.query.isSendEmailToTheCustomer ? true : false },
        ], res, next);
    },
    (req, res, next) => {
        const { status } = req.body;
        if (status) {
            return validateOrderStatus(status, res, next);
        }
        next();
    },
    ordersController.putOrder
);

ordersRouter.put("/products/update-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    ordersController.putOrderProduct
);

ordersRouter.put("/cancel-order/:orderId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    ordersController.putCancelOrder
);

ordersRouter.delete("/delete-order/:orderId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    ordersController.deleteOrder
);

ordersRouter.delete("/products/delete-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    ordersController.deleteProductFromOrder
);

module.exports = ordersRouter;