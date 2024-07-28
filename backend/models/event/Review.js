import mongoose from 'mongoose';

class Review{
    constructor(eventID, rating, comment ) {
        this.eventID = eventID;
        this.rating = rating;
        this.comment = comment;
        this.user = null;
        this.numberOfLikes = 0;
        this.createdAt = Date.now();
    }
}

const ReviewSchema = new mongoose.Schema({
    eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    numberOfLikes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ReviewModel = mongoose.model('Review', ReviewSchema);

export default { Review, ReviewModel };
