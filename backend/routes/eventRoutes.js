import express from 'express';
const router = express.Router();
import eventController from "../controllers/eventController.js";
import verifyJWT from '../middleware/verifyJWT.js'
import messageController from "../controllers/messageController.js";

router.route('/')
    .get(eventController.getEvents)

router.route('/allEvents').get(eventController.getAllEvents)

router.get('/organiser/:organiserId', eventController.getEventsByOrganiser);
router.route('/city')
    .get(eventController.getCitiesByEventCount)

router.route('event/:id')
    .get(eventController.getEventById)

router.use(verifyJWT)

router.route('/')
    .post(eventController.createEvent)

// todo:这里不会有问题？两个路径都是id
router.route('/:id')
    .post(eventController.addEventReview)
    .delete(eventController.deleteEventReview)

router.route('/:id')
    .put(eventController.updateEvent)
    .delete(eventController.deleteEvent)

router.route('/count')
    .post(eventController.getUserMonthlyEventsCount)

export default router;