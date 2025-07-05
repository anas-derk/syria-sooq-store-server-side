const routes = require("../routes");
const coreMiddlewares = require("../middlewares/core");
const express = require("express");
const app = express();

app.set("x-powered-by", false);

app.set("trust proxy", true);

// Handle Middlewares
app.use(coreMiddlewares);

// Handle Routes
app.use(routes);

module.exports = app;