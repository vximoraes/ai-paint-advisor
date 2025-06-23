import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { asyncWrapper } from "../utils/asyncWrapper";

const router = Router();
const chatController = new ChatController();

router
    .post("/chat", asyncWrapper(chatController.handleChat.bind(chatController)))
    .post("/reindex", asyncWrapper(chatController.handleReindex.bind(chatController)));

export default router;