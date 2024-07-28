import express from 'express';
import documentController from '../controllers/documentController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

router.use(verifyJWT)

router.route('/create')
    .post(documentController.createDocument)
router.route('/list/:userId')
    .get(documentController.getDocumentsByUserId)
router.route('/list/:userId/:eventId')
    .get(documentController.getDocumentsByUserIdAndEventId)
router.route('/delete/:documentId')
    .delete(documentController.deleteDocument)

// Route to get a document by ID
router.route('/:documentId')
    .get(documentController.getDocumentById);


export default router