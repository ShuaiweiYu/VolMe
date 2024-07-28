import asyncHandler from "express-async-handler";
import { Review, ReviewModel } from "../models/event/Review.js";

const postReviewEvent = asyncHandler(async (req, res) => {

    const eventID = req.body.eventID;
    const rating = req.body.rating;
    const comment = req.body.comment;
    const user = req.body.user;

    const reviewObj = new Review(eventID, rating, comment, user );
    const review = await ReviewModel.create(reviewObj)

    if (review) { // created
        res.status(201).json({
            message: 'New Review created',
            review: review
        });
    } else {
        res.status(400).json({ message: 'Invalid review data received' });
    }

});


const updateReview = asyncHandler(async (req, res) => {

    // const { title, date, organiser, location, description, peopleNeeded } = req.fields;

    const eventID = req.body.eventID;
    const rating = req.body.rating;
    const comment = req.body.comment;
    const user = req.body.user;

    const review = await ReviewModel.findByIdAndUpdate(
        req.params.id,
        { eventID, rating, comment, user },
        {new: true}
    )

    await review.save();

    if (!review) {
        return res.status(400).json({ message: 'Review not found' })
    }

    res.json(review)
    res.status(200).json({ message: `Review ID: ${review._id} is updated` })

});

const deleteReview = asyncHandler(async (req, res) => {
    try {
        const review = await ReviewModel.findByIdAndDelete(req.params.id);
        res.json(review)

        if (!review) {
            return res.status(400).json({message: 'Review not found'})
        }

        return res.status(200).json({ message: `Review ID: ${review._id} is deleted`})

    }catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});

export default {
    postReviewEvent,
    updateReview,
    deleteReview
}