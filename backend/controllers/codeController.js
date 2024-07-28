import { Code, CodeModel } from '../models/util/Code.js';
import { CODEUSAGE } from '../models/enums/CodeUsage.js';
import asyncHandler from 'express-async-handler';
import crypto from "crypto"

/**
 * @desc    Get code by id
 * @route   GET /codes
 * @access  Public
 */
const getCodeByEmail = asyncHandler(async (req, res) => {
    const { userId, usage } = req.body

    const code = await CodeModel.findOne({ assignTo: userId, isValid: true, usage: usage });

    if (code) {
        res.json(code)
    } else{
        res.status(404).json({ message: 'Code not found' })
    }
})

// @desc Generate a code for user registration
// @route POST /codes
const generateCode = asyncHandler(async (req, res) => {
    const { userId, usage } = req.body

    if (!userId) {
        return res.status(400).json({ message: 'Field userId is required' })
    }

    let codeObj;

    if (usage === CODEUSAGE.REGISTRATION) {
        codeObj = new Code(4, CODEUSAGE.REGISTRATION, userId)
    } else if (usage === CODEUSAGE.PASSWORDRESET) {
        codeObj = new Code(8, CODEUSAGE.PASSWORDRESET, userId)
    }

    const oldCode = await CodeModel.findOne({ assignTo: userId, isValid: true, usage: usage });
    if (oldCode) {
        oldCode.isValid = false;
        await oldCode.save();
    }

    const code = await CodeModel.create(codeObj)

    if (code) {
        res.status(201).json(code._id)
    } else {
        res.status(400)
    }
})

// @desc Generate the code for user registration
// @route POST /codes/check
const checkCodeValidity = asyncHandler(async (req, res) => {
    const { userId, usage, inputValue } = req.body
    
    const code = await CodeModel.findOne({assignTo: userId, isValid: true, usage: usage})

    if (code && Number(inputValue) === code.value) {
        code.isValid = false
        if (code.usage === CODEUSAGE.PASSWORDRESET) {
            code.secret = crypto.randomBytes(16).toString('hex')
        }
        const updatedCode = await code.save()
        res.status(200).json({ message: 'Code is valid.', secret: code.secret });
    } else {
        res.status(400).json({ message: 'Code is invalid.' });
    }
})

export default {
    getCodeByEmail,
    generateCode,
    checkCodeValidity
}