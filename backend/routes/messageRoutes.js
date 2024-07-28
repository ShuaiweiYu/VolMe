import express from "express";
import messageController from "../controllers/messageController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT)

router.get("/:id",messageController.getMessages);
router.post("/send/:id",messageController.sendMessage);
//router.get("/:id",  messageController.getMessages);
//router.post("/send/:id", messageController.sendMessage);

export default router;
