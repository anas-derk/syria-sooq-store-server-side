// Import Mongoose

const { mongoose } = require("../server");

// Create Admin Schema

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isWebsiteOwner: {
        type: Boolean,
        default: false,
    },
    isMerchant: {
        type: Boolean,
        default: false,
    },
    storeId: {
        type: String,
        required: true,
    },
    permissions: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: [
                        "Update Order Info",
                        "Delete Order",
                        "Update Order Info",
                        "Update Order Product Info",
                        "Delete Order Product",
                        "Add New Category",
                        "Update Category Info",
                        "Delete Category",
                        "Add New Product",
                        "Update Product Info",
                        "Delete Product",
                        "Add New Admin",
                        "Add New Ad",
                        "Update Ad Info",
                        "Delete Ad"
                    ],
                },
                value: {
                    type: Boolean,
                    required: true,
                }
            },
        ],
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockingReason: String,
    creatingDate: {
        type: Date,
        default: Date.now,
    },
    blockingDate: Date,
    dateOfCancelBlocking: Date,
});

// Create Admin Model From Admin Schema

const adminModel = mongoose.model("admin", adminSchema);

// Create Store Schema

const storeSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
    },
    coverImagePath: {
        type: String,
        required: true,
    },
    profileImagePath: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        enum: [
            "lattakia",
            "tartus",
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
            "raqqa",
            "hasakah",
            "damascus",
            "rif-damascus",
            "aleppo",
            "quneitra"
        ],
    },
    category: {
        type: String,
        required: true,
    },
    headquarterAddress: {
        type: String,
        required: true,
    },
    taxNumber: {
        type: String,
        required: true,
    },
    ownerFullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bankAccountInformation: {
        type: String,
        required: true,
    },
    commercialRegisterFilePath: {
        type: String,
        required: true,
    },
    taxCardFilePath: {
        type: String,
        required: true,
    },
    addressProofFilePath: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "approving",
            "rejecting",
            "blocking",
        ],
    },
    isMainStore: Boolean,
    creatingOrderDate: {
        type: Date,
        default: Date.now,
    },
    approveDate: Date,
    blockingDate: Date,
    dateOfCancelBlocking: Date,
    blockingReason: String,
    ratings: {
        type: Object,
        default: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },
});

// Create Store Model From Store Schema

const storeModel = mongoose.model("store", storeSchema);

// Create Product Schema

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "categorie",
        }],
    },
    discount: {
        type: Number,
        default: 0,
    },
    discountInOfferPeriod: {
        type: Number,
        default: 0,
    },
    offerDescription: String,
    numberOfOrders: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    isAvailableForDelivery: {
        type: Boolean,
        default: false,
    },
    ratings: {
        type: Object,
        default: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },
    postOfDate: {
        type: Date,
        default: Date.now,
    },
    imagePath: {
        type: String,
        required: true,
    },
    galleryImagesPaths: Array,
    startDiscountPeriod: Date,
    endDiscountPeriod: Date,
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: true,
    },
    hasCustomizes: {
        type: Boolean,
        default: false,
    },
    customizes: {
        hasColors: {
            type: Boolean,
            default: false,
        },
        colors: [],
        hasSizes: {
            type: Boolean,
            default: false,
        },
        sizes: {
            s: {
                type: Boolean,
                default: false,
            },
            m: {
                type: Boolean,
                default: false,
            },
            l: {
                type: Boolean,
                default: false,
            },
            xl: {
                type: Boolean,
                default: false,
            },
            xxl: {
                type: Boolean,
                default: false,
            },
            xxxl: {
                type: Boolean,
                default: false,
            },
            "4xl": {
                type: Boolean,
                default: false,
            }
        },
        allowCustomText: {
            type: Boolean,
            default: false,
        },
        allowAdditionalNotes: {
            type: Boolean,
            default: false,
        },
        allowUploadImages: {
            type: Boolean,
            default: false,
        },
        hasAdditionalCost: {
            type: Boolean,
            default: false,
        },
        additionalCost: {
            type: Number,
            default: 0,
        },
        hasAdditionalTime: {
            type: Boolean,
            default: false,
        },
        additionalTime: {
            type: Number,
            default: 0,
        },
    }
});

