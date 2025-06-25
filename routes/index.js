const adminsRouter = require("./admins.router");
const adsRouter = require("./ads.router");
const brandsRouter = require("./brands.router");
const cartRouter = require("./cart.router");
const categoriesRouter = require("./categories.router");
const favoriteProductsRouter = require("./favorite_products.router");
const globalPasswordsRouter = require("./global_passwords.router");
const ordersRouter = require("./orders.router");
const productsWalletRouter = require("./products_wallet.router");
const productsRouter = require("./products.router");
const ratingsRouter = require("./ratings.router");
const referalsRouter = require("./referals.router");
const storesRouter = require("./stores.router");
const usersRouter = require("./users.router");
const walletOperationsRouter = require("./wallet_operations.router");

const { Router } = require("express")

const routes = Router();

routes.use("/admins", adminsRouter);

routes.use("/ads", adsRouter);

routes.use("/brands", brandsRouter);

routes.use("/cart", cartRouter);

routes.use("/categories", categoriesRouter);

routes.use("/favorite-products", favoriteProductsRouter);

routes.use("/global-passwords", globalPasswordsRouter);

routes.use("/orders", ordersRouter);

routes.use("/wallet", productsWalletRouter);

routes.use("/products", productsRouter);

routes.use("/ratings", ratingsRouter);

routes.use("/referals", referalsRouter);

routes.use("/stores", storesRouter);

routes.use("/users", usersRouter);

routes.use("/wallet-operations", walletOperationsRouter);

module.exports = routes;
