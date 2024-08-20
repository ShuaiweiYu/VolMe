import express from 'express';
const router = express.Router();
import eventController from "../controllers/eventController.js";
import verifyJWT from '../middleware/verifyJWT.js'
import messageController from "../controllers/messageController.js";

router.route('/')
    .get(eventController.getEvents)

router.route('/organiser/:organiserId')
    .get(eventController.getEventsByOrganiser);

router.route('/city')
    .get(eventController.getCitiesByEventCount)

router.route('/event/:id')
    .get(eventController.getEventById)

router.use(verifyJWT)

router.route('/')
    .post(eventController.createEvent)

router.route('/:id')
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent)

router.route('/review/:id')
    .post(eventController.addEventReview)
    .delete(eventController.deleteEventReview)

router.route('/count')
    .post(eventController.getUserMonthlyEventsCount)

export default router;