const { Router, static } = require("express");

const { json } = require("body-parser");

const cors = require("cors");

const { validateLanguage } = require("../global");

const path = require("path");

// ==================================================================

const app = Router();

app.use(cors());

app.use(json({ limit: "999999999kb" }));

app.use((req, res, next) => {
    const language = req.query.language;
    if (language) {
        return validateLanguage(language, res, next)
    }
    next();
});

app.use("/assets", static(path.join(__dirname, "..", "..", "assets")));

module.exports = app;