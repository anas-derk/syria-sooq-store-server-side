const ordersRouter = require("express").Router();

const ordersController = require("../../controllers/orders");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    numbersMiddlewares,
    ordersMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
    validateMobilePhone,
} = authMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

const {
    validateIsNotExistDublicateProductId,
    validateCheckoutStatus,
    validateOrderDestination,
    validatePaymentGateway,
    validateOrderStatus,
    validateOrdersType
} = ordersMiddlewares;

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
            { fieldName: "Backup Mobile Phones", fieldValue: backupMobilePhone, dataTypes: ["string"], isRequiredValue: false },
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
                { fieldName: `Message In Product ${index + 1}`, fieldValue: product?.message, dataTypes: ["string"], isRequiredValue: false },
            ]))
            , res, next);
    },
    (req, res, next) => {
        const { checkoutStatus } = req.body;
        if (checkoutStatus) {
            return validateCheckoutStatus(checkoutStatus, res, next);
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
    (req, res, next) => {
        const { checkoutStatus } = req.body;
        if (checkoutStatus) {
            return validateMobilePhone(req.body.backupMobilePhone, res, next);
        }
        next();
    },
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
            { fieldName: "Order Products", fieldValue: products, dataTypes: ["array"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { products } = req.body;
        const { isReturnAllProducts } = req.query;
        validateIsExistValueForFieldsAndDataTypes(
            products.flatMap((product, index) => ([
                { fieldName: `Id In Product ${index + 1}`, fieldValue: product?.productId, dataTypes: ["ObjectId"], isRequiredValue: isReturnAllProducts === "true" ? true : false },
                { fieldName: `Quantity In Product ${index + 1}`, fieldValue: product?.quantity, dataTypes: ["number"], isRequiredValue: isReturnAllProducts === "true" ? true : false },
                { fieldName: `Return Reason In Product ${index + 1}`, fieldValue: product?.returnReason, dataTypes: ["string"], isRequiredValue: true },
            ]))
            , res, next);
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

ordersRouter.post("/approving-on-return-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        const { approvedQuantity, notes } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Approved Quantity", fieldValue: approvedQuantity, dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Notes", fieldValue: notes, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.body.approvedQuantity], res, next, [], "Sorry, Please Send Valid Approved Quantity ( Number Must Be Greater Than Zero ) !!"),
    (req, res, next) => validateNumbersIsNotFloat([req.body.approvedQuantity], res, next, [], "Sorry, Please Send Valid Approved Quantity ( Number Must Be Greater Than Float ) !!"),
    ordersController.postApprovingOnReturnProduct
);

ordersRouter.post("/refusal-return-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Notes", fieldValue: req.body.notes, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    ordersController.postRefusalReturnProduct
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
        const { ordersType, isSendEmailToTheCustomer } = req.query;
        const { status } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Orders Type", fieldValue: ordersType, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Is Send Email To The Customer", fieldValue: Boolean(isSendEmailToTheCustomer), dataTypes: ["boolean"], isRequiredValue: false },
            { fieldName: "Status", fieldValue: status, dataTypes: ["string"], isRequiredValue: isSendEmailToTheCustomer ? true : false },
        ], res, next);
    },
    (req, res, next) => {
        const { ordersType } = req.query;
        if (ordersType) {
            return validateOrdersType(ordersType, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { status } = req.body;
        if (status) {
            return validateOrderStatus(req.query.ordersType, status, res, next);
        }
        next();
    },
    ordersController.putOrder
);

ordersRouter.put("/products/update-product/:orderId/:productId",
    validateJWT,
    (req, res, next) => {
        const { quantity, name, unitPrice } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Order Id", fieldValue: req.params.orderId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Quantity", fieldValue: quantity, dataTypes: ["number"], isRequiredValue: false },
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Unit Price", fieldValue: unitPrice, dataTypes: ["number"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { quantity } = req.body;
        if (quantity) {
            return validateNumbersIsGreaterThanZero([quantity], res, next, [], "Sorry, Please Send Valid Quantity ( Number Must Be Greater Than Zero ) !!");
        }
        next();
    },
    (req, res, next) => {
        const { quantity } = req.body;
        if (quantity) {
            return validateNumbersIsNotFloat([quantity], res, next, [], "Sorry, Please Send Valid Quantity ( Number Must Be Greater Than Float ) !!");
        }
        next();
    },
    (req, res, next) => {
        const { unitPrice } = req.body;
        if (unitPrice) {
            return validateNumbersIsGreaterThanZero([unitPrice], res, next, [], "Sorry, Please Send Valid Unit Price ( Number Must Be Greater Than Zero ) !!");
        }
        next();
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
