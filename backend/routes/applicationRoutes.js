import express from 'express';
import applicationController from '../controllers/applicationController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();
//router.use(verifyJWT)

router.route('/apply/:id')
    .post(applicationController.createApplication)
router.route('/apply/:id')
    .put(applicationController.updateApplication)

router.route('/detail/:applicationID')
    .get(applicationController.getApplicationByID)
router.route('/listall')
    .get(applicationController.getAllApplications)
router.route('/list/volunteer/:volunteerID')
    .get(applicationController.getApplicationsByVolunteer)
router.route('/list/event/:eventID')
    .get(applicationController.getApplicationsByEvent)

router.route('/status/:applicationID')
    .put(applicationController.updateApplicationStatus)
router.route('/presented/:applicationID')
    .put(applicationController.updateApplicationPresented)

router.route('/:applicationID')
    .delete(applicationController.deleteApplication)

export default router