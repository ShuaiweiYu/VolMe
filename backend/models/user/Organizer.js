import mongoose, {Schema} from 'mongoose';
import { User, UserModel } from './User.js';
import { SUBSCRIPTIONTYPE } from '../enums/subscriptionType.js';

class Organizer extends User {
    constructor(emailAddress, username, hashedPassword) {
        super(emailAddress, username, hashedPassword, "ORGANIZER")
        this.organizationName = ""
        this.averageRating = -1
        this.country = ""
        this.state = ""
        this.city = ""
        this.address = ""
        this.postalCode = ""
        this.isVerified = false
        this.unusedPaidSubscription = 0
        this.subscriptionType = SUBSCRIPTIONTYPE.FREE
        this.subscriptionId = null
        this.files = []
    }
}

const OrganizerSchema = new mongoose.Schema({
    ...UserModel.schema.obj,
    organizationName: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    unusedPaidSubscription: {
        type: Number,
        required: true
    },
    subscriptionType: {
        type: String,
        required: true
    },
    subscriptionId: {
        type: String,
    },
    files:{
        type:[Schema.Types.ObjectId],
        ref:'Document',
        required:false
    },
});

const OrganizerModel = UserModel.discriminator('Organizer', OrganizerSchema)

export { Organizer, OrganizerModel };