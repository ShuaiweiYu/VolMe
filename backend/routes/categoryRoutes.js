import express from 'express';
import {
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory,
} from '../controllers/categoryController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

//router.use(verifyJWT)

router.route('/')
    .post(createCategory);

router.route('/:categoryId')
    .put(updateCategory);

router.route('/:categoryId')
    .delete(removeCategory);

router.route('/categories')
    .get(listCategory);

router.route('/:id')
    .get(readCategory);

export default router;
