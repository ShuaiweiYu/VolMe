import express from 'express'
import emailController from '../controllers/emailController.js'

const router = express.Router()

router.route('/registration')
    .post(emailController.sendRegistrationConfirmationEmail)

router.route('/password-reset')
    .post(emailController.sendPasswordResetEmail)

router.route('/application-notification')
    .post(emailController.sendApplicationNotificationEmail)

router.route('/application-accepted')
    .post(emailController.sendAcceptNotificationEmail)

router.route('/application-declined')
    .post(emailController.sendDeclineNotificationEmail)

router.route('/application-withdraw')
    .post(emailController.sendWithdrawNotificationEmail)

router.route('/contact')
    .post(emailController.sendContactEmail)

export default router