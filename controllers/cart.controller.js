const { getResponseObject, getSuitableTranslations } = require("../global/functions");

const cartOperationsManagmentFunctions = require("../models/cart.model");

async function postNewProduct(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.addNewProduct(req.data._id, {
            ...{ productId, quantity } = Object.assign({}, req.body),
        }, req.query.language);
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

async function getAllProducts(req, res) {
    try {
        res.json(await cartOperationsManagmentFunctions.getAllProducts(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteAllProducts(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.deleteAllProducts(req.data._id, req.query.language);
        if (!result.error) {
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

async function deleteProduct(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.deleteProduct(req.data._id, req.params.cartId, req.query.language);
        if (!result.error) {
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

async function putProduct(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.updateProduct(req.data._id, req.params.cartId, { quantity } = req.body, req.query.language);
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

module.exports = {
    postNewProduct,
    getAllProducts,
    deleteProduct,
    deleteAllProducts,
    putProduct,
}