// Create Product Model From Product Schema

const productModel = mongoose.model("product", productSchema);

// Create User Schema

const userSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        enum: [
            "lattakia",
            "tartus",
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
            "raqqa",
            "hasakah",
            "damascus",
            "rif-damascus",
            "aleppo",
            "quneitra"
        ],
    },
    email: String,
    mobilePhone: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: true,
    },
    fullName: {
        type: String,
        default: "",
    },
    addresses: {
        type: Array,
        default: [],
    },
    interests: {
        type: Array,
        default: [],
    },
    followedStores: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: "store",
        }],
        default: [],
    },
    wallet: {
        fullDepositAmount: {
            type: Number,
            default: 0
        },
        fullWithdrawAmount: {
            type: Number,
            default: 0
        },
        remainingAmount: {
            type: Number,
            default: 0
        },
    },
    imagePath: {
        type: String,
        default: "",
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

// Create Account Verification Codes Schema

const accountVerificationCodesShema = new mongoose.Schema({
    email: String,
    mobilePhone: String,
    code: {
        type: String,
        required: true,
    },
    createdDate: Date,
    expirationDate: {
        type: Date,
        required: true,
    },
    requestTimeCount: {
        type: Number,
        default: 1,
    },
    isBlockingFromReceiveTheCode: {
        type: Boolean,
        default: false,
    },
    receiveBlockingExpirationDate: Date,
    typeOfUse: {
        type: String,
        default: "to activate account",
        enum: [
            "to activate account",
            "to reset password",
        ],
    }
});

// Create Account Verification Codes Model From Account Codes Schema

const accountVerificationCodesModel = mongoose.model("account_verification_codes", accountVerificationCodesShema);

// Create Category Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "categorie",
        default: null
    },
    imagePath: {
        type: String,
        required: true,
    },
});

// Create Category Model From Category Schema

const categoryModel = mongoose.model("categorie", categorySchema);

// Create Order Schema

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: true,
    },
    totalPriceBeforeDiscount: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    totalPriceAfterDiscount: {
        type: Number,
        default: 0,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    checkoutStatus: {
        type: String,
        default: this.orderType === "normal" ? "Checkout Incomplete" : "Checkout Successfull",
        enum: [
            "Checkout Incomplete",
            "Checkout Successfull"
        ],
    },
    paymentGateway: {
        type: String,
        required: true,
        enum: [
            "Wallet",
            "Credit Card",
            "Upon Receipt"
        ],
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "shipping",
            "completed",
            "cancelled"
        ]
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        message: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "none",
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        unitDiscount: {
            type: Number,
            default: 0,
        },
        imagePath: {
            type: String,
            default: "none",
        },
    }],
    addedDate: {
        type: Date,
        default: Date.now,
    },
    orderNumber: Number,
    city: {
        type: String,
        required: true,
        enum: [
            "lattakia",
            "tartus",
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
            "raqqa",
            "hasakah",
            "damascus",
            "rif-damascus",
            "aleppo",
            "quneitra"
        ]
    },
    address: {
        type: String,
        required: true,
    },
    addressDetails: {
        type: String,
        required: true,
    },
    closestPoint: {
        type: String,
        default: "",
    },
    additionalAddressDetails: {
        type: String,
        default: "",
    },
    floorNumber: {
        type: Number,
        required: true,
    },
    additionalNotes: {
        type: String,
        default: "",
    },
    mobilePhone: {
        type: String,
        required: true,
    },
    backupMobilePhone: {
        type: String,
        default: "",
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    email: String,
    fullName: {
        type: String,
        required: true,
    },
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

// Create Return Order Schema

const returnOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "store",
        required: true,
    },
    originalOrder: {
        type: mongoose.Types.ObjectId,
        ref: "order",
        required: true,
    },
    totalPriceBeforeDiscount: {
        type: Number,
        required: true,
    },
    totalDiscount: {
        type: Number,
        required: true,
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true,
    },
    orderAmount: {
        type: Number,
        required: true,
    },
    approvedTotalPriceBeforeDiscount: {
        type: Number,
        default: 0,
    },
    approvedTotalDiscount: {
        type: Number,
        default: 0,
    },
    approvedTotalPriceAfterDiscount: {
        type: Number,
        default: 0,
    },
    approvedOrderAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "awaiting products",
        enum: [
            "awaiting products",
            "received products",
            "checking products",
            "partially return products",
            "fully return products",
            "return refused"
        ]
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        unitDiscount: {
            type: Number,
            default: 0,
        },
        approvedQuantity: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            default: "",
        },
        imagePath: {
            type: String,
            required: true,
        },
        returnReason: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "checking",
            enum: [
                "checking",
                "full approval",
                "partial approval",
                "reject",
            ],
        }
    }],
    addedDate: {
        type: Date,
        default: Date.now,
    },
    orderNumber: Number,
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

