import express from 'express'
import usersController from '../controllers/usersController.js'
import verifyJWT from '../middleware/verifyJWT.js'
import messageController from "../controllers/messageController.js";

const router = express.Router()

router.route('/organizers')
    .post(usersController.createNewOrganizer)

router.route('/volunteers')
    .post(usersController.createNewVolunteer)

router.route('/validate/:userId')
    .put(usersController.validateUser)

router.route('/credential/:userId')
    .put(usersController.updateUserCredential)

router.route('/:emailAddress')
    .get(usersController.getUserByEmailAddress)

router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)

router.route('/id/:userId')
    .delete(usersController.deleteUserById)

router.route('/id/:userId')
    .get(usersController.getUserById)

router.route('/id/:userId')
    .get(usersController.getUserById)

router.route('/:userId')
    .put(usersController.updateUser)

router.route('/:userId/conversations').get( messageController.getConversationOverview)


export default router