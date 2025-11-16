const adminsMiddlewares = require("./admins");
const adsMiddlewares = require("./ads");
const authMiddlewares = require("./auth");
const categoriesMiddlewares = require("./categories");
const commonMiddlewares = require("./common");
const filesMiddlewares = require("./files");
const globalMiddlewares = require("./global");
const numbersMiddlewares = require("./numbers");
const ordersMiddlewares = require("./orders");
const productsMiddlewares = require("./products");
const ratingsMiddlewares = require("./ratings");
const sortMiddlewares = require("./sort");
const storesMiddlewares = require("./stores");
const usersMiddlewares = require("./users");

module.exports = {
    adminsMiddlewares,
    adsMiddlewares,
    categoriesMiddlewares,
    authMiddlewares,
    commonMiddlewares,
    filesMiddlewares,
    globalMiddlewares,
    numbersMiddlewares,
    ordersMiddlewares,
    productsMiddlewares,
    ratingsMiddlewares,
    sortMiddlewares,
    storesMiddlewares,
    usersMiddlewares,
}