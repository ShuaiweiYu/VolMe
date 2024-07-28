import express from "express";
const router = express.Router()
import paymentItemController from "../controllers/paymentItemController.js";
import verifyJWT from '../middleware/verifyJWT.js'

router.route('/items')
    .get(paymentItemController.getPaymentItems)

router.use(verifyJWT)

router.route('/items')
    .post(paymentItemController.createPaymentItem)
    .delete(paymentItemController.deletePaymentItem)

router.route('/items/:itemId')
    .get(paymentItemController.getPaymentItemById)
    .put(paymentItemController.setDiscount)

export default router