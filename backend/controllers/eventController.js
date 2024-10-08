import asyncHandler from "express-async-handler";
import {Event, EventModel, ReviewModel} from '../models/event/Event.js';
import {WishlistItemModel} from "../models/util/WishlistItem.js";
import {UserModel} from "../models/user/User.js";

// @desc Post an event
// @route POST /event
const createEvent = asyncHandler(async (req, res) => {
    const title = req.body.title;
    const organiser = req.body.organiser;

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const isDraft = req.body.isDraft;

    const selectedCountry = req.body.selectedCountry;
    const selectedState = req.body.selectedState;
    const selectedCity = req.body.selectedCity;
    const address = req.body.address;
    const houseNumber = req.body.houseNumber;
    const zipCode = req.body.zipCode;

    const description = req.body.description;
    const peopleNeeded = req.body.peopleNeeded;
    const requiredFiles = req.body.requiredFiles;
    const languages = req.body.languages;
    const category = req.body.category;
    const uploadURL = req.body.uploadURL;
    const creationPlan = req.body.creationPlan;

    const isRegular = req.body.isRegular;
    const isRegularUntil = req.body.isRegularUntil;

    const eventObj = new Event(title, organiser, creationPlan)
    if (isDraft) eventObj.isDraft = isDraft;
    if (startDate) eventObj.startDate = startDate;
    if (endDate) eventObj.endDate = endDate;
    if (selectedCountry) eventObj.selectedCountry = selectedCountry;
    if (selectedState) eventObj.selectedState = selectedState;
    if (selectedCity) eventObj.selectedCity = selectedCity;
    if (address) eventObj.address = address;
    if (houseNumber) eventObj.houseNumber = houseNumber;
    if (zipCode) eventObj.zipCode = zipCode;
    if (description) eventObj.description = description;
    if (peopleNeeded) eventObj.peopleNeeded = peopleNeeded;
    if (requiredFiles) eventObj.requiredFiles = requiredFiles;
    if (languages) eventObj.languages = languages;
    if (category) eventObj.category = category;
    if (uploadURL) eventObj.uploadURL = uploadURL;
    if (isRegular) eventObj.isRegular = isRegular;
    if (isRegularUntil) eventObj.isRegularUntil = isRegularUntil;

    const event = await EventModel.create(eventObj)

    if (event) { // created
        res.status(201).json({
            message: 'New Event created',
            event: event
        });
    } else {
        res.status(400).json({message: 'Invalid event data received'});
    }

});

// @desc Update event details
// @route PUT /event/:id
const updateEvent = asyncHandler(async (req, res) => {
    const eventData = req.body;

    console.log(eventData.title);
    const event = await EventModel.findByIdAndUpdate(req.params.id, eventData, {new: true});

    await event.save();

    if (!event) {
        return res.status(400).json({message: 'Event not found'})
    }

    res.json(event)
    res.status(200).json({message: `Event: ${event.title} ID: ${event._id} is updated`})

});

