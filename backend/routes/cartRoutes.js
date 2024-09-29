import express from "express";
import { getCart, addToCart } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/cart/:userId", authenticate, getCart);
router.post("/cart", authenticate, addToCart);

export default router;
