import express from "express";
import paymentController from "./payment.controller.js";
const router = express.Router();

router.post('/midtrans/callback', paymentController.midtransCallback)

export default router