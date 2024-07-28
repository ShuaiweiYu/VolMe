import express from 'express';
import codeController from '../controllers/codeController.js';

const router = express.Router();

router.route('/')
    .get(codeController.getCodeByEmail)
    .post(codeController.generateCode)

router.route('/check')
    .post(codeController.checkCodeValidity)

export default router