import express from 'express';
const router = express.Router();
import eventController from "../controllers/eventController.js";
import verifyJWT from '../middleware/verifyJWT.js'
import messageController from "../controllers/messageController.js";

router.route('/')
    .get(eventController.getEvents)

router.route('/allEvents').get(eventController.getAllEvents)

router.route('/:id')
    .get(eventController.getEventById)

router.get('/top', eventController.getTopEvents)
router.get('/new', eventController.getNewEvents)
router.get('/organiser/:organiserId', eventController.getEventsByOrganiser);

router.get('/city', eventController.getCitiesByEventCount)

router.use(verifyJWT)

router.route('/')
    .post(eventController.createEvent)

router.route('/:id')
    .post(eventController.addEventReview)
    .delete(eventController.deleteEventReview)

router.route('/:id')
    .get(eventController.getEventById)
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent)

router.route('/count')
    .post(eventController.getUserMonthlyEventsCount)

export default router;