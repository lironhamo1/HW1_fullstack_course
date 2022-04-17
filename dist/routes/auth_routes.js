"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../controllers/auth"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.post("/register", auth_1.default.register);
router.post("/login", auth_1.default.login);
router.get("/refresh", auth_1.default.renewToken);
router.get("/test", auth_middleware_1.default, auth_1.default.test);
module.exports = router;
//# sourceMappingURL=auth_routes.js.map