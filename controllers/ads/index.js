const { getResponseObject, handleResizeImagesAndConvertFormatToWebp, getSuitableTranslations } = require("../../global/functions");

const adsOPerationsManagmentFunctions = require("../../repositories/ad");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postNewAd(req, res) {
    try {
        const outputImageFilePath = `assets/images/ads/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const bodyData = Object.assign({}, req.body);
        const adInfo = {};
        adInfo.imagePath = outputImageFilePath;
        adInfo.content = bodyData.content;
        if (bodyData.city) adInfo.city = bodyData.city;
        adInfo.product = bodyData.product;
        adInfo.type = bodyData.type;
        const result = await adsOPerationsManagmentFunctions.addNewAd(req.data._id, adInfo, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, Can't Add New Ad Because Arrive To Max Limits For Ads Count ( Limits: 10 ) !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllAds(req, res) {
    try {
        const filters = req.query;
        res.json(await adsOPerationsManagmentFunctions.getAllAds(getFiltersObject(filters), filters.language));

    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteAd(req, res) {
    try {
        const result = await adsOPerationsManagmentFunctions.deleteAd(req.data._id, req.params.adId, req.query.language);
        if (!result.error) {
            if (result.data?.deletedAdImagePath) {
                unlinkSync(result.data.deletedAdImagePath);
            }
        }
        else {
            if (result.msg !== "Sorry, This Ad Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putAdImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/ads/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await adsOPerationsManagmentFunctions.updateAdImage(req.data._id, req.params.adId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.oldAdImagePath);
        }
        else {
            unlinkSync(outputImageFilePath);
            if (result.msg !== "Sorry, This Ad Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putAd(req, res) {
    try {
        const result = await adsOPerationsManagmentFunctions.updateAd(req.data._id, req.params.adId, { content, city } = req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Ad Is Not Exist !!") {
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
    postNewAd,
    getAllAds,
    deleteAd,
    putAdImage,
    putAd
}