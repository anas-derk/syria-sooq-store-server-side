const { responsesHelpers, translationHelpers, processingHelpers, notificationsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const { sendNotification } = notificationsHelpers;

const productsManagmentFunctions = require("../../repositories/products");

const { unlinkSync } = require("fs");

async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        let baseFiles = [productImages.productImage[0].buffer], outputImageFilePaths = [`assets/images/products/${Math.random()}_${Date.now()}__${productImages.productImage[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`];
        productImages.galleryImages.forEach((file) => {
            baseFiles.push(file.buffer);
            outputImageFilePaths.push(`assets/images/products/${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`)
        });
        await handleResizeImagesAndConvertFormatToWebp(baseFiles, outputImageFilePaths);
        let colorImageFiles = [], outputColorImageFilePaths = [];
        if (productImages?.colorImages?.length > 0) {
            productImages.colorImages.forEach((file) => {
                colorImageFiles.push(file.buffer);
                outputColorImageFilePaths.push(`assets/images/colors/${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`)
            });
            await handleResizeImagesAndConvertFormatToWebp(colorImageFiles, outputColorImageFilePaths);
        }
        let productInfo = {
            ...{ name, price, description, categories, discount, quantity, isAvailableForDelivery, customizes, brand, gender } = Object.assign({}, req.body),
            imagePath: outputImageFilePaths[0],
            galleryImagesPaths: outputImageFilePaths.slice(1),
            colorImagesPaths: outputColorImageFilePaths,
        };
        if (productInfo.customizes) {
            productInfo.customizes = JSON.parse(productInfo.customizes);
        }
        const result = await productsManagmentFunctions.addNewProduct(req.data._id, productInfo, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Has Been Blocked !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(result);
        // try {
        //     await sendNotification({
        //         title: "Adding New Product",
        //         token: "cpUSP7eH1QpuTCnzjv9IZx:APA91bFWCd-4QTTmvg_r-1JmbnKrZscvWPvpQBVeRE7eMMwiXvDhqgZ_KviYDDYQqh9-6WYZrPjeuCH2VAp0b89P0ZWPDvjSoUHuK_QRmsq75a8YQrpnJSgs",
        //         body: "Add A New Product In A Store You Follow",
        //         data: {
        //             productId: "1"
        //         }
        //     });
        // }
        // catch (err) {
        //     console.log(err);
        // }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewImagesToProductGallery(req, res) {
    try {
        let files = [], outputImageFilePaths = [];
        req.files.forEach((file) => {
            files.push(file.buffer);
            outputImageFilePaths.push(`assets/images/products/${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`)
        });
        await handleResizeImagesAndConvertFormatToWebp(files, outputImageFilePaths);
        const result = await productsManagmentFunctions.addNewImagesToProductGallery(req.data._id, req.params.productId, outputImageFilePaths, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Product Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getProductsByIds(req, res) {
    try {
        res.json(await productsManagmentFunctions.getProductsByIds(req.body.productsIds, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getProductsByIdsAndStoreId(req, res) {
    try {
        res.json(await productsManagmentFunctions.getProductsByIdsAndStoreId(req.query.storeId, req.body.productsIds, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

function getFiltersAndSortDetailsObject(queryObject) {
    let filtersObject = {}, sortDetailsObject = {};
    for (let objectKey in queryObject) {
        if (objectKey === "categoryId") filtersObject["categories"] = queryObject[objectKey];
        if (objectKey === "category") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "storeId") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = { $regex: new RegExp(queryObject[objectKey], 'i') }
        if (objectKey === "sortBy") sortDetailsObject[objectKey] = queryObject[objectKey];
        if (objectKey === "sortType") sortDetailsObject[objectKey] = queryObject[objectKey];
        if (objectKey === "gender") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "startPrice") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "endPrice") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "colors") filtersObject["customizes.colors"] = JSON.parse(queryObject[objectKey]);
        if (objectKey === "sizes") {
            const sizesAfterParsing = JSON.parse(queryObject[objectKey]);
            if (sizesAfterParsing?.s) {
                if (sizesAfterParsing?.s === "yes")
                    filtersObject["customizes.sizes.s"] = true;
                else filtersObject["customizes.sizes.s"] = false;
            }
            if (sizesAfterParsing?.m) {
                if (sizesAfterParsing?.m === "yes")
                    filtersObject["customizes.sizes.m"] = true;
                else filtersObject["customizes.sizes.m"] = false;
            }
            if (sizesAfterParsing?.l) {
                if (sizesAfterParsing?.l === "yes")
                    filtersObject["customizes.sizes.l"] = true;
                else filtersObject["customizes.sizes.l"] = false;
            }
            if (sizesAfterParsing?.xl) {
                if (sizesAfterParsing?.xl === "yes")
                    filtersObject["customizes.sizes.xl"] = true;
                else filtersObject["customizes.sizes.xl"] = false;
            }
            if (sizesAfterParsing?.xxl) {
                if (sizesAfterParsing?.xxl === "yes")
                    filtersObject["customizes.sizes.xxl"] = true;
                else filtersObject["customizes.sizes.xxl"] = false;
            }
            if (sizesAfterParsing?.xxxl) {
                if (sizesAfterParsing?.xxxl === "yes")
                    filtersObject["customizes.sizes.xxxl"] = true;
                else filtersObject["customizes.sizes.xxxl"] = false;
            }
            if (sizesAfterParsing?.["4xl"]) {
                if (sizesAfterParsing?.["4xl"] === "yes")
                    filtersObject["customizes.sizes.4xl"] = true;
                else filtersObject["customizes.sizes.4xl"] = false;
            }
        }
        if (objectKey === "brands") {
            filtersObject["brand"] = JSON.parse(queryObject[objectKey]);
        }
        if (objectKey === "minAge") filtersObject[objectKey] = queryObject[objectKey];
        if (objectKey === "maxAge") filtersObject[objectKey] = queryObject[objectKey];
    }
    return { filtersObject, sortDetailsObject };
}

async function getProductInfo(req, res) {
    try {
        res.json(await productsManagmentFunctions.getProductInfo(req.data._id, req.params.productId, req.query.userType, req.query.language));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getFlashProductsCount(req, res) {
    try {
        res.json(await productsManagmentFunctions.getFlashProductsCount(getFiltersAndSortDetailsObject(req.query).filtersObject, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getProductsCount(req, res) {
    try {
        res.json(await productsManagmentFunctions.getProductsCount(getFiltersAndSortDetailsObject(req.query).filtersObject, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllProductsInsideThePage(req, res) {
    try {
        const queryObject = req.query;
        const filtersAndSortDetailsObject = getFiltersAndSortDetailsObject(queryObject);
        let sortDetailsObject = {};
        if (Object.keys(filtersAndSortDetailsObject.sortDetailsObject).length > 0) {
            sortDetailsObject[filtersAndSortDetailsObject.sortDetailsObject.sortBy] = Number(filtersAndSortDetailsObject.sortDetailsObject.sortType);
        }
        res.json(await productsManagmentFunctions.getAllProductsInsideThePage(req.data._id, Number(queryObject.pageNumber), Number(queryObject.pageSize), queryObject.userType, filtersAndSortDetailsObject.filtersObject, sortDetailsObject, queryObject.language));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllFlashProductsInsideThePage(req, res) {
    try {
        const queryObject = req.query;
        const filtersAndSortDetailsObject = getFiltersAndSortDetailsObject(queryObject);
        let sortDetailsObject = {};
        if (filtersAndSortDetailsObject.sortDetailsObject) {
            sortDetailsObject[filtersAndSortDetailsObject.sortDetailsObject.sortBy] = Number(filtersAndSortDetailsObject.sortDetailsObject.sortType);
        }
        res.json(await productsManagmentFunctions.getAllFlashProductsInsideThePage(req.data._id, queryObject.pageNumber, queryObject.pageSize, queryObject.userType, filtersAndSortDetailsObject.filtersObject, sortDetailsObject, queryObject.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllProductsByCategoryInsideThePage(req, res) {
    try {
        const { pageNumber, pageSize } = req.query;
        res.json(await productsManagmentFunctions.getAllProductsByCategoryInsideThePage(req.data._id, pageNumber, pageSize, req.params.categoryId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getRelatedProductsInTheProduct(req, res) {
    try {
        res.json(await productsManagmentFunctions.getRelatedProductsInTheProduct(req.data._id, req.params.productId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllGalleryImages(req, res) {
    try {
        const result = await productsManagmentFunctions.getAllGalleryImages(req.data._id, req.params.productId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
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
        const result = await productsManagmentFunctions.deleteProduct(req.data._id, req.params.productId, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedProductImagePath);
            for (let productImagePath of result.data.galleryImagePathsForDeletedProduct) {
                unlinkSync(productImagePath);
            }
            for (let colorImage of result.data.colorImagesPathsForDeletedProduct) {
                unlinkSync(colorImage);
            }
        }
        else {
            if (result.msg !== "Sorry, This Product Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteImageFromProductGallery(req, res) {
    try {
        const galleryImagePath = req.query.galleryImagePath;
        const result = await productsManagmentFunctions.deleteImageFromProductGallery(req.data._id, req.params.productId, galleryImagePath, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Product Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        unlinkSync(galleryImagePath);
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putProduct(req, res) {
    try {
        const result = await productsManagmentFunctions.updateProduct(req.data._id, req.params.productId, req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Product Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putProductGalleryImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/products/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const oldGalleryImagePath = req.query.oldGalleryImagePath;
        const result = await productsManagmentFunctions.updateProductGalleryImage(req.data._id, req.params.productId, oldGalleryImagePath, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(oldGalleryImagePath);
        }
        else {
            unlinkSync(outputImageFilePath);
            if (result.msg !== "Sorry, This Product Is Not Exist !!" || result.msg !== "Sorry, This Path Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putProductImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/products/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await productsManagmentFunctions.updateProductImage(req.data._id, req.params.productId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedProductImagePath);
        }
        else {
            unlinkSync(outputImageFilePath);
            if (result.msg !== "Sorry, This Product Is Not Exist !!") {
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
    postNewImagesToProductGallery,
    getProductsCount,
    getFlashProductsCount,
    getAllFlashProductsInsideThePage,
    getAllProductsInsideThePage,
    getAllProductsByCategoryInsideThePage,
    getProductInfo,
    getRelatedProductsInTheProduct,
    getProductsByIds,
    getProductsByIdsAndStoreId,
    getAllGalleryImages,
    deleteProduct,
    deleteImageFromProductGallery,
    putProduct,
    putProductGalleryImage,
    putProductImage,
}