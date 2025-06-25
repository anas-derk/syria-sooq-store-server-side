// Import  Order Model Object

const { orderModel, userModel, adminModel, productModel, walletOperationsModel, cartModel, returnOrderModel } = require("../models");

const mongoose = require("../database");

const { getSuitableTranslations } = require("../global/functions");

async function getOrdersCount(authorizationId, ordersType = "normal", filters, language) {
    try {
        const user = filters.destination === "user" ? await userModel.findById(authorizationId) : await adminModel.findById(authorizationId);
        if (user) {
            if (filters.destination === "user") {
                filters.userId = authorizationId;
                if (ordersType === "normal") {
                    filters.checkoutStatus = "Checkout Successfull";
                }
            } else {
                filters.storeId = user.storeId;
            }
            delete filters.destination;
            return {
                msg: getSuitableTranslations("Get Orders Count Process Has Been Successfully !!", language),
                error: false,
                data: ordersType === "normal" ? await orderModel.countDocuments(filters) : await returnOrderModel.countDocuments(filters),
            }
        }
        return {
            msg: getSuitableTranslations(`Sorry, This ${user.distination.replace(user.distination[0], user.distination[0].toUpperCase())} Is Not Exist !!`, language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getAllOrdersInsideThePage(authorizationId, pageNumber, pageSize, ordersType = "normal", filters, language) {
    try {
        const user = filters.destination === "user" ? await userModel.findById(authorizationId) : await adminModel.findById(authorizationId);
        if (user) {
            if (filters.destination === "user") {
                filters.userId = authorizationId;
                if (ordersType === "normal") {
                    filters.checkoutStatus = "Checkout Successfull";
                }
            } else {
                filters.storeId = user.storeId;
            }
            delete filters.destination;
            if (ordersType === "normal") {
                return {
                    msg: getSuitableTranslations(`Get All ${ordersType.replace(ordersType[0], ordersType[0].toUpperCase())} Orders Inside The Page: {{pageNumber}} Process Has Been Successfully !!`, language, { pageNumber }),
                    error: false,
                    data: {
                        orders: ordersType === "normal" ? await orderModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ orderNumber: -1 }).populate("storeId") : await returnOrderModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ orderNumber: -1 }).populate("storeId").populate("originalOrder"),
                        ordersCount: ordersType === "normal" ? await orderModel.countDocuments(filters) : await returnOrderModel.countDocuments(filters),
                    },
                }
            } else if (ordersType === "return" && !filters.email && !filters.fullName) {
                return {
                    msg: getSuitableTranslations(`Get All ${ordersType.replace(ordersType[0], ordersType[0].toUpperCase())} Orders Inside The Page: {{pageNumber}} Process Has Been Successfully !!`, language, { pageNumber }),
                    error: false,
                    data: {
                        orders: ordersType === "normal" ? await orderModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ orderNumber: -1 }).populate("storeId") : await returnOrderModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ orderNumber: -1 }).populate("storeId").populate("originalOrder"),
                        ordersCount: ordersType === "normal" ? await orderModel.countDocuments(filters) : await returnOrderModel.countDocuments(filters),
                    },
                }
            }
            else {
                const email = filters.email;
                const fullName = filters.fullName;
                delete filters.email;
                delete filters.fullName;
                let orders = await returnOrderModel.find(filters).populate("storeId").populate("originalOrder");
                orders = orders.filter((order) => {
                    if (order?.originalOrder) {
                        if (email && fullName) {
                            return order.originalOrder.email === email && order.originalOrder.fullName === fullName;
                        } else if (email) {
                            return order.originalOrder.email === email;
                        } else {
                            return order.originalOrder.fullName === fullName;
                        }
                    }
                });
                return {
                    msg: getSuitableTranslations(`Get All ${ordersType.replace(ordersType[0], ordersType[0].toUpperCase())} Orders Inside The Page: {{pageNumber}} Process Has Been Successfully !!`, language, { pageNumber }),
                    error: false,
                    data: {
                        orders: orders
                            .slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize)
                            .sort((a, b) => b.orderNumber - a.orderNumber),
                        ordersCount: orders.length,
                    },
                }
            }
        }
        return {
            msg: getSuitableTranslations(`Sorry, This ${user.distination.replace(user.distination[0], user.distination[0].toUpperCase())} Is Not Exist !!`, language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getOrderDetails(authorizationId, orderId, destination, ordersType = "normal", language) {
    try {
        const user = destination === "user" ? await userModel.findById(authorizationId) : await adminModel.findById(authorizationId);
        if (user) {
            const order = ordersType === "normal" ? await orderModel.findById(orderId).populate("storeId") : await returnOrderModel.findById(orderId).populate("storeId").populate("originalOrder");
            if (order) {
                return {
                    msg: getSuitableTranslations("Get Order Details Process Has Been Successfully !!", language),
                    error: false,
                    data: order,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations(`Sorry, This ${destination.replace(destination[0], destination[0].toUpperCase())} Is Not Exist !!`, language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

const isExistOfferOnProduct = (startDateAsString, endDateAsString) => {
    if (
        startDateAsString &&
        endDateAsString
    ) {
        const currentDate = new Date();
        if (
            currentDate >= new Date(startDateAsString) &&
            currentDate <= new Date(endDateAsString)
        ) {
            return true;
        }
        return false;
    }
    return false;
}

async function updateProductsAfterOrder(items) {
    const bulkOperations = items.map(item => ({
        updateOne: {
            filter: {
                _id: new mongoose.Types.ObjectId(item.productId),
            },
            update: {
                $inc: {
                    quantity: -item.quantity,
                    numberOfOrders: item.quantity
                }
            }
        }
    }));
    return await productModel.bulkWrite(bulkOperations);
}

async function createNewOrder(userId, orderDetails, language) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return {
                msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        const existOrderProducts = await productModel.find({ _id: { $in: orderDetails.products.map((product) => product.productId) } });
        if (existOrderProducts.length === 0) {
            return {
                msg: getSuitableTranslations("Sorry, Please Send At Least One Product !!", language),
                error: true,
                data: {},
            }
        }
        if (existOrderProducts.length < orderDetails.products.length) {
            for (let product of orderDetails.products) {
                let isExistProduct = false;
                for (let existProduct of existOrderProducts) {
                    if ((new mongoose.Types.ObjectId(product.productId)).equals(existProduct._id)) {
                        isExistProduct = true;
                        break;
                    }
                }
                if (!isExistProduct) {
                    return {
                        msg: getSuitableTranslations("Sorry, Product Id: {{productId}} Is Not Exist !!", language, { productId: product.productId }),
                        error: true,
                        data: {},
                    }
                }
            }
        }
        let storeIdsAssociatedWithTheirProducts = [String(existOrderProducts[0].storeId)];
        for (let product of existOrderProducts) {
            if (storeIdsAssociatedWithTheirProducts.includes(String(product.storeId))) {
                continue;
            }
            return {
                msg: getSuitableTranslations("Sorry, All Products Must Be From The Same Store !!", language),
                error: true,
                data: {},
            }
        }
        const orderedProducts = orderDetails.products.map((product) => existOrderProducts.find((existProduct) => (new mongoose.Types.ObjectId(product.productId)).equals(existProduct._id)));
        for (let i = 0; i < orderedProducts.length; i++) {
            if ((new mongoose.Types.ObjectId(orderDetails.products[i].productId)).equals(orderedProducts[i]._id)) {
                if (orderedProducts[i].quantity === 0) {
                    return {
                        msg: getSuitableTranslations("Sorry, The Product With The ID: {{productId}} Is Not Available ( Quantity Is 0 ) !!", language, { productId: orderedProducts[i]._id }),
                        error: true,
                        data: {},
                    }
                }
                if (orderDetails.products[i].quantity > orderedProducts[i].quantity) {
                    return {
                        msg: getSuitableTranslations("Sorry, Quantity For Product Id: {{productId}} Greater Than Specific Quantity ( {{quantity}} ) !!", language, { productId: orderedProducts[i]._id, quantity: orderedProducts[i].quantity }),
                        error: true,
                        data: {},
                    }
                }
            }
        }
        let orderProductsDetails = [];
        for (let i = 0; i < orderedProducts.length; i++) {
            orderProductsDetails.push({
                productId: orderedProducts[i]._id,
                name: orderedProducts[i].name,
                unitPrice: orderedProducts[i].price,
                unitDiscount: isExistOfferOnProduct(orderedProducts[i].startDiscountPeriod, orderedProducts[i].endDiscountPeriod) ? orderedProducts[i].discountInOfferPeriod : orderedProducts[i].discount,
                quantity: orderDetails.products[i].quantity,
                message: orderDetails.products[i].message,
                imagePath: orderedProducts[i].imagePath,
            });
        }
        const totalPrices = {
            totalPriceBeforeDiscount: 0,
            totalDiscount: 0,
            totalPriceAfterDiscount: 0
        }
        for (let product of orderProductsDetails) {
            totalPrices.totalPriceBeforeDiscount += product.unitPrice * product.quantity;
            totalPrices.totalDiscount += product.unitDiscount * product.quantity;
        }
        totalPrices.totalPriceAfterDiscount = totalPrices.totalPriceBeforeDiscount - totalPrices.totalDiscount;
        if (orderDetails.paymentGateway === "Wallet") {
            if (user.wallet.remainingAmount < totalPrices.totalPriceAfterDiscount) {
                return {
                    msg: getSuitableTranslations("Sorry, There Is Not Enough Balance In This User's Wallet To Complete The Purchase", language),
                    error: true,
                    data: {},
                }
            }
            user.wallet.fullWithdrawAmount += totalPrices.totalPriceAfterDiscount;
            user.wallet.remainingAmount = user.wallet.fullDepositAmount - user.wallet.fullWithdrawAmount;
            await user.save();
        }
        const lastOrder = await orderModel.findOne().sort({ orderNumber: -1 });
        const newOrder = await (
            new orderModel({
                storeId: existOrderProducts[0].storeId,
                orderNumber: lastOrder ? lastOrder.orderNumber + 1 : 600000,
                totalPriceBeforeDiscount: totalPrices.totalPriceBeforeDiscount,
                totalDiscount: totalPrices.totalDiscount,
                totalPriceAfterDiscount: totalPrices.totalPriceAfterDiscount,
                orderAmount: totalPrices.totalPriceAfterDiscount,
                checkoutStatus: orderDetails.paymentGateway === "Wallet" ? "Checkout Successfull" : orderDetails.checkoutStatus,
                userId,
                paymentGateway: orderDetails.paymentGateway,
                city: orderDetails.city,
                address: orderDetails.address,
                addressDetails: orderDetails.addressDetails,
                closestPoint: orderDetails.closestPoint,
                additionalAddressDetails: orderDetails.additionalAddressDetails,
                floorNumber: orderDetails.floorNumber,
                additionalNotes: orderDetails.additionalNotes,
                mobilePhone: orderDetails.mobilePhone,
                backupMobilePhone: orderDetails.backupMobilePhone,
                products: orderProductsDetails,
                ...user.email && { email: user.email },
                ...user.mobilePhone && { mobilePhone: user.mobilePhone },
                fullName: user.fullName,
            })
        ).save();
        if (orderDetails.paymentGateway === "Wallet") {
            await (new walletOperationsModel({
                type: "withdraw",
                userId,
                amount: totalPrices.totalPriceAfterDiscount,
                operationNumber: await walletOperationsModel.countDocuments({ userId }) + 1
            })).save();
        }
        await cartModel.deleteMany({ userId, product: { $in: newOrder.products.map((product) => product.productId) } });
        await updateProductsAfterOrder(newOrder.products);
        return {
            msg: getSuitableTranslations("Creating New Order Has Been Successfuly !!", language),
            error: false,
            data: newOrder,
        }
    } catch (err) {
        throw Error(err);
    }
}

async function createNewRequestToReturnOrderProducts(authorizationId, orderId, products, isReturnAllProducts, language) {
    try {
        const result = await getOrderDetails(authorizationId, orderId, "user", "normal", language);
        if (result.error) {
            return result;
        }
        const returnOrder = await returnOrderModel.findOne({ originalOrder: orderId });
        if (returnOrder) {
            return {
                msg: getSuitableTranslations("Sorry, The Return Request For This Order's Products Already Exists !!", language),
                error: true,
                data: {},
            }
        }
        if (result.data.checkoutStatus === "Checkout Incomplete") {
            return {
                msg: getSuitableTranslations("Sorry, A Return Request Cannot Be Created Because The Original Order Has Not Completed The Payment Process !!", language),
                error: true,
                data: {},
            }
        }
        if (result.data.status === "cancelled") {
            return {
                msg: getSuitableTranslations("Sorry, A Return Request Cannot Be Created Because The Original Order Has Not Completed The Payment Process !!", language),
                error: true,
                data: {},
            }
        }
        if (result.data.status !== "completed") {
            return {
                msg: getSuitableTranslations("Sorry, A Return Request Cannot Be Created Because The Order Has Not Reached You ( Status: Pending Or Shipping ) !!", language),
                error: true,
                data: {},
            }
        }
        if (isReturnAllProducts) {
            await (new returnOrderModel({
                storeId: result.data.storeId,
                originalOrder: orderId,
                totalPriceBeforeDiscount: result.data.totalPriceBeforeDiscount,
                totalDiscount: result.data.totalDiscount,
                totalPriceAfterDiscount: result.data.totalPriceAfterDiscount,
                orderAmount: result.data.orderAmount,
                products: result.data.products.map((product, index) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    name: product.name,
                    unitPrice: product.unitPrice,
                    unitDiscount: product.unitDiscount,
                    imagePath: product.imagePath,
                    returnReason: products[index].returnReason
                })),
                orderNumber: await returnOrderModel.countDocuments() + 1,
            })).save();
            return {
                msg: getSuitableTranslations("Creating New Request To Return Order Products Process Has Been Successfuly !!", language),
                error: false,
                data: {},
            }
        }
        for (let product of products) {
            let isExistProduct = false;
            for (let existProduct of result.data.products) {
                if ((new mongoose.Types.ObjectId(product.productId)).equals(existProduct._id)) {
                    isExistProduct = true;
                    break;
                }
            }
            if (!isExistProduct) {
                return {
                    msg: getSuitableTranslations("Sorry, Product Id: {{productId}} Is Not Exist !!", language, { productId: product.productId }),
                    error: true,
                    data: {},
                }
            }
        }
        const orderedProducts = products.map((product) => result.data.products.find((existProduct) => (new mongoose.Types.ObjectId(product.productId)).equals(existProduct._id)));
        for (let i = 0; i < orderedProducts.length; i++) {
            if ((new mongoose.Types.ObjectId(products[i].productId)).equals(orderedProducts[i]._id)) {
                if (products[i].quantity > orderedProducts[i].quantity) {
                    return {
                        msg: getSuitableTranslations("Sorry, Quantity For Product Id: {{productId}} Greater Than Specific Quantity ( {{quantity}} ) !!", language, { productId: orderedProducts[i].productId, quantity: orderedProducts[i].quantity }),
                        error: true,
                        data: {},
                    }
                }
            }
        }
        let orderProductsDetails = [];
        for (let i = 0; i < orderedProducts.length; i++) {
            orderProductsDetails.push({
                productId: orderedProducts[i].productId,
                name: orderedProducts[i].name,
                unitPrice: orderedProducts[i].unitPrice,
                unitDiscount: orderedProducts[i].unitDiscount,
                totalAmount: orderedProducts[i].unitPrice * products[i].quantity,
                quantity: products[i].quantity,
                imagePath: orderedProducts[i].imagePath,
                returnReason: products[i].returnReason
            });
        }
        const totalPrices = {
            totalPriceBeforeDiscount: 0,
            totalDiscount: 0,
            totalPriceAfterDiscount: 0
        }
        for (let i = 0; i < products.length; i++) {
            totalPrices.totalPriceBeforeDiscount += orderedProducts[i].unitPrice * products[i].quantity;
            totalPrices.totalDiscount += orderedProducts[i].unitDiscount * products[i].quantity;
        }
        totalPrices.totalPriceAfterDiscount = totalPrices.totalPriceBeforeDiscount - totalPrices.totalDiscount;
        await (new returnOrderModel({
            userId: authorizationId,
            storeId: result.data.storeId,
            originalOrder: orderId,
            totalPriceBeforeDiscount: totalPrices.totalPriceBeforeDiscount,
            totalDiscount: totalPrices.totalDiscount,
            totalPriceAfterDiscount: totalPrices.totalPriceAfterDiscount,
            orderAmount: totalPrices.totalPriceAfterDiscount,
            products: orderProductsDetails,
            orderNumber: await returnOrderModel.countDocuments() + 1,
        })).save();
        return {
            msg: getSuitableTranslations("Creating New Request To Return Order Products Process Has Been Successfuly !!", language),
            error: false,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function approvingOnReturnProduct(authorizationId, orderId, productId, approvingDetails, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                let order = await returnOrderModel.findOne({ _id: orderId }).populate("originalOrder");
                if (order) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(order.storeId)) {
                        const productIndex = order.products.findIndex((order_product) => (new mongoose.Types.ObjectId(productId)).equals(order_product._id));
                        if (productIndex >= 0) {
                            if (approvingDetails.approvedQuantity > order.products[productIndex].quantity) {
                                return {
                                    msg: getSuitableTranslations("Sorry, Permission Denied Because Approved Quantity Greater Than Quantity In Return Order For This Product !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                            if (order.products[productIndex].status !== "checking") {
                                return {
                                    msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Has Been Checked In Return Order !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                            const user = await userModel.findById(order.originalOrder.userId);
                            if (!user) {
                                return {
                                    msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                            order.products[productIndex].approvedQuantity = approvingDetails.approvedQuantity;
                            order.products[productIndex].status = approvingDetails.approvedQuantity < order.products[productIndex].quantity ? "partial approval" : "full approval";
                            order = editReturnOrderPrices(order);
                            if (approvingDetails.notes) {
                                order.products[productIndex].notes = approvingDetails.notes;
                            }
                            await order.save();
                            user.wallet.fullDepositAmount += order.approvedOrderAmount;
                            user.wallet.remainingAmount = user.wallet.fullDepositAmount - user.wallet.fullWithdrawAmount;
                            await user.save();
                            await (new walletOperationsModel({
                                type: "deposit",
                                userId: user._id,
                                amount: order.approvedOrderAmount,
                                operationNumber: await walletOperationsModel.countDocuments({ userId: user._id }) + 1
                            })).save();
                            return {
                                msg: getSuitableTranslations("Approving On Return Order For This Product Process Has Been Successfuly !!", language),
                                error: false,
                                data: {},
                            }
                        }
                        return {
                            msg: getSuitableTranslations("Sorry, This Product For This Order Is Not Found !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
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
    } catch (err) {
        throw Error(err);
    }
}

async function refusalReturnProduct(authorizationId, orderId, productId, notes, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                let order = await returnOrderModel.findOne({ _id: orderId }).populate("originalOrder");
                if (order) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(order.storeId)) {
                        const productIndex = order.products.findIndex((order_product) => (new mongoose.Types.ObjectId(productId)).equals(order_product._id));
                        if (productIndex >= 0) {
                            if (order.products[productIndex].status !== "checking") {
                                return {
                                    msg: getSuitableTranslations("Sorry, Permission Denied Because This Product Has Been Checked In Return Order !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                            const user = await userModel.findById(order.originalOrder.userId);
                            if (!user) {
                                return {
                                    msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
                                    error: true,
                                    data: {},
                                }
                            }
                            order.products[productIndex].status = "reject";
                            order.products[productIndex].notes = notes;
                            await order.save();
                            return {
                                msg: getSuitableTranslations("Refusal Return Order For This Product Process Has Been Successfuly !!", language),
                                error: false,
                                data: {},
                            }
                        }
                        return {
                            msg: getSuitableTranslations("Sorry, This Product For This Order Is Not Found !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
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
    } catch (err) {
        throw Error(err);
    }
}

async function updateOrder(authorizationId, orderId, ordersType = "normal", newOrderDetails, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const order = ordersType === "normal" ? await orderModel.findById(orderId) : await returnOrderModel.findById(orderId);
                if (order) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(order.storeId)) {
                        if (ordersType === "normal") {
                            if (order.checkoutStatus === "Checkout Successfull") {
                                await orderModel.updateOne({ _id: orderId }, newOrderDetails);
                                return {
                                    msg: getSuitableTranslations("Updating Order Details Process Has Been Successfully !!", language),
                                    error: false,
                                    data: order,
                                }
                            }
                            return {
                                msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Completed ( Not Payment ) !!", language),
                                error: true,
                                data: {},
                            }
                        } else {
                            await returnOrderModel.updateOne({ _id: orderId }, newOrderDetails);
                            return {
                                msg: getSuitableTranslations("Updating Order Details Process Has Been Successfully !!", language),
                                error: false,
                                data: order,
                            }
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
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
    } catch (err) {
        throw Error(err);
    }
}

async function changeCheckoutStatusToSuccessfull(orderId, language) {
    try {
        const order = await orderModel.findOneAndUpdate({ _id: orderId }, { checkoutStatus: "Checkout Successfull" });
        if (order) {
            const totalPrices = {
                totalPriceBeforeDiscount: 0,
                totalDiscount: 0,
                totalPriceAfterDiscount: 0
            }
            for (let product of order.products) {
                totalPrices.totalPriceBeforeDiscount += product.totalAmount;
                totalPrices.totalDiscount += product.discount * product.quantity;
                totalPrices.totalPriceAfterDiscount = totalPrices.totalPriceBeforeDiscount - totalPrices.totalDiscount;
            }
            return {
                msg: getSuitableTranslations("Updating Order Checkout Status To Successfull Process Has Been Successfully !!", language),
                error: false,
                data: {
                    orderId: order._id,
                    orderNumber: order.orderNumber,
                    billingAddress: order.billingAddress,
                    shippingAddress: order.shippingAddress,
                    products: order.products,
                    totalPriceBeforeDiscount: totalPrices.totalPriceBeforeDiscount,
                    totalDiscount: totalPrices.totalDiscount,
                    totalPriceAfterDiscount: totalPrices.totalPriceAfterDiscount,
                    shippingCost: order.shippingCost
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

function editOrderPrices(order) {
    const { calcOrderTotalPrices } = require("../global/functions");
    const result = calcOrderTotalPrices(order.products);
    order.totalPriceBeforeDiscount = result.totalPriceBeforeDiscount;
    order.totalDiscount = result.totalDiscount;
    order.totalPriceAfterDiscount = result.totalPriceAfterDiscount;
    order.orderAmount = order.totalPriceAfterDiscount + order.shippingCost;
    return order;
}

function editReturnOrderPrices(order) {
    const { calcReturnOrderTotalPrices } = require("../global/functions");
    const result = calcReturnOrderTotalPrices(order.products);
    order.approvedTotalPriceBeforeDiscount = result.approvedTotalPriceBeforeDiscount;
    order.approvedTotalDiscount = result.approvedTotalDiscount;
    order.approvedTotalPriceAfterDiscount = result.approvedTotalPriceAfterDiscount;
    order.approvedOrderAmount = order.approvedTotalPriceAfterDiscount;
    return order;
}

async function updateOrderProduct(authorizationId, orderId, productId, newOrderProductDetails, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                let order = await orderModel.findOne({ _id: orderId });
                if (order) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(order.storeId)) {
                        const productIndex = order.products.findIndex((order_product) => order_product.productId == productId);
                        if (productIndex >= 0) {
                            if (newOrderProductDetails.quantity && newOrderProductDetails.unitPrice) {
                                order.products[productIndex].quantity = newOrderProductDetails.quantity;
                                order.products[productIndex].unitPrice = newOrderProductDetails.unitPrice;
                                order = editOrderPrices(order);
                            } else if (newOrderProductDetails.quantity) {
                                order.products[productIndex].quantity = newOrderProductDetails.quantity;
                            } else if (newOrderProductDetails.unitPrice) {
                                order.products[productIndex].unitPrice = newOrderProductDetails.unitPrice;
                                order = editOrderPrices(order);
                            }
                            if (newOrderProductDetails.name) {
                                order.products[productIndex].name = newOrderProductDetails.name;
                            }
                            await order.save();
                            return {
                                msg: getSuitableTranslations("Updating Order Details Process Has Been Successfuly !!", language),
                                error: false,
                                data: {},
                            }
                        }
                        return {
                            msg: getSuitableTranslations("Sorry, This Product For This Order Is Not Found !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
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
    } catch (err) {
        throw Error(err);
    }
}

async function cancelOrder(userId, orderId, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            const order = await orderModel.findById(orderId);
            if (order) {
                if (order.status === "cancelled") {
                    return {
                        msg: getSuitableTranslations("Sorry, This Request Cannot Be Canceled Because It Has Already Been Canceled !!", language),
                        error: true,
                        data: {},
                    }
                }
                if (order.status !== "pending") {
                    return {
                        msg: getSuitableTranslations("Sorry, This Request Cannot Be Canceled Because It Is Not In Pending Status !!", language),
                        error: true,
                        data: {},
                    }
                }
                await orderModel.updateOne({ _id: orderId }, { status: "cancelled" });
                user.wallet.fullDepositAmount += order.totalPriceAfterDiscount;
                user.wallet.remainingAmount = user.wallet.fullDepositAmount - user.wallet.fullWithdrawAmount;
                await user.save();
                await (new walletOperationsModel({
                    type: "deposit",
                    userId,
                    amount: order.totalPriceAfterDiscount,
                    operationNumber: await walletOperationsModel.countDocuments({ userId }) + 1
                })).save();
                return {
                    msg: getSuitableTranslations("Canceling Order Process For This User Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteOrder(authorizationId, orderId, ordersType, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const order = ordersType === "normal" ? await orderModel.findById(orderId) : await returnOrderModel.findById(orderId);
                if (order) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(order.storeId)) {
                        ordersType === "normal" ? await orderModel.updateOne({ _id: orderId }, { isDeleted: true }) : await returnOrderModel.updateOne({ _id: orderId }, { isDeleted: true });
                        return {
                            msg: getSuitableTranslations("Deleting Order Has Been Successfuly !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
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

async function deleteProductFromOrder(authorizationId, orderId, productId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                let order = await orderModel.findOne({ _id: orderId });
                if (order) {
                    if ((new mongoose.Types.ObjectId(admin.storeId)).equals(order.storeId)) {
                        const newOrderProducts = order.products.filter((order_product) => order_product.productId !== productId);
                        const newOrderProductsLength = newOrderProducts.length;
                        if (newOrderProductsLength === 0) {
                            return {
                                msg: getSuitableTranslations("Sorry, This Product For This Order Is Not Found !!", language),
                                error: true,
                                data: {},
                            }
                        }
                        if (newOrderProductsLength < order.products.length) {
                            order.products = newOrderProducts;
                            order = editOrderPrices(order);
                            await order.save();
                            return {
                                msg: getSuitableTranslations("Deleting Product From Order Has Been Successfuly !!", language),
                                error: false,
                                data: {
                                    newOrderProducts,
                                },
                            }
                        }
                        return {
                            msg: getSuitableTranslations("Sorry, This Product For This Order Is Not Found !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Order Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Order Is Not Found !!", language),
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
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getAllOrdersInsideThePage,
    getOrdersCount,
    getOrderDetails,
    createNewOrder,
    createNewRequestToReturnOrderProducts,
    approvingOnReturnProduct,
    refusalReturnProduct,
    updateOrder,
    changeCheckoutStatusToSuccessfull,
    updateOrderProduct,
    cancelOrder,
    deleteOrder,
    deleteProductFromOrder,
}
