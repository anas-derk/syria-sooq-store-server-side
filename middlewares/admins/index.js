const { getResponseObject } = require("../../helpers/responses");
const { verify } = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
            res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
            return;
        }
        req.data = decode;
        next();
    });
}

module.exports = {
    adminMiddleware,
}