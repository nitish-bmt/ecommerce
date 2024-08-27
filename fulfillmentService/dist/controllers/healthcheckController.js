"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = status;
const healthcheck_1 = require("../utils/healthcheck");
function status(req, res) {
    res
        .status(200)
        .json({
        "status": 200,
        "message": "Server is healthy",
        "serverUptime": (0, healthcheck_1.formattedServerUptime)()
    });
}
