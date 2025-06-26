// Import Product Model Object

const { productModel, categoryModel, adminModel, userModel, favoriteProductModel, brandModel } = require("../../models");

const mongoose = require("../../database");

const { getSuitableTranslations } = require("../../global/functions");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findOne({ name: productInfo.name, categoryId: productInfo.categoryId });
                if (!product) {
                    if (product?.brand) {
                        const brand = await brandModel.findById(product.brand);
                        if (!brand) {
                            return {
                                msg: getSuitableTranslations("Sorry, This Brand Is Not Exist !!", language),
                                error: false,
                                data: {},
                            }
                        }
                    }
                    const categories = await categoryModel.find({ _id: { $in: productInfo.categories } });
                    if (categories.length === productInfo.categories.length) {
                        productInfo.categories = categories.map((category) => category._id);
                        productInfo.storeId = admin.storeId;
                        await (new productModel(productInfo)).save();
                        return {
                            msg: getSuitableTranslations("Adding New Product Process Has Been Successfuly !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Already Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function addNewImagesToProductGallery(authorizationId, productId, newGalleryImagePaths, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(product.storeId)) {
                        const galleryImagePathsAfterAddNewPaths = product.galleryImagesPaths.concat(newGalleryImagePaths);
                        await productModel.updateOne({ _id: productId },
                            {
                                galleryImagesPaths: galleryImagePathsAfterAddNewPaths,
                            });
                        return {
                            msg: getSuitableTranslations("Add New Images To Product Gallery Process Has Been Successfuly !!", language),
                            error: false,
                            data: {
                                galleryImagePathsAfterAddNewPaths,
                            },
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Found !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductsByIds(productsIds, language) {
    try {
        const products = await productModel.find({ _id: { $in: productsIds }, quantity: { $gte: 1 } }).populate("categories");
        if (products.length === 0) {
            return {
                msg: getSuitableTranslations("Get Products By Ids Process Has Been Successfully !!", language),
                error: false,
                data: {
                    productByIds: [],
                },
            }
        } else {
            let groupedProducts = {};
            products.forEach((product) => {
                const storeId = product.storeId;
                if (!groupedProducts[storeId]) {
                    groupedProducts[storeId] = [];
                }
                groupedProducts[storeId].push(product);
            });
            return {
                msg: getSuitableTranslations("Get Products By Ids Process Has Been Successfully !!", language),
                error: false,
                data: {
                    productByIds: Object.keys(groupedProducts).map((storeId) => ({ storeId, products: groupedProducts[storeId] })),
                    currentDate: new Date(),
                },
            }
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductsByIdsAndStoreId(storeId, productsIds, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Products By Store Id And Ids Process Has Been Successfully !!", language),
            error: false,
            data: {
                products: await productModel.find({ _id: { $in: productsIds }, storeId, quantity: { $gte: 1 } }).populate("categories"),
                currentDate: new Date()
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductInfo(authorizationId, productId, userType = "user", language) {
    try {
        const user = userType === "user" ? await userModel.findById(authorizationId) : await adminModel.findById(authorizationId);
        if (user) {
            let productInfo = await productModel.findById(productId).populate("categories").populate("storeId");
            if (productInfo) {
                const currentDate = new Date();
                productInfo._doc.isExistOffer = productInfo.startDiscountPeriod <= currentDate && productInfo.endDiscountPeriod >= currentDate ? true : false;
                productInfo._doc.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId, userId: authorizationId }) ? true : false;
                return {
                    msg: getSuitableTranslations("Get Product Info Process Has Been Successfuly !!", language),
                    error: false,
                    data: {
                        productDetails: productInfo,
                        currentDate,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations(`Sorry, This ${userType.replace(userType[0], userType[0].toUpperCase())} Is Not Exist !!`, language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getProductsCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Products Count Process Has Been Successfully !!", language),
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getFlashProductsCount(filters, language) {
    try {
        const currentDate = new Date();
        filters.startDiscountPeriod = { $lte: currentDate };
        filters.endDiscountPeriod = { $gte: currentDate };
        return {
            msg: getSuitableTranslations("Get Flash Products Count Process Has Been Successfully !!", language),
            error: false,
            data: await productModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProductsInsideThePage(authorizationId, pageNumber, pageSize, userType, filters, sortDetailsObject, language) {
    try {
        if (userType === "user") {
            const user = await userModel.findById(authorizationId);
            if (!user) {
                return {
                    msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }

        } else {
            const admin = await adminModel.findById(authorizationId);
            if (!admin) {
                return {
                    msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
        }
        if (filters.category) {
            let category = filters.category;
            delete filters.category;
            const result = await productModel.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $match: {
                        "categoryDetails.name": { $regex: new RegExp(category, 'i') },
                        ...filters
                    }
                },
                {
                    $facet: {
                        products: [
                            { $skip: (pageNumber - 1) * pageSize },
                            { $limit: pageSize }
                        ],
                        productsCount: [
                            { $count: "total" }
                        ]
                    }
                }
            ]);
            let products = await productModel.populate(result[0].products, "categories");
            for (let product of products) {
                product._doc.isExistOffer = product.startDiscountPeriod <= currentDate && endDiscountPeriod >= currentDate ? true : false;
                product._doc.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId: product._id, userId: authorizationId }) ? true : false;
            }
            return {
                msg: getSuitableTranslations("Get Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                error: false,
                data: {
                    products,
                    productsCount: result[0].productsCount.length > 0 ? result[0].productsCount[0].total : 0,
                    currentDate: new Date()
                },
            }
        }
        const currentDate = new Date();
        let products = await productModel.find(filters).sort(sortDetailsObject).skip((pageNumber - 1) * pageSize).limit(pageSize).populate("categories");
        for (let product of products) {
            product._doc.isExistOffer = product.startDiscountPeriod <= currentDate && product.endDiscountPeriod >= currentDate ? true : false;
            product._doc.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId: product._id, userId: authorizationId }) ? true : false;
        }
        return {
            msg: getSuitableTranslations("Get All Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                products,
                productsCount: await productModel.countDocuments(filters),
                currentDate,
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProductsByCategoryInsideThePage(authorizationId, pageNumber, pageSize, categoryId, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            const subcategories = await categoryModel.find({ parent: categoryId }, { name: 1, storeId: 1, parent: 1, color: 1 }).limit(pageSize);
            let groupedProducts = {};
            for (let category of subcategories) {
                let productsBySubCategory = await productModel.find({ categories: category._id }).skip((pageNumber - 1) * pageSize).limit(10).populate("categories");
                for (let product of productsBySubCategory) {
                    product._doc.isExistOffer = product.startDiscountPeriod <= currentDate && product.endDiscountPeriod >= currentDate ? true : false;
                }
                groupedProducts[category.name] = productsBySubCategory;
            }
            return {
                msg: getSuitableTranslations("Get All Products By Category Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                error: false,
                data: groupedProducts,
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllFlashProductsInsideThePage(authorizationId, pageNumber, pageSize, userType, filters, sortDetailsObject, language) {
    try {
        const currentDate = new Date();
        filters.startDiscountPeriod = { $lte: currentDate };
        filters.endDiscountPeriod = { $gte: currentDate };
        if (userType === "user") {
            const user = await userModel.findById(authorizationId);
            if (user) {
                let products = await productModel
                    .find(filters)
                    .sort(sortDetailsObject)
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .populate("categories");
                for (let product of products) {
                    product._doc.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId: product._id, userId: authorizationId }) ? true : false;
                }
                return {
                    msg: getSuitableTranslations("Get All Flash Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        products,
                        currentDate: new Date(),
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                error: true,
                data: {},
            }
        } else {
            const admin = await adminModel.findById(authorizationId);
            if (admin) {
                return {
                    msg: getSuitableTranslations("Get All Flash Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        products: await productModel
                            .find(filters)
                            .sort(sortDetailsObject)
                            .skip((pageNumber - 1) * pageSize)
                            .limit(pageSize)
                            .populate("categories"),
                        currentDate: new Date(),
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getRelatedProductsInTheProduct(authorizationId, productId, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            const productInfo = await productModel.findById(productId).populate("categories").populate("storeId");
            if (productInfo) {
                let products = await productModel.aggregate([
                    { $match: { categories: productInfo.categories, _id: { $ne: new mongoose.Types.ObjectId(productId) } } },
                    { $sample: { size: 10 } }
                ]);
                for (let product of products) {
                    product.isExistOffer = product.startDiscountPeriod <= currentDate && product.endDiscountPeriod >= currentDate ? true : false;
                    product.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId: product._id, userId: authorizationId }) ? true : false;
                }
                return {
                    msg: getSuitableTranslations("Get Sample From Related Products In This Product Process Has Been Successfuly !!", language),
                    error: false,
                    data: products,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllGalleryImages(authorizationId, productId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findOne({ _id: productId });
                if (product) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(product.storeId)) {
                        return {
                            msg: getSuitableTranslations("Get All Gallery Images For This Product Process Has Been Successfully !!", language),
                            error: false,
                            data: product.galleryImagesPaths,
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteProduct(authorizationId, productId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const productInfo = await productModel.findById(productId);
                if (productInfo) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(productInfo.storeId)) {
                        await productModel.deleteOne({
                            _id: productId,
                        });
                        return {
                            msg: getSuitableTranslations("Deleting Product Process Has Been Successfuly !!", language),
                            error: false,
                            data: {
                                deletedProductImagePath: productInfo.imagePath,
                                galleryImagePathsForDeletedProduct: productInfo.galleryImagesPaths,
                                colorImagesPathsForDeletedProduct: productInfo.colorImagesPaths,
                            },
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteImageFromProductGallery(authorizationId, productId, galleryImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(product.storeId)) {
                        await productModel.updateOne({ _id: productId }, {
                            galleryImagesPaths: product.galleryImagesPaths.filter((path) => galleryImagePath !== path)
                        });
                        return {
                            msg: getSuitableTranslations("Deleting Image From Product Gallery Process Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateProduct(authorizationId, productId, newData, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(product.storeId)) {
                        if (Array.isArray(newData.categories)) {
                            const categories = await categoryModel.find({ _id: { $in: newData.categories } });
                            if (categories.length > 0) {
                                newData.categories = categories.map((category) => category._id);
                            } else {
                                newData.categories = [];
                            }
                        }
                        await productModel.updateOne({ _id: productId }, newData);
                        return {
                            msg: getSuitableTranslations("Updating Product Info Process Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateProductGalleryImage(authorizationId, productId, oldGalleryImagePath, newGalleryImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(product.storeId)) {
                        const galleryImagePathIndex = product.galleryImagesPaths.findIndex((galleryImagePath) => galleryImagePath === oldGalleryImagePath);
                        if (galleryImagePathIndex >= 0) {
                            product.galleryImagesPaths[galleryImagePathIndex] = newGalleryImagePath;
                            await productModel.updateOne({ _id: productId }, {
                                galleryImagesPaths: product.galleryImagesPaths
                            });
                            return {
                                msg: getSuitableTranslations("Updating Product Galley Image Process Has Been Successfully !!", language),
                                error: false,
                                data: newGalleryImagePath,
                            }
                        }
                        return {
                            msg: getSuitableTranslations("Sorry, This Path Is Not Found !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateProductImage(authorizationId, productId, newProductImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const product = await productModel.findById(productId);
                if (product) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(product.storeId)) {
                        await productModel.updateOne({ _id: productId }, {
                            imagePath: newProductImagePath,
                        });
                        return {
                            msg: getSuitableTranslations("Changing Product Image Process Has Been Successfully !!", language),
                            error: false,
                            data: {
                                deletedProductImagePath: product.imagePath,
                            },
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewProduct,
    addNewImagesToProductGallery,
    getProductsByIds,
    getProductsByIdsAndStoreId,
    getProductInfo,
    getProductsCount,
    getFlashProductsCount,
    getAllFlashProductsInsideThePage,
    getAllProductsInsideThePage,
    getAllProductsByCategoryInsideThePage,
    getRelatedProductsInTheProduct,
    getAllGalleryImages,
    deleteProduct,
    deleteImageFromProductGallery,
    updateProduct,
    updateProductGalleryImage,
    updateProductImage,
}