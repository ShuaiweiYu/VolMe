import express from 'express'
import paymentController from "../controllers/paymentController.js"
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

router.use(verifyJWT)
router.route('/order/create-order')
    .post(paymentController.createOrder)

router.route('/order/capture-order')
    .post(paymentController.captureOrder)

router.route('/subscription/create-product')
    .post(paymentController.createProduct)

router.route('/subscription/create-plan')
    .post(paymentController.createPlan)

router.route('/subscription/cancel')
    .post(paymentController.cancelSubscription)

router.route('/subscription/isValid')
    .post(paymentController.checkSubscriptionIsValid)

export default router