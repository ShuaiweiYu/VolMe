import {Application} from "../models/event/Application.js";
import asyncHandler from "express-async-handler";

/* POST one application http://localhost:3500/application/apply/:eventID */
const createApplication = asyncHandler(async (req, res) => {

    const eventID = req.params.id
    const volunteerID = req.body.volunteerID;
    const files = req.body.files;
    const isDraft = req.body.isDraft;
    const applicationDate = new Date();
    let isPresented = false;

    const applicationExists = await Application.findOne({
        eventID: eventID, volunteerID: volunteerID, isDraft: false
    });

    if (applicationExists) {
        return res
            .status(400)
            .json({message: "You already applied for this event."});
    }
    try {
        const application = await Application.create({
            applicationDate,
            eventID,
            volunteerID,
            isPresented,
            files,
            isDraft
        });


        return res.status(201).json(application);
    } catch (error) {
        return res.status(500).json({message: "Creating application failed, please try again"});
    }
});

/* PUT one application http://localhost:3500/application/apply/:eventID */
const updateApplication = asyncHandler(async (req, res) => {

    const eventID = req.params.id
    const volunteerID = req.body.volunteerID;
    const files = req.body.files;
    const isDraft = req.body.isDraft;
    const applicationDate = new Date();
    let isPresented = false;


    try {
        const application = await Application.findOneAndUpdate({
                eventID: eventID, volunteerID: volunteerID, isDraft: true
            }, {applicationDate, eventID, volunteerID, isPresented, files, isDraft},
            {new: true}
        );
        return res.status(201).json({message: "Your application is updated."});
    } catch (error) {
        return res.status(500).json({message: "Updating application failed, please try again"});
    }
});

/* GET an application by ID http://localhost:3500/application/detail/:applicationID */
const getApplicationByID = asyncHandler(async (req, res) => {
    const applicationID = req.params.applicationID;

    try {
        const application = await Application.findById(applicationID).populate("files");
        if (application) {
            return res.json(application)
        } else {
            return res.status(404).json({message: 'Application not found'})
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

const getAllApplications = asyncHandler(async (req, res) => {
    try {
        const pageSize = 3
        const page = Number(req.query.page) || 1
        const count = await Application.countDocuments()
        const applications = await Application.find().skip(pageSize * (page - 1)).limit(pageSize).select('_id')
        const totalPages = Math.ceil(count / pageSize)
        if (applications) {
            return res.json({
                applications,
                page,
                pages: totalPages,
                hasMore: page < totalPages
            });
        } else {
            return res.status(404).json({message: 'Application not found'})
        }
    } catch (error) {
        return res.status(500).json(error);
    }

})

/* GET all applications by volunteer http://localhost:3500/application/list/volunteer/:volunteerID */
const getApplicationsByVolunteer = asyncHandler(async (req, res) => {
    const volunteerID = req.params.volunteerID;


    try {
        const page = Number(req.query.page) || 1
        const pageSize = 3
        const count = await Application.countDocuments({volunteerID: volunteerID})
        const totalPages = Math.ceil(count / pageSize)

        const applications = await Application.find({
            volunteerID: volunteerID,
        }).skip(pageSize * (page - 1)).limit(pageSize)
            .populate("volunteerID")
            .populate("eventID")
            .sort({status: 1});

        if (applications) {
            return res.json({
                applications,
                page,
                pages: totalPages,
                hasMore: page < totalPages
            });
        } else {
            return res.status(404).json({message: 'Application not found'})
        }
    } catch (error) {
        return res.status(500).json(error);
    }
})

const getApplicationsByEvent = asyncHandler(async (req, res) => {
    const eventID = req.params.eventID;
    try {
        const pageSize = 3;
        const page = parseInt(req.query.page) || 1;
        const status = req.query.status;
        let count
        let totalPages

        const query = {eventID: eventID};
        if (status) {
            query.status = status;
            count = await Application.countDocuments({eventID: eventID, status: status});
            totalPages = Math.ceil(count / pageSize)
        } else {
            count = await Application.countDocuments({eventID: eventID});
            totalPages = Math.ceil(count / pageSize)
        }

        const applications = await Application.find(query)
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .populate("eventID")
            .sort({status: 1});

        if (applications) {
            return res.json({
                applications,
                page,
                pages: totalPages,
                hasMore: page < totalPages
            });
        } else {
            return res.status(404).json({message: 'Application not found'});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});

/* PUT one application http://localhost:3500/application/status/:id */
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const status = req.body.status;
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.applicationID,
            {status},
            {new: true}
        );
        await application.save();

        if (!application) {
            return res
                .status(404)
                .json({errors: [{msg: "Application not found"}]});
        }
        return res.json(application);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

/* PUT one application http://localhost:3500/application/presented/:id */
const updateApplicationPresented = asyncHandler(async (req, res) => {
    const isPresented = req.body.isPresented;
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.applicationID,
            {isPresented},
            {new: true}
        );
        await application.save();
        if (!application) {
            return res
                .status(404)
                .json({errors: [{msg: "Application not found"}]});
        }
        return res.json(application);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

/* DELETE one application http://localhost:3500/application/:id*/
const deleteApplication = asyncHandler(async (req, res) => {
    const id = req.params.applicationID;
    try {
        const application = await Application.findByIdAndDelete(id);
        if (!application) {
            return res
                .status(404)
                .json({errors: [{msg: "Application not found"}]});
        }
        return res.json(application);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})


export default {
    createApplication,
    updateApplication,
    updateApplicationStatus,
    updateApplicationPresented,
    deleteApplication,
    getApplicationByID,
    getApplicationsByEvent,
    getApplicationsByVolunteer,
    getAllApplications
}
