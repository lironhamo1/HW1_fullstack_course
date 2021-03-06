"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const socket_server_1 = require("../socket_server");
const message = "this is my test message";
let sender = "1234567890";
let retId = "";
const email = "test@a.com";
const password = "1234567890";
let accessToken = "";
const serverCleanup = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        app_1.default.close(() => {
            resolve();
        });
    });
});
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    //clear Posts collection
    yield post_model_1.default.remove({ sender: sender });
    yield user_model_1.default.remove({ email: email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.deleteMany({ sender: sender });
    yield user_model_1.default.deleteMany({ email: email });
    yield (0, socket_server_1.closeSocketServer)();
    yield serverCleanup();
    yield mongoose_1.default.connection.close();
}));
describe("This is Post API test", () => {
    test("Test register to get access token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/register")
            .send({ email: email, password: password });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.access_token;
        expect(accessToken).not.toBeNull();
        sender = response.body._id;
    }));
    test("Test Post get API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/post");
        expect(response.statusCode).toEqual(200);
    }));
    test("Test Post post API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/post")
            .set({ authorization: "barer " + accessToken })
            .send({
            message: message,
            sender: sender,
        });
        expect(response.statusCode).toEqual(200);
        const retMessage = response.body.message;
        const retSender = response.body.sender._id;
        retId = response.body._id;
        expect(retMessage).toEqual(message);
        expect(retSender).toEqual(sender);
        expect(retId).not.toEqual(null);
    }));
    test("Test Post post no db API", () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/post")
            .set({ authorization: "barer " + accessToken })
            .send({
            message: message,
            sender: sender,
        });
        expect(response.statusCode).not.toEqual(200);
        yield mongoose_1.default.connect(process.env.DATABASE_URL);
    }));
    test("Test get Post by id API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/post/" + retId);
        expect(response.statusCode).toEqual(200);
        const retMessage = response.body.message;
        const retSender = response.body.sender;
        const retId2 = response.body._id;
        expect(retMessage).toEqual(message);
        expect(retSender).toEqual(sender);
        expect(retId2).toEqual(retId);
    }));
    test("Test get Post by id with bad id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/post/" + retId + '1');
        expect(response.statusCode).not.toEqual(200);
    }));
    // test("Test get Post by id with null id", async () => {
    //   const response = await request(server).get("/post/ ");
    //   expect(response.statusCode).not.toEqual(200);
    // });
    test("Test get Post by sender API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/post?sender=" + sender);
        expect(response.statusCode).toEqual(200);
        const retMessage = response.body[0].message;
        const retSender = response.body[0].sender;
        const retId2 = response.body[0]._id;
        expect(retMessage).toEqual(message);
        expect(retSender).toEqual(sender);
        expect(retId2).toEqual(retId);
    }));
    test("Test update post message by id API", () => __awaiter(void 0, void 0, void 0, function* () {
        const newMsg = 'new message';
        let response = yield (0, supertest_1.default)(app_1.default)
            .post("/post/updateMessage/" + retId)
            .set({ authorization: "barer " + accessToken })
            .send({ "update": newMsg });
        expect(response.statusCode).toEqual(200);
        response = yield (0, supertest_1.default)(app_1.default).get("/post/" + retId);
        expect(response.statusCode).toEqual(200);
        const retMessage = response.body.message;
        const retId2 = response.body._id;
        expect(retMessage).toEqual(newMsg);
        expect(retId2).toEqual(retId);
    }));
    test("Test update post message by id with bad id API", () => __awaiter(void 0, void 0, void 0, function* () {
        const newMsg = 'new message';
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/post/updateMessage/" + retId + "1")
            .set({ authorization: "barer " + accessToken })
            .send({ "update": newMsg });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test update post message by id with null id API", () => __awaiter(void 0, void 0, void 0, function* () {
        const newMsg = 'new message';
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/post/updateMessage/")
            .set({ authorization: "barer " + accessToken })
            .send({ "update": newMsg });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test delete post by id API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete("/post/" + retId)
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).toEqual(200);
        const response2 = yield (0, supertest_1.default)(app_1.default).get("/post/" + retId);
        expect(response2.statusCode).toEqual(400);
    }));
    test("Test delete post by id when id is bad API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete("/post/" + retId + "1")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test delete post by id when id is null API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .delete("/post/")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).not.toEqual(200);
    }));
});
//# sourceMappingURL=post_routes.test.js.map