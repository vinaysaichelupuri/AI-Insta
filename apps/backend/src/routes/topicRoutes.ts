import { Router } from "express";
import { submitTopic } from "../controllers/topicController";

const router = Router();

router.post("/", submitTopic);

export default router;
