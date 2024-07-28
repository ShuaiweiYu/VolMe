import express from "express";
import userController from "../controllers/usersController.js";
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

router.use(verifyJWT)

router.route("/")
    .get(userController.getAllUsers)

export default router
