const { getResponseObject, getSuitableTranslations, handleResizeImagesAndConvertFormatToWebp } = require("../global/functions");

const cartOperationsManagmentFunctions = require("../repositories/cart.repository");

const { unlinkSync } = require("fs");

async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        let files = [], outputImageFilePaths = [];
        if (productImages?.additionalFiles?.length > 0) {
            productImages.additionalFiles.forEach((file) => {
                if (
                    file.mimetype === "image/jpeg" ||
                    file.mimetype === "image/png" ||
                    file.mimetype === "image/webp"
                ) {
                    files.push(file.buffer);
                    outputImageFilePaths.push(`assets/images/cart/${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`);
                }
            });
            await handleResizeImagesAndConvertFormatToWebp(files, outputImageFilePaths);
        }
        const result = await cartOperationsManagmentFunctions.addNewProduct(req.data._id, {
            ...{ productId, quantity, message, customText, additionalNotes, size, color } = Object.assign({}, req.body),
            additionalFiles: outputImageFilePaths,
        }, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
            if (result.msg === "Sorry, Upload Images Is Not Allowed For This Product !!") {
                for (let productImagePath of outputImageFilePaths) {
                    unlinkSync(productImagePath);
                }
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

async function getCartLength(req, res) {
    try {
        res.json(await cartOperationsManagmentFunctions.getCartLength(req.data._id, req.query.language));
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
        const result = await cartOperationsManagmentFunctions.updateProduct(req.data._id, req.params.cartId, { quantity, message } = req.body, req.query.language);
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
    getCartLength,
    deleteProduct,
    deleteAllProducts,
    putProduct,
}