// Create Return Order Model From Return Order Schema

const returnOrderModel = mongoose.model("return_order", returnOrderSchema);

// Create Global Password Schema

const globalPasswordSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Create Global Password Model From Global Password Schema

const globalPasswordModel = mongoose.model("global_password", globalPasswordSchema);

// Create Referal Schema

const referalShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    referalDate: {
        type: Date,
        default: Date.now,
    },
    isAppeared: {
        type: Boolean,
        default: true,
    }
});

// Create Referal Model From Referal Schema

const referalModel = mongoose.model("referal", referalShema);

// Create Favorite Product Schema

const favoriteProductShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

// Create Favorite Product Model From Favorite Product Schema

const favoriteProductModel = mongoose.model("favorite_products", favoriteProductShema);

// Create Products Wallet Schema

const productsWalletShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

// Create Products Wallet Model From Products Wallet Schema

const productsWalletModel = mongoose.model("products_wallet", productsWalletShema);

// Create Rating Schema

const ratingShema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["product", "store"]
    },
    id: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    }
});

// Create Rating Model From Rating Schema

const ratingModel = mongoose.model("rating", ratingShema);

// Create Ads Schema

const adsSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: () => this.type === "elite",
    },
    city: {
        type: String,
        required: () => this.type === "panner",
        enum: [
            "lattakia",
            "tartus",
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
            "raqqa",
            "hasakah",
            "damascus",
            "rif-damascus",
            "aleppo",
            "quneitra"
        ],
    },
    imagePath: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "panner",
        enum: ["panner", "elite"],
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true,
    },
    dateOfPost: {
        type: Date,
        default: Date.now,
    },
});

// Create Ads Model From Ads Schema

const adsModel = mongoose.model("ad", adsSchema);

// Create Cart Schema

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    message: {
        type: String,
        default: "",
    },
    customText: {
        type: String,
        default: "",
    },
    additionalNotes: {
        type: String,
        default: "",
    },
    additionalFiles: [String]
});

// Create Card Model From Cart Schema

const cartModel = mongoose.model("cart", cartSchema);

// Create Wallet Operations Schema

const walletOperationsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["deposit", "withdraw"]
    },
    operationNumber: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

// Create Wallet Operations Model From Wallet Operations Schema

const walletOperationsModel = mongoose.model("wallet_operations", walletOperationsSchema);

module.exports = {
    mongoose,
    adminModel,
    storeModel,
    productModel,
    userModel,
    accountVerificationCodesModel,
    categoryModel,
    orderModel,
    returnOrderModel,
    globalPasswordModel,
    referalModel,
    favoriteProductModel,
    productsWalletModel,
    ratingModel,
    adsModel,
    cartModel,
    walletOperationsModel
}
