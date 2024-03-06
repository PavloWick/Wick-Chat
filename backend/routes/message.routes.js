import express from 'express';
import {getMessage,sendMessage} from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// id is the param name in the header
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);


export default router;