import express from 'express';
//import formidable from "express-formidable";
const router = express.Router();
import eventController from "../controllers/eventController.js";
import verifyJWT from '../middleware/verifyJWT.js'
import messageController from "../controllers/messageController.js";

//router.use(verifyJWT)

//router.get("/:id",  verifyJWT,messageController.getMessages);

router
    .route('/')
    .get(eventController.getEvents)
    .post(eventController.createEvent)

router.route('/allEvents').get(eventController.getAllEvents)

router
    .route('/:id')
    .post(eventController.addEventReview)
    .delete(eventController.deleteEventReview)

router.get('/top', eventController.getTopEvents)
router.get('/new', eventController.getNewEvents)
router.get('/organiser/:organiserId', eventController.getEventsByOrganiser);

router
    .route('/:id')
    .get(eventController.getEventById)
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent)

router.route('/count')
    .post(eventController.getUserMonthlyEventsCount)

//router.route('/edit/:id').put(eventController.updateEvent)


export default router;