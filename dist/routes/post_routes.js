"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get('/', post_1.default.getAllPosts);
router.post('/', auth_middleware_1.default, post_1.default.createNewPost);
router.get('/:id', post_1.default.getPostById);
router.delete('/:id', auth_middleware_1.default, post_1.default.deletePostById);
module.exports = router;
//# sourceMappingURL=post_routes.js.map