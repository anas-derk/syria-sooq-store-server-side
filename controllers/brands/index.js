const { responsesHelpers, translationHelpers, processingHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const brandsManagmentFunctions = require("../../repositories/brands");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
    }
    if (!filtersObject["storeId"]) filtersObject["isMainStore"] = true;
    return filtersObject;
}

async function postNewBrand(req, res) {
    try {
        const outputImageFilePath = `assets/images/brands/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const brandInfo = Object.assign({}, req.body);
        const result = await brandsManagmentFunctions.addNewBrand(req.data._id, {
            ...Object.assign({}, req.body),
            imagePath: outputImageFilePath,
        }, req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getBrandsCount(req, res) {
    try {
        res.json(await brandsManagmentFunctions.getBrandsCount(getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllBrandsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await brandsManagmentFunctions.getAllBrandsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteBrand(req, res) {
    try {
        const result = await brandsManagmentFunctions.deleteBrand(req.data._id, req.params.brandId, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedBrandPath);
        }
        else {
            if (result.msg !== "Sorry, This Brand Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putBrandInfo(req, res) {
    try {
        const result = await brandsManagmentFunctions.updateBrandInfo(req.data._id, req.params.brandId, req.body.title, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Brand Is Not Exist !!") {
                return res.status(401).json(getResponseObject(result, true, {}));
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putBrandImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/brands/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await brandsManagmentFunctions.changeBrandImage(req.data._id, req.params.brandId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedBrandImagePath);
        }
        else {
            unlinkSync(outputImageFilePath);
            if (result.msg !== "Sorry, This Brand Is Not Exist !!") {
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
    postNewBrand,
    getBrandsCount,
    getAllBrandsInsideThePage,
    deleteBrand,
    putBrandInfo,
    putBrandImage,
}