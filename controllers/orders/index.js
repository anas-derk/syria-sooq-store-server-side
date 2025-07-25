const { responsesHelpers, translationHelpers, emailsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const { sendReceiveOrderEmail, sendUpdateOrderEmail } = emailsHelpers;

const ordersManagmentFunctions = require("../../repositories/orders");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "destination") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "orderNumber") filtersObject[objectKey] = Number(filters[objectKey]);
        if (objectKey === "checkoutStatus") {
            if (filters["destination"] === "admin") {
                filtersObject[objectKey] = Number(filters[objectKey])
            }
        }
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject["fullName"] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerId") {
            if (filters["destination"] === "admin") {
                filtersObject[objectKey] = filters[objectKey];
            }
        }
        if (objectKey === "isDeleted") {
            if (filters[objectKey] === "yes") {
                filtersObject[objectKey] = true;
            }
            else filtersObject[objectKey] = false;
        }
    }
    return filtersObject;
}

function getFiltersObjectForUpdateOrder(acceptableData) {
    let filterdData = {};
    if (acceptableData.status) filterdData.status = acceptableData.status;
    return filterdData;

}

async function getOrdersCount(req, res) {
    try {
        const filters = req.query;
        res.json(await ordersManagmentFunctions.getOrdersCount(req.data._id, filters.ordersType, getFiltersObject(filters), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllOrdersInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await ordersManagmentFunctions.getAllOrdersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, filters.ordersType, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getOrderDetails(req, res) {
    try {
        const { destination, ordersType } = req.query;
        res.json(await ordersManagmentFunctions.getOrderDetails(req.data._id, req.params.orderId, destination, ordersType, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewOrder(req, res) {
    try {
        const result = await ordersManagmentFunctions.createNewOrder(req.data._id, req.body, req.query.language);
        if (!result.error) {
            res.json({
                ...result,
                data: {
                    orderId: result.data.orderId,
                    orderNumber: result.data.orderNumber
                }
            });
            if (result.data.checkoutStatus === "Checkout Successfull" && result.data.email) {
                try {
                    await sendReceiveOrderEmail(result.data.email, result.data, result.data.language);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewRequestToReturnOrderProducts(req, res) {
    try {
        const { isReturnAllProducts, language } = req.query;
        const result = await ordersManagmentFunctions.createNewRequestToReturnOrderProducts(req.data._id, req.params.orderId, req.body.products, isReturnAllProducts === "true" ? true : false, language);
        if (!result.error) {
            return res.json(result);
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postApprovingOnReturnProduct(req, res) {
    try {
        const { orderId, productId } = req.params;
        const result = await ordersManagmentFunctions.approvingOnReturnProduct(req.data._id, orderId, productId, { approvedQuantity, notes } = req.body, req.query.language);
        if (result.error) {
            if (!["Sorry, This User Is Not Exist !!", "Sorry, This Order Is Not Found !!", "Sorry, This Product For This Order Is Not Found !!"].includes(result.error)) {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postRefusalReturnProduct(req, res) {
    try {
        const { orderId, productId } = req.params;
        const result = await ordersManagmentFunctions.refusalReturnProduct(req.data._id, orderId, productId, req.body.notes, req.query.language);
        if (result.error) {
            if (!["Sorry, This User Is Not Exist !!", "Sorry, This Order Is Not Found !!", "Sorry, This Product For This Order Is Not Found !!"].includes(result.error)) {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postCheckoutComplete(req, res) {
    try {
        const result = await ordersManagmentFunctions.changeCheckoutStatusToSuccessfull(req.params.orderId, req.query.language);
        res.json(result);
        if (!result.error) {
            await sendReceiveOrderEmail(result.data.billingAddress.email, result.data, "ar");
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putOrder(req, res) {
    try {
        const { ordersType, isSendEmailToTheCustomer } = req.query;
        const { status } = req.body;
        const result = await ordersManagmentFunctions.updateOrder(req.data._id, req.params.orderId, ordersType, getFiltersObjectForUpdateOrder({ status }), req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Order Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        if (isSendEmailToTheCustomer && result.data.email) {
            if (status === "shipping" || status === "completed") {
                result.data.status = status;
                await sendUpdateOrderEmail(result.data.email, result.data, "ar");
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putOrderProduct(req, res) {
    try {
        const { orderId, productId } = req.query;
        const result = await ordersManagmentFunctions.updateOrderProduct(req.data._id, orderId, productId, { quantity, name, unitPrice } = req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Order Is Not Found !!" || result.msg !== "Sorry, This Product For This Order Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCancelOrder(req, res) {
    try {
        const result = await ordersManagmentFunctions.cancelOrder(req.data._id, req.params.orderId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteOrder(req, res) {
    try {
        const result = await ordersManagmentFunctions.deleteOrder(req.data._id, req.params.orderId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Order Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteProductFromOrder(req, res) {
    try {
        const { orderId, productId } = req.params;
        const result = await ordersManagmentFunctions.deleteProductFromOrder(req.data._id, orderId, productId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Order Is Not Found !!" || result.msg !== "Sorry, This Product For This Order Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    getAllOrdersInsideThePage,
    getFiltersObject,
    getOrdersCount,
    getOrderDetails,
    postNewOrder,
    postNewRequestToReturnOrderProducts,
    postApprovingOnReturnProduct,
    postRefusalReturnProduct,
    postCheckoutComplete,
    putOrder,
    putOrderProduct,
    putCancelOrder,
    deleteOrder,
    deleteProductFromOrder,
}