// @desc Delete an event
// @route DELETE /event/:id
const deleteEvent = asyncHandler(async (req, res) => {
    try {
        const event = await EventModel.findByIdAndDelete(req.params.id);
        res.json(event)

        if (!event) {
            return res.status(400).json({message: 'Event not found'})
        }

        // Delete associated wishlist items
        await WishlistItemModel.deleteMany({event: event._id});

        return res.status(200).json({message: `Event: ${event.title} ID: ${event._id} is deleted`})

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

// @desc Get all events given filters
// @route GET /event
const getEvents = asyncHandler(async (req, res) => {
    try {
        const pageSize = 12
        const page = Number(req.query.page) || 1
        const keyword = req.query.keyword
            ? {title: {$regex: req.query.keyword, $options: 'i'}}
            : {};

        let location = {};
        if (req.query.location) {
            const locationsArray = req.query.location.split(',').map(city => city.trim());
            location = {'selectedCity.name': {$in: locationsArray}};
        }

        const languages = req.query.language ? req.query.language.split(',') : [];
        const languageFilter = languages.length
            ? {languages: {$in: languages}}
            : {};

        const categories = req.query.category ? req.query.category.split(',') : [];
        const categoryFilter = categories.length
            ? {category: {$in: categories}}
            : {};

        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let timeFilter = {};

        if (startDate && endDate) {
            timeFilter = {
                startDate:
                    {$gte: startDate},
                endDate:
                    {$lt: endDate}
            };
        } else if (startDate) {
            timeFilter = {
                startDate:
                    {$gte: startDate}
            };
        } else if (endDate) {
            timeFilter = {
                endDate:
                    {$lt: endDate}
            };
        }

        const filter = {
            ...keyword,
            ...location,
            ...timeFilter,
            ...categoryFilter,
            ...languageFilter
        };

        const count = await EventModel.countDocuments(filter)
        const events = await EventModel.find(filter).limit(pageSize);

        const totalPages = Math.ceil(count / pageSize)

        res.json({
            events, page: page,
            pages: totalPages,
            hasMore: page < totalPages
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error getting events'})
    }
})

const getEventById = asyncHandler(async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id).populate("organiser")
        if (event) {
            return res.json(event)
        } else {
            res.status(404).json({message: 'No Event with this ID'})
        }

    } catch (error) {
        console.error(error);
        res.status(404).json({message: 'Event not found'})
    }
})

const getEventsByOrganiser = asyncHandler(async (req, res) => {
    try {
        const events = await EventModel.find({organiser: req.params.organiserId});
        if (events.length > 0) {
            return res.json(events);
        } else {
            res.status(404).json({message: 'No events found for this organiser'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error fetching events'});
    }
});

const addEventReview = asyncHandler(async (req, res) => {
    const {eventID, userID, rating, comment} = req.body;

    const event = await EventModel.findById(req.params.id);

    const user = await UserModel.findOne({_id: userID})

    if (event) {

        const review = {
            name: user.username,
            eventID: eventID,
            rating: Number(rating),
            comment: comment,
            numberOfLikes: 0,
            createdAt: Date.now(),
            user: userID,
        };

        event.reviews.push(review);
        event.numReviews = event.reviews.length;
        event.rating =
            event.reviews.reduce((acc, item) => item.rating + acc, 0) / event.reviews.length;

        await event.save();
        res.status(201).json({message: 'Review added'});
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

const deleteEventReview = asyncHandler(async (req, res) => {
    const {eventID, userID, reviewID} = req.body;

    try {

        console.log("Event ID: ", eventID);
        console.log("Review ID: ", reviewID);

        const event = await EventModel.findById(req.params.id);

        if (!event) {
            return res.status(404).json({message: 'Event not found'});
        }

        const review = event.reviews.id(reviewID);

        if (!review) {
            return res.status(404).json({message: 'Review not found'});
        }

        /*
        if (review.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'User not authorized to delete this review' });
        }

         */

        event.reviews.pull({_id: reviewID});
        await event.save();
        res.status(200).json({message: 'Review removed'});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

const getMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return {startOfMonth, endOfMonth};
};

const getUserMonthlyEventsCount = asyncHandler(async (req, res) => {
    const {id, creationPlan} = req.body

    const {startOfMonth, endOfMonth} = getMonthRange();

    try {
        const eventCount = await EventModel.countDocuments({
            organiser: id,
            createdAt: {$gte: startOfMonth, $lte: endOfMonth},
            creationPlan: creationPlan
        });

        res.status(200).json({eventCount});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

const getCitiesByEventCount = async (req, res) => {
    try {
        // 使用MongoDB的聚合框架进行统计和排序
        const cities = await EventModel.aggregate([
            {
                $group: {
                    _id: "$selectedCity.name",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $project: {
                    city: "$_id",
                    _id: 0
                }
            }
        ]);

        res.status(200).json(cities);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export default {
    createEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEventById,
    getEventsByOrganiser,
    addEventReview,
    deleteEventReview,
    getUserMonthlyEventsCount,
    getCitiesByEventCount
};
