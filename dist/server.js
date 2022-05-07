"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("seerver is starting..");
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL);
const db = mongoose_1.default.connection;
db.on("error", (error) => {
    console.error(error);
});
db.once("open", () => {
    console.log("connected to mongo");
});
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "1mb" }));
app.use(body_parser_1.default.json());
const post_routes_1 = __importDefault(require("./routes/post_routes"));
app.use("/post", post_routes_1.default);
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
app.use("/auth", auth_routes_1.default);
// import swaggerUI from "swagger-ui-express";
// import swaggerJsDoc from "swagger-jsdoc";
// if (process.env.NODE_ENV == "development") {
//   const options = {
//     definition: {
//       openapi: "3.0.0",
//       info: {
//         title: "SCE 20222 simple REST backend API",
//         version: "1.0.0",
//         description: "A simple REST backend API with JWT authentication using refresh token",
//       },
//       servers: [{ url: "http://localhost:" + process.env.PORT }],
//     },
//     apis: ["./src/routes/*.ts"],
//   };
//   const specs = swaggerJsDoc(options);
//   app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// }
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
module.exports = server;
//# sourceMappingURL=server.js.map