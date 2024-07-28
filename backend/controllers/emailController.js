import {CodeModel} from '../models/util/Code.js'
import asyncHandler from 'express-async-handler'
import {sendEmail, sendCodeEmail} from "../services/emailService.js"

// @desc send registration code to the user
// @route POST /emails/registration
const sendRegistrationConfirmationEmail = asyncHandler(async (req, res) => {
    const { userId, usage, username, user_email_address } = req.body;

    const codeObj = await CodeModel.findOne({ assignTo: userId, isValid: true, usage: usage });

    if (!codeObj) {
        res.status(400).json({ message: 'No code to send' })
    }

    const params = {
        username: username,
        user_email_address: user_email_address,
        code: codeObj.value,
        purpose: "your registration"
    };

    try {
        const response = await sendCodeEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'fail to send' })
    }
})

// @desc send password reset code to the user
// @route POST /emails/passwordreset
const sendPasswordResetEmail = asyncHandler(async (req, res) => {
    const { userId, usage, username, user_email_address } = req.body;

    const codeObj = await CodeModel.findOne({ assignTo: userId, isValid: true, usage: usage });

    if (!codeObj) {
        res.status(400).json({ message: 'No code to send' })
    }
    const params = {
        username: username,
        user_email_address: user_email_address,
        code: codeObj.value,
        purpose: "resetting your password"
    };

    try {
        const response = await sendCodeEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        res.status(500).json({ message: 'fail to send' })
    }
})

const sendAcceptNotificationEmail = asyncHandler(async (req, res) => {
    const { username, user_email_address, eventName } = req.body;
    const subject = `Volme - Your application for "${eventName}" has been accepted`;
    const content = `Dear ${username},
    \n\nCongratulations! Your application for the event "${eventName}" has been accepted! 
    \n\nPlease prepare yourself according to the time schedule, if the event organizer have more information for you, 
    they will send you messages in the chat portal in the Volme platform, please check for newest message.
    \n\nIf you can't make it in time, please withdraw your application.
    \n\nBest wishes,
    \n\nVolme`

    const params = {
        user_email_address: user_email_address,
        subject: subject,
        content: content,
    };

    try {
        const response = await sendEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        res.status(500).json({ message: 'fail to send' })
    }
})

const sendDeclineNotificationEmail = asyncHandler(async (req, res) => {
    const { username, user_email_address, eventName } = req.body;
    const subject = `Volme - Your application for "${eventName}" has been rejected`;
    const content = `Dear ${username},
    \n\nWe are sorry to inform you that your application for the event "${eventName}" has been rejected. 
    \n\nPlease don't consider this as an devaluation of your skills. 
    The decision is yet not final, we will inform you about newest changes.
    \n\nBest wishes,
    \n\nVolme`

    const params = {
        user_email_address: user_email_address,
        subject: subject,
        content: content,
    };

    try {
        const response = await sendEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        res.status(500).json({ message: 'fail to send' })
    }
})

const sendWithdrawNotificationEmail = asyncHandler(async (req, res) => {
    const { username, user_email_address, eventName } = req.body;
    const subject = `Volme - Your application for "${eventName}" is being reconsidered`;
    const content = `Dear ${username},
    \n\nYour application for the event "${eventName}" is being reconsidered now. 
    \n\nWe will informing you about all possible update.
    \n\nBest wishes,
    \n\nVolme`

    const params = {
        user_email_address: user_email_address,
        subject: subject,
        content: content,
    };

    try {
        const response = await sendEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        res.status(500).json({ message: 'fail to send' })
    }
})

const sendApplicationNotificationEmail = asyncHandler(async (req, res) => {
    const { username, user_email_address, eventName } = req.body;
    const subject = `Volme - Your event "${eventName}" received a new application`;
    const content = `Dear ${username},
    \n\nYour event "${eventName}" received a new application. 
    \n\nPlease go to application management portal to view all applications
    \n\nBest wishes,
    \n\nVolme`

    const params = {
        user_email_address: user_email_address,
        subject: subject,
        content: content,
    };

    try {
        const response = await sendEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        res.status(500).json({ message: 'fail to send' })
    }
})

const sendContactEmail = asyncHandler(async (req, res) => {
    const { email_address, name, info  } = req.body;
    const subject = `your receive a contact from Volme`;
    const content = `you received a contact from Volme, below is the content
    \nsender: ${name}
    \nsender's email: ${email_address}
    \n\ncontent: ${info}`

    const params = {
        user_email_address: "shuaiwei.yu@tum.de",
        subject: subject,
        content: content,
    };

    try {
        const response = await sendEmail(params);
        res.status(200).json({ message: 'success to send' })
    } catch (error) {
        res.status(500).json({ message: 'fail to send' })
    }
})

export default {
    sendRegistrationConfirmationEmail,
    sendPasswordResetEmail,
    sendApplicationNotificationEmail,
    sendAcceptNotificationEmail,
    sendDeclineNotificationEmail,
    sendWithdrawNotificationEmail,
    sendContactEmail
}