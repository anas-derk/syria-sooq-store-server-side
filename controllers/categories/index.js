const { responsesHelpers, translationHelpers, processingHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const categoriesManagmentFunctions = require("../../repositories/categories");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = { $regex: new RegExp(filters[objectKey], 'i') };
        if (objectKey === "categoryId") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "parent") {
            if (filters[objectKey] === "null") {
                filtersObject[objectKey] = null;
            } else filtersObject[objectKey] = filters[objectKey];
        }
    }
    return filtersObject;
}

async function postNewCategory(req, res) {
    try {
        const outputImageFilePath = `assets/images/categories/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await categoriesManagmentFunctions.addNewCategory(req.data._id, {
            ...{ name, color, parent } = Object.assign({}, req.body),
            imagePath: outputImageFilePath,
        }, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Cateogry Is Already Exist !!" && result.msg !== "Sorry, This Parent Cateogry Is Not Exist !!") {
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

async function getAllCategories(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getAllCategories(req.data._id, getFiltersObject(filters), filters.userType, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllCategoriesWithHierarechy(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getAllCategoriesWithHierarechy(getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getCategoryInfo(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getCategoryInfo(req.params.categoryId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getCategoriesCount(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getCategoriesCount(req.data._id, getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getAllCategoriesInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, filters.userType, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteCategory(req, res) {
    try {
        const result = await categoriesManagmentFunctions.deleteCategory(req.data._id, req.params.categoryId, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedCategoryImagePath);
        }
        else {
            if (result.msg !== "Sorry, This Category Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCategory(req, res) {
    try {
        const result = await categoriesManagmentFunctions.updateCategory(req.data._id, req.params.categoryId, { name, color, parent } = req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Category Is Not Exist !!" || result.msg !== "Sorry, This Parent Cateogry Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCategoryImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/categories/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await categoriesManagmentFunctions.changeCategoryImage(req.data._id, req.params.categoryId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedCategoryImagePath);
        }
        else {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
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
    postNewCategory,
    getAllCategories,
    getAllCategoriesWithHierarechy,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    getCategoryInfo,
    deleteCategory,
    putCategory,
    putCategoryImage,
}