import express from 'express'
const router = express.Router()
import Auth from '../controllers/auth'
import authenticate from "../common/auth_middleware";

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.get("/refresh", Auth.renewToken);
router.get("/test", authenticate, Auth.test);




export = router
