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
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    //clear Posts collection
    yield user_model_1.default.remove({ email: email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.remove({ email: email });
    mongoose_1.default.connection.close();
}));
const email = "test1@a.com";
const wrongEmail = "test2@a.com";
const password = "123456789";
const wrongPassword = "1234567890";
let accessToken = "";
let refreshToken = "";
describe("This is Auth API test", () => {
    test("Test register API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/register')
            .send({ "email": email, "password": password });
        expect(response.statusCode).toEqual(200);
    }));
    test("Test login API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login')
            .send({ "email": email, "password": password });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
    }));
    test("Test register taken email API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/register')
            .send({ "email": email, "password": password });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test login wrong email API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login')
            .send({ "email": wrongEmail, "password": password });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test login wrong password API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login')
            .send({ "email": email, "password": wrongPassword });
        expect(response.statusCode).not.toEqual(200);
    }));
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    test("test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        //wait untill access token is expiered
        yield sleep(3000);
        let response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/test")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).not.toEqual(200);
        console.log("REFRESH TOKEN  " + refreshToken);
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/refresh")
            .set({ authorization: "barer " + refreshToken });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/test")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=auth_routes.test.js.map