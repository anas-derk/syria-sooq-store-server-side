const adminsRouter = require("./admins");
const adsRouter = require("./ads");
const brandsRouter = require("./brands");
const cartRouter = require("./cart");
const categoriesRouter = require("./categories");
const favoriteProductsRouter = require("./favorite_products");
const globalPasswordsRouter = require("./global_passwords");
const notificationsRouter = require("./notifications");
const ordersRouter = require("./orders");
const productsWalletRouter = require("./products_wallets");
const productsRouter = require("./products");
const ratingsRouter = require("./ratings");
const referalsRouter = require("./referals");
const storesRouter = require("./stores");
const usersRouter = require("./users");
const walletOperationsRouter = require("./wallet_operations");

const { Router } = require("express")

const routes = Router();

routes.use("/admins", adminsRouter);

routes.use("/ads", adsRouter);

routes.use("/brands", brandsRouter);

routes.use("/cart", cartRouter);

routes.use("/categories", categoriesRouter);

routes.use("/favorite-products", favoriteProductsRouter);

routes.use("/global-passwords", globalPasswordsRouter);

routes.use("/notifications", notificationsRouter);

routes.use("/orders", ordersRouter);

routes.use("/wallet", productsWalletRouter);

routes.use("/products", productsRouter);

routes.use("/ratings", ratingsRouter);

routes.use("/referals", referalsRouter);

routes.use("/stores", storesRouter);

routes.use("/users", usersRouter);

routes.use("/wallet-operations", walletOperationsRouter);

module.exports = routes;
