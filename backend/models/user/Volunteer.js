import mongoose, {Schema} from 'mongoose';
import {User, UserModel} from './User.js';

class Volunteer extends User {
    constructor(emailAddress, username, hashedPassword) {
        super(emailAddress, username, hashedPassword, "VOLUNTEER")
        this.firstname = ''
        this.lastname = ''
        this.participationCount = 0;
        this.birthday = null;
        this.skills = [];
        this.languages = [];
        this.gender = null;
        this.participatedEvents = []
        this.country = ""
        this.state = ""
        this.city = ""
        this.address = ""
        this.postalCode = ""
        this.files = []
    }
}

const VolunteerSchema = new mongoose.Schema({
    ...UserModel.schema.obj,
    participationCount: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },
    skills: {
        type: [String]
    },
    languages: {
        type: [String]
    },
    gender: {
        type: String
    },
    participatedEvents: {
        type: [String],
        required: true,
        default: []
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    address: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    files:{
        type:[Schema.Types.ObjectId],
        ref:'Document',
        required:false
    },
})

const VolunteerModel = UserModel.discriminator('Volunteer', VolunteerSchema)
export {Volunteer, VolunteerModel};
