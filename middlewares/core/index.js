const { Router, static } = require("express");

const { json } = require("body-parser");

const cors = require("cors");

const { validateLanguage, globalRateLimitMiddleware } = require("../global");

const path = require("path");

// ==================================================================

const app = Router();

app.use(cors());

app.use("/assets", static(path.join(__dirname, "..", "..", "assets")));

app.use(globalRateLimitMiddleware);

app.use(json({ limit: "2mb" }));

app.use((req, res, next) => {
    const language = req.query.language;
    if (language) {
        return validateLanguage(language, res, next);
    }
    next();
});

module.exports = app;