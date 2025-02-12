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
    userId: {
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
            "homs",
            "hama",
            "idleb",
            "daraa",
            "suwayda",
            "deer-alzoor",
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
    interests: {
        type: Array,
        default: [],
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
        type: String,
        default: "",
    },
    storeId: {
        type: String,
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
    totalAmountBeforeApplyCoupon: {
        type: Number,
        default: 0,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    checkoutStatus: {
        type: String,
        default: "Checkout Incomplete",
        enum: [
            "Checkout Incomplete",
            "Checkout Successfull"
        ],
    },
    paymentGateway: {
        type: String,
        required: true,
        enum: [
            "binance"
        ],
    },
    status: {
        type: String,
        default: "pending",
        enum: [
            "pending",
            "shipping",
            "completed"
        ]
    },
    isApplyCoupon: {
        type: Boolean,
        default: false,
    },
    couponDetails: {
        code: {
            type: String,
            required: function () {
                return this.isApplyCoupon;
            },
        },
        discountPercentage: {
            type: Number,
            required: function () {
                return this.isApplyCoupon;
            },
        },
        storeId: {
            type: String,
            required: function () {
                return this.isApplyCoupon;
            },
        },
    },
    billingAddress: {
        firstName: {
            type: String,
            default: "none",
        },
        lastName: {
            type: String,
            default: "none",
        },
        companyName: {
            type: String,
            default: "none",
        },
        streetAddress: {
            type: String,
            default: "none",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postalCode: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
    },
    shippingAddress: {
        firstName: {
            type: String,
            default: "none",
        },
        lastName: {
            type: String,
            default: "none",
        },
        companyName: {
            type: String,
            default: "none",
        },
        streetAddress: {
            type: String,
            default: "none",
        },
        apartmentNumber: {
            type: Number,
            default: 1,
        },
        city: {
            type: String,
            default: "none",
        },
        postalCode: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "none",
        },
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
        name: {
            type: String,
            default: "none",
        },
        unitPrice: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
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
    requestNotes: {
        type: String,
        default: "",
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        default: false,
        type: Boolean,
    },
    shippingCost: {
        forLocalProducts: {
            type: Number,
            default: 0,
        },
        forInternationalProducts: {
            type: Number,
            default: 0,
        }
    },
});

// Create Order Model From Order Schema

const orderModel = mongoose.model("order", orderSchema);

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
    imagePath: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "panner",
        enum: ["panner", "elite"],
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
});

// Create Cart Model From Cart Schema

const cartModel = mongoose.model("cart", cartSchema);

module.exports = {
    mongoose,
    adminModel,
    storeModel,
    productModel,
    userModel,
    accountVerificationCodesModel,
    categoryModel,
    orderModel,
    globalPasswordModel,
    referalModel,
    favoriteProductModel,
    productsWalletModel,
    ratingModel,
    adsModel,
    cartModel,
}