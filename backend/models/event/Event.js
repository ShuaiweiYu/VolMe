import mongoose from 'mongoose';

const {ObjectId} = mongoose.Schema;

class Event {
    constructor(title, organiser, startDate, endDate, selectedCountry, selectedState, selectedCity, address, houseNumber, zipCode, description, peopleNeeded, category, requiredFiles, languages, uploadURL, creationPlan) {
        this.title = title
        this.organiser = organiser
        this.uploadURL = uploadURL

        this.startDate = startDate
        this.endDate = endDate

        this.selectedCountry = selectedCountry
        this.selectedState = selectedState
        this.selectedCity = selectedCity
        this.address = address
        this.houseNumber = houseNumber
        this.zipCode = zipCode

        this.peopleNeeded = peopleNeeded
        this.description = description
        this.requiredFiles = requiredFiles
        this.languages = languages
        this.category = category
        this.averageRating = 0
        this.isRegular = false
        this.rating = 0
        this.reviews = []
        this.numReviews = 0
        this.creationPlan = creationPlan
    }
}

class Review {
    constructor(eventID, rating, comment) {
        this.name = null;
        this.eventID = eventID;
        this.rating = rating;
        this.comment = comment;
        this.user = null;
        this.createdAt = Date.now();
    }
}

const ReviewSchema = mongoose.Schema({
        name: {type: String,},
        eventID: {type: ObjectId},
        rating: {type: Number, required: true,},
        comment: {type: String, required: true},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {type: Date, default: Date.now}
    },
    {timestamps: true}
)

const EventSchema = mongoose.Schema({
    title: {type: String, required: true},
    organiser: {type: ObjectId, ref: "User", required: true},

    selectedCountry: {type: Object},
    selectedState: {type: Object},
    selectedCity: {type: Object},
    address: {type: String},
    houseNumber: {type: Number},
    zipCode: {type: String},

    startDate: {type: Date},
    endDate: {type: Date},

    peopleNeeded: {type: Number},
    description: {type: String},
    requiredFiles: [String],
    category: [String],
    uploadURL: [String],

    languages: [String],
    isRegular: {type: Boolean},
    isRegularUntil: {type: Date},
    rating: {type: Number, default: 0},
    reviews: [ReviewSchema],
    numReviews: {type: Number, default: 0},
    creationPlan: {type: String, required: true}
}, {timestamps: true});

const EventModel = mongoose.model("Event", EventSchema);
const ReviewModel = mongoose.model("Review", ReviewSchema);

export {Event, EventModel, Review, ReviewModel,}