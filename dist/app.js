"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("./server"));
const socket_server_1 = require("./socket_server");
(0, socket_server_1.initSocketServer)(server_1.default);
const PORT = process.env.PORT;
server_1.default.listen(PORT, () => {
    console.log('server started on port ' + PORT);
});
module.exports = server_1.default;
//# sourceMappingURL=app.js